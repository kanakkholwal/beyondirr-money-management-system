"use server";

import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Event, { EventJSON } from "@/models/event";
import mongoose from "mongoose";

export async function getAnalytics() {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject(new Error("User not authenticated"));
        }
        await dbConnect();

        const receivedContributions = await Event.aggregate([
            {
                $match: {
                    hostId: new mongoose.Types.ObjectId(session.user._id)
                }
            },
            {
                $unwind: '$contributions' // Unwind contributions to sum them individually
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$contributions.amount' }
                }
            }
        ]);

        const contributions = await Event.aggregate([
            {
                $match: {
                    'contributions.contributor': new mongoose.Types.ObjectId(session.user._id) // Corrected to ObjectId type
                }
            },
            {
                $unwind: '$contributions' // Unwind contributions to sum them individually
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$contributions.amount' }
                }
            }
        ]);

        return Promise.resolve({
            receivedContributions: receivedContributions[0]?.totalAmount || 0,
            contributions: contributions[0]?.totalAmount || 0
        });
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function getGifts() {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject(new Error("User not authenticated"));
        }
        await dbConnect();

        const received_contributions = await Event.aggregate([
            {
                $match: {
                    hostId: new mongoose.Types.ObjectId(session.user._id)
                }
            },
            {
                $unwind: '$contributions'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'contributions.contributor',
                    foreignField: '_id',
                    as: 'contributorDetails'
                }
            },
            {
                $unwind: '$contributorDetails'
            },
            {
                $addFields: {
                    'contributions.contributor': '$contributorDetails'
                }
            },
            {
                $project: {
                    contributorDetails: 0 // Exclude the temporary field used for lookup
                }
            }
        ]);

        const contributed_contributions = await Event.aggregate([
            {
                $match: {
                    $or: [
                        { 'contributions.contributor': new mongoose.Types.ObjectId(session.user._id) },
                        { 'contributions.contributor.email': session.user.email },
                        { 'contributions.contributor.mobileNo': session.user.mobileNo }
                    ]
                }
            },
            {
                $unwind: '$contributions'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'contributions.contributor',
                    foreignField: '_id',
                    as: 'contributorDetails'
                }
            },
            {
                $unwind: '$contributorDetails'
            },
            {
                $addFields: {
                    'contributions.contributor': '$contributorDetails'
                }
            },
            {
                $project: {
                    contributorDetails: 0 // Exclude the temporary field used for lookup
                }
            }
        ]);

        return Promise.resolve({
            received: received_contributions || [],
            contributed: contributed_contributions || []
        });

    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}


export async function getEvents(): Promise<EventJSON[]> {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject(new Error("User not authenticated"));
        }
        await dbConnect();
        const events = await Event.find({
            hostId: session.user._id
        });
        return Promise.resolve(JSON.parse(JSON.stringify(events)));
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}