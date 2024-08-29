import { z } from "zod";

export const rawUserSchema = z.object({
    name: z.string().min(4, {
        message: "Name must be at least 4 characters long",
    }),
    city: z.string().min(3, {
        message: "City must be at least 3 characters long",
    }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
    email: z.string().email().optional(),
    mobileNo: z.string().min(10).max(10).or(z.string().max(0)).optional(),
}).refine(data => {
    // Check if either email or mobileNo is valid
    return data.email || data.mobileNo;
}, {
    message: "User must have either an email or a phone number",
    path: ["email", "mobileNo"],
});
export type rawUserType = z.infer<typeof rawUserSchema>