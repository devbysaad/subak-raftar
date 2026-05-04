import { z } from "zod";

export const createLoadSheetSchema = z.object({
    parcelIds: z
        .array(z.string().min(1))
        .min(1, "At least one parcel ID is required"),
});
