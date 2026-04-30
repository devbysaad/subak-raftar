import Complaint from "./complaint.model.js";
import Shipment  from "../shipments/shipment.model.js";

export const createComplaint = async (data, userId) => {
    const shipment = await Shipment.findOne({ providerTrackingNo: data.parcelNo }).lean();
    return Complaint.create({
        parcelNo:   data.parcelNo,
        shipmentId: shipment?._id || null,
        status:     data.status  || "open",
        remarks:    data.remarks || "",
        rStatus:    data.rStatus || "",
        cStatus:    data.cStatus || "",
        createdBy:  userId,
    });
};

export const getComplaints = async (query = {}) => {
    const filter = {};
    if (query.parcelNo) filter.parcelNo = { $regex: query.parcelNo, $options: "i" };
    if (query.rStatus)  filter.rStatus  = query.rStatus;
    if (query.cStatus)  filter.cStatus  = query.cStatus;
    if (query.fromDate || query.toDate) {
        filter.createdAt = {};
        if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
        if (query.toDate)   filter.createdAt.$lte = new Date(query.toDate + "T23:59:59");
    }

    const page  = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || 25);
    const skip  = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Complaint.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("createdBy", "name"),
        Complaint.countDocuments(filter),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
};
