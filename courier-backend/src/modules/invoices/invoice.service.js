const Shipment = require("../shipments/shipment.model");

/**
 * Aggregate shipments by period (week/month) for invoice generation.
 * Returns a list of "invoice" objects derived from shipment data.
 */
const getInvoices = async (query = {}) => {
    const match = {};
    if (query.fromDate || query.toDate) {
        match.createdAt = {};
        if (query.fromDate) match.createdAt.$gte = new Date(query.fromDate);
        if (query.toDate)   match.createdAt.$lte = new Date(query.toDate + "T23:59:59");
    }
    if (query.status) match.status = query.status;

    // Group by week (ISO week) to simulate invoice periods
    const period = query.period || "monthly";
    const groupId = period === "weekly"
        ? { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } }
        : { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };

    const pipeline = [
        { $match: match },
        {
            $group: {
                _id:          groupId,
                parcels:      { $sum: 1 },
                codTotal:     { $sum: "$codAmount" },
                delivered:    { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
                firstDate:    { $min: "$createdAt" },
                lastDate:     { $max: "$createdAt" },
            },
        },
        { $sort: { firstDate: -1 } },
    ];

    const rows = await Shipment.aggregate(pipeline);

    // Decorate with invoice numbers
    return rows.map((r, i) => ({
        invoiceNo:     `INV-${String(i + 1).padStart(4, "0")}`,
        period,
        fromDate:      r.firstDate,
        toDate:        r.lastDate,
        parcels:       r.parcels,
        delivered:     r.delivered,
        codAmount:     r.codTotal,
        paymentStatus: "pending",
    }));
};

module.exports = { getInvoices };
