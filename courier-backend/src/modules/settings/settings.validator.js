import { z } from "zod";

export const updateSettingsSchema = z.object({
    companyName: z.string().min(1).optional(),
    email:       z.string().email().optional(),
    phone:       z.string().optional(),
    address:     z.string().optional(),
});

export const updateProviderKeySchema = z.object({
    apiKey:      z.string().min(1, "API key is required"),
    apiPassword: z.string().min(1, "API password is required"),
});

export const updateShopifySchema = z.object({
    storeName: z.string().min(1, "Store name is required"),
    apiKey:    z.string().min(1, "API key is required"),
    apiSecret: z.string().min(1, "API secret is required"),
});
