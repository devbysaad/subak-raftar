const { z } = require("zod");
const { PROVIDERS } = require("../../config/constants");

const addressSchema = z.object({
    name:    z.string().min(1),
    phone:   z.string().min(10),
    address: z.string().min(1),
    city:    z.string().min(1),
});

const createShipmentSchema = z.object({
    receiver:           addressSchema,
    weight:             z.number().positive(),
    itemType:           z.string().optional(),
    quantity:           z.number().positive().optional(),
    specialInstruction: z.string().optional(),
    provider:           z.enum(Object.values(PROVIDERS)),
    isCOD:              z.boolean().optional(),
    codAmount:          z.number().min(0).optional(),
    notes:              z.string().optional(),
});

const updateStatusSchema = z.object({
    status: z.enum([
        "booked",
        "received",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed",
        "cancelled",
    ]),
    note: z.string().optional(),
});

module.exports = { createShipmentSchema, updateStatusSchema };
