"use server";
import { Schema } from 'mongoose';

import dbConnect from "@/lib/dbConnect";
import Event from "@/models/event";


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

export async function sendContribution(eventId: string, amount: number) {
    try {
        await dbConnect();
        const userOrGuestId = "123" as unknown as Schema.Types.ObjectId;

        const event = await Event.findById(eventId);
        if (!event) {
            return Promise.reject({ message: 'Event not found', data: null });
        }

        event.contributions.push({
            amount,
            contributorId: userOrGuestId
        });
        await event.save();
        return Promise.resolve({ message: 'Contribution sent', data: true });
    }
    catch (error) {
        console.log(error);
        return Promise.reject({ message: 'Failed to send contribution', data: null });
    }
}
