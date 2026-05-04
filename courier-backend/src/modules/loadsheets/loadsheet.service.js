import LoadSheet from "./loadsheet.model.js";
import Shipment from "../shipments/shipment.model.js";

const generateSheetNo = async () => {
    const today  = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const prefix = `LS-${today}-`;
    const count  = await LoadSheet.countDocuments({ loadSheetNo: { $regex: `^${prefix}` } });
    return `${prefix}${String(count + 1).padStart(3, "0")}`;
};

export const createLoadSheet = async (parcelIds, userId) => {
    // Accept either a MongoDB ObjectId (24 hex chars) or a providerTrackingNo string.
    // Resolve tracking numbers to their shipment _id before saving.
    const resolvedIds = await Promise.all(
        parcelIds.map(async (id) => {
            if (/^[a-f\d]{24}$/i.test(id)) return id; // already an ObjectId

            const shipment = await Shipment.findOne({ providerTrackingNo: id }).lean();
            if (!shipment) throw Object.assign(
                new Error(`No shipment found with tracking number: ${id}`),
                { status: 404 }
            );
            return shipment._id;
        })
    );

    const loadSheetNo = await generateSheetNo();
    const sheet = await LoadSheet.create({ loadSheetNo, parcelIds: resolvedIds, createdBy: userId });
    return sheet.populate("createdBy", "name");
};

export const getLoadSheets = async (query = {}) => {
    const filter = {};
    if (query.loadSheetNo) filter.loadSheetNo = { $regex: query.loadSheetNo, $options: "i" };
    if (query.fromDate || query.toDate) {
        filter.createdAt = {};
        if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
        if (query.toDate)   filter.createdAt.$lte = new Date(query.toDate + "T23:59:59");
    }

    const page  = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, parseInt(query.limit) || 25);
    const skip  = (page - 1) * limit;

    const [items, total] = await Promise.all([
        LoadSheet.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("createdBy", "name"),
        LoadSheet.countDocuments(filter),
    ]);

    return { items, total, page, pages: Math.ceil(total / limit) };
};

export const getLoadSheetById = async (id) => {
    const sheet = await LoadSheet.findById(id).populate("parcelIds").populate("createdBy", "name");
    if (!sheet) throw Object.assign(new Error("Load sheet not found"), { status: 404 });
    return sheet;
};
