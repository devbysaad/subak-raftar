export class BaseAdapter {
    async bookShipment(_shipmentData) {
        throw new Error("bookShipment() not implemented");
    }

    async getStatus(_trackingNo) {
        throw new Error("getStatus() not implemented");
    }

    async cancelShipment(_trackingNo) {
        throw new Error("cancelShipment() not implemented");
    }
}
