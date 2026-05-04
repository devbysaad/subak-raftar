import { z } from "zod";

export const createComplaintSchema = z.object({
    parcelNo: z.string().min(1, "Parcel number is required"),
    status:   z.string().min(1, "Status is required"),
    remarks:  z.string().min(1, "Remarks are required"),
});

export const searchComplaintSchema = z.object({
    parcelNo: z.string().optional(),
    rStatus:  z.string().optional(),
    cStatus:  z.string().optional(),
    fromDate: z.string().optional(),
    toDate:   z.string().optional(),
});
