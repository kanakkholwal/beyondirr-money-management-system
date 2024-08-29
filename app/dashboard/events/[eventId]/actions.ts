"use server";

import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event";
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

        event.isClosed = true;
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
