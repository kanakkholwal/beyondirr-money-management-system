"use server";

import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event";
import User from "@/models/user";
import { revalidatePath } from "next/cache";


export async function getEvent(eventId: string) {
    try {
        await dbConnect();

        const event = await Event.findById(eventId)
        return Promise.resolve(JSON.parse(JSON.stringify(event)))
        
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

export async function closeEvent(eventId: string) {
    try {
        await dbConnect();

        const event = await Event.findById(eventId);
        if (!event) {
            return Promise.reject({ message: 'Event not found', data: null });
        }

        event.isClosed = !event.isClosed;
        await event.save();
        revalidatePath(`/dashboard/events/${eventId}`);
        revalidatePath(`/events/${eventId}`);
        return Promise.resolve({ message: 'Event closed', data: true });
    }
    catch (error) {
        console.log(error);
        return Promise.reject({ message: 'Failed to close event', data: null });
    }
}

export async function addContribution(eventId: string, data: {
    amount: number;
    data:{
        name: string;
        city: string;
        mobileNo: string;
        email: string;
    } | string;
}) {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject({ message: 'User not authenticated', data: null });
        }
        await dbConnect();

        const event = await Event.findById(eventId);
        if (!event) {
            return Promise.reject({ message: 'Event not found', data: null });
        }

        event.contributions.push({
            amount:data.amount,
            contributor: data.data
            // contributor: new mongoose.Types.ObjectId(session.user._id) 
        });
        await event.save();
        revalidatePath(`/dashboard`);
        revalidatePath(`/dashboard/events/${eventId}`);
        return Promise.resolve({ message: 'Contribution sent', data: true });
    }
    catch (error) {
        console.log(error);
        return Promise.reject({ message: 'Failed to send contribution', data: null });
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
