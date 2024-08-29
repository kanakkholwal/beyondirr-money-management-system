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

export async function sendContribution(eventId: string, amount: number) {
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
            amount,
            contributorId: session.user._id
            // contributorId: new mongoose.Types.ObjectId(session.user._id) 
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
