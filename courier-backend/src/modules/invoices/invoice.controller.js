const invoiceService = require("./invoice.service");
const { success, failure } = require("../../utils/response.utils");

const list = async (req, res) => {
    try {
        const invoices = await invoiceService.getInvoices(req.query);
        res.json(success(invoices));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

module.exports = { list };
