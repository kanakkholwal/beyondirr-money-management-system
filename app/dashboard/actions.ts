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

interface GiftType {
    _id: string;
    event: string;
    amount: number;
    contributor: {
        name: string;
        email: string;
        mobileNo: string;
    }
}

export async function getGifts(): Promise<{ received: GiftType[], contributed: GiftType[] }> {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject(new Error("User not authenticated"));
        }
        await dbConnect();

        const hosted_events = await Event.find({
            hostId: session.user._id
        }).populate('contributions.contributor').lean().exec();

        const received_contributions = hosted_events.map(event => {
            return event.contributions.map(contribution => {
                return {
                    ...contribution,
                    _id: event._id.toString(),
                    event: event.name
                }
            })
        }).flat() as GiftType[]

        const contributed_events = await Event.find({
            $or: [
                { 'contributions.contributor': new mongoose.Types.ObjectId(session.user._id) },
                { 'contributions.contributor.email': session.user.email },
                { 'contributions.contributor.mobileNo': session.user.mobileNo }
            ]
        }).populate('contributions.contributor').lean().exec();

        const contributed_contributions = contributed_events.map(event => {
            return event.contributions.map(contribution => {
                return {
                    ...contribution,
                    _id: event._id.toString(),
                    event: event.name
                }
            })
        }).flat() as GiftType[]

        // const received_contributions = await Event.aggregate([
        //     {
        //         $match: {
        //             hostId: new mongoose.Types.ObjectId(session.user._id)
        //         }
        //     },
        //     {
        //         $unwind: '$contributions'
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'contributions.contributor',
        //             foreignField: '_id',
        //             as: 'contributorDetails'
        //         }
        //     },
        //     {
        //         $unwind: '$contributorDetails'
        //     },
        //     {
        //         $addFields: {
        //             'contributions.contributor': '$contributorDetails'
        //         }
        //     },
        //     {
        //         $project: {
        //             contributorDetails: 0 // Exclude the temporary field used for lookup
        //         }
        //     }
        // ]);

        // const contributed_contributions = await Event.aggregate([
        //     {
        //         $match: {
        //             $or: [
        //                 { 'contributions.contributor': new mongoose.Types.ObjectId(session.user._id) },
        //                 { 'contributions.contributor.email': session.user.email },
        //                 { 'contributions.contributor.mobileNo': session.user.mobileNo }
        //             ]
        //         }
        //     },
        //     {
        //         $unwind: '$contributions'
        //     },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'contributions.contributor',
        //             foreignField: '_id',
        //             as: 'contributorDetails'
        //         }
        //     },
        //     {
        //         $unwind: '$contributorDetails'
        //     },
        //     {
        //         $addFields: {
        //             'contributions.contributor': '$contributorDetails'
        //         }
        //     },
        //     {
        //         $project: {
        //             contributorDetails: 0 // Exclude the temporary field used for lookup
        //         }
        //     }
        // ]);

        return Promise.resolve({
            received: received_contributions || [],
            contributed: contributed_contributions || []
        });

    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

export async function getTopGuestsAndHosts() {
    try {
        const session = await getSession();
        if (!session) {
            return Promise.reject(new Error("User not authenticated"));
        }

        await dbConnect();

        // Top Guests Based on Contributions Received
        const topGuests = await Event.aggregate([
            {
                $match: {
                    hostId: new mongoose.Types.ObjectId(session.user._id)
                }
            },
            {
                $unwind: '$contributions'
            },
            {
                $group: {
                    _id: '$contributions.contributor',
                    totalAmount: { $sum: '$contributions.amount' }
                }
            },
            {
                $sort: { totalAmount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: '_id',
                    foreignField: '_id',
                    as: 'contributorDetails'
                }
            },
            {
                $unwind: '$contributorDetails'
            },
            {
                $project: {
                    _id: 0,
                    contributor: '$contributorDetails.name',
                    email: '$contributorDetails.email',
                    mobileNo: '$contributorDetails.mobileNo',
                    totalAmount: 1
                }
            }
        ]);

        // Top Hosts the User Has Contributed To
        const topHosts = await Event.aggregate([
            {
                $match: {
                    'contributions.contributor': new mongoose.Types.ObjectId(session.user._id)
                }
            },
            {
                $group: {
                    _id: '$hostId',
                    totalAmount: { $sum: '$contributions.amount' }
                }
            },
            {
                $sort: { totalAmount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hostDetails'
                }
            },
            {
                $unwind: '$hostDetails'
            },
            {
                $project: {
                    _id: 0,
                    host: '$hostDetails.name',
                    email: '$hostDetails.email',
                    mobileNo: '$hostDetails.mobileNo',
                    totalAmount: 1
                }
            }
        ]);

        return Promise.resolve({ topGuests, topHosts });
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