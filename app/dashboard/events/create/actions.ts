"use server";
import { InviteEmail } from "@/emails/invite-template";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event";
import User from "@/models/user";
import { rawEventType } from "@/types/event";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createEvent(eventData: rawEventType) {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject(new Error("User not authenticated"));
        }
        await dbConnect();
        const event = new Event({
            ...eventData,
            hostId: session.user!._id,
        });


        const { data, error } = await resend.emails.send({
            from: `Event Invitation <send@nexonauts.com>`,
            to: event.guests.filter(guest => guest.email).map(guest => guest.email),
            subject: 'Event Invitation',
            react: InviteEmail({ name: event.name, hostName: session.user!.name, date: event.date.toISOString(), venue: event.venue, 
                inviteLink: `${process.env.NEXTAUTH_URL}/events/${event._id}` 
            })
        });

        if (error) {
            console.log(error);
            return Promise.reject(error);
        }

        await event.save();

        return Promise.resolve(JSON.parse(JSON.stringify(event)));
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function getGuests(emailOrMobileNo: string): Promise<{
    name: string;
    email: string;
    mobileNo: string;
    city: string;
    _id: string;
}[]> {
    try {
        await dbConnect();
        const guests = await User.find({
            $or: [
                { email: { $regex: emailOrMobileNo, $options: "i" } },
                { mobileNo: { $regex: emailOrMobileNo, $options: "i" } },
            ],
        }).limit(10);

        return Promise.resolve(JSON.parse(JSON.stringify(guests)));

    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

