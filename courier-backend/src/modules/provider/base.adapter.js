class BaseAdapter {
    async bookShipment(_shipmentData, _keys) {
        throw new Error("bookShipment() not implemented");
    }

    async getStatus(_trackingNo, _keys) {
        throw new Error("getStatus() not implemented");
    }

    async cancelShipment(_trackingNo, _keys) {
        throw new Error("cancelShipment() not implemented");
    }
}

module.exports = { BaseAdapter };
