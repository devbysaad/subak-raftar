class BaseAdapter {
    async bookShipment(shipmentData, companyId) {
        throw new Error("bookShipment() not implemented");
    }

    async getStatus(trackingNo, companyId) {
        throw new Error("getStatus() not implemented");
    }

    async cancelShipment(trackingNo, companyId) {
        throw new Error("cancelShipment() not implemented");
    }
}

module.exports = BaseAdapter;