"use server";

import { getSession } from '@/lib/auth';
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event";
import { revalidatePath } from 'next/cache';



export async function getEvent(eventId: string) {
    try {
        await dbConnect();

        const event = await Event.findById(eventId);
        return Promise.resolve(JSON.parse(JSON.stringify(event)));
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

export async function sendContribution(eventId: string, data: {
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
        await dbConnect();

        const event = await Event.findById(eventId);
        if (!event) {
            return Promise.reject({ message: 'Event not found', data: null });
        }

        event.contributions.push({
            amount:data.amount,
            // contributor: data.data
            contributor: session?.user?._id ? session.user._id : data.data 
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
