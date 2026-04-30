import { success, failure } from "../../utils/response.utils.js";
import { getInvoices } from "./invoice.service.js";

export const list = async (req, res) => {
    try {
        const invoices = await getInvoices(req.query);
        res.json(success(invoices));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};
