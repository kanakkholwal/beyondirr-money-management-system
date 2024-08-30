import * as z from "zod";

export const rawEventSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters"
    }),
    date: z.date().min(new Date(), {
        message: "Date must be in the future"
    }),
    venue: z.string().min(3, {
        message: "Venue must be at least 3 characters"
    }),
    guests: z.array(
        z.object({
            name: z.string().min(3, { message: "Guest name must be at least 3 characters long" }),
            email: z.string().email({ message: "Invalid email address" }).or(z.string().max(0)).optional(),
            city: z.string().min(3, { message: "City must be at least 3 characters long" }),
            mobileNo: z.string().min(10, { message: "Mobile number must be exactly 10 digits long" })
                .max(10, { message: "Mobile number must be exactly 10 digits long" })
                .or(z.string().max(0)).optional(),
            guestId: z.string().optional().nullable(),
        }).refine(data => data.email || data.mobileNo, {
            message: "Guest must have either an email or a phone number",
            path: ["email", "mobileNo"],
        }))
        .refine(guests => {
            const emails = guests.map(guest => guest.email).filter(Boolean);
            const mobileNos = guests.map(guest => guest.mobileNo).filter(Boolean);

            const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
            const duplicateMobileNos = mobileNos.filter((mobileNo, index) => mobileNos.indexOf(mobileNo) !== index);

            if (duplicateEmails.length > 0 || duplicateMobileNos.length > 0) {
                return false;
            }

            return true;
        }, {
            message: "Duplicate email or phone number cannot be added",
            path: ["guests"]
        }),
});


export type rawEventType = z.infer<typeof rawEventSchema>