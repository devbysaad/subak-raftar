const ROLES = {
    ADMIN: "admin",
    EMPLOYEE: "employee",
};

const SHIPMENT_STATUS = {
    BOOKED: "booked",
    RECEIVED: "received",
    IN_TRANSIT: "in_transit",
    OUT_FOR_DELIVERY: "out_for_delivery",
    DELIVERED: "delivered",
    FAILED: "failed",
    CANCELLED: "cancelled",
};

const COD_STATUS = {
    PENDING: "pending",
    COLLECTED: "collected",
    REMITTED: "remitted",
};

const PROVIDERS = {
    TCS: "tcs",
    LEOPARDS: "leopards",
    TRAX: "trax",
    MP: "mp",
    SELF: "self",
};

module.exports = { ROLES, SHIPMENT_STATUS, COD_STATUS, PROVIDERS };
