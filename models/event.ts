import mongoose, { Document, Model, Schema } from 'mongoose';

interface Guest {
    name: string;
    email: string;
    mobileNo: string;
    city: string;
    guestId: Schema.Types.ObjectId | null;
}

interface EventDocument extends Document {
    name: string;
    date: Date;
    venue: string;
    hostId: Schema.Types.ObjectId;
    guests: Guest[];
    isClosed: boolean;
    contributions: {
        amount: number;
        contributorId: string;
    }[];
}

export interface EventJSON {
    _id: string;
    name: string;
    date: Date;
    venue: string;
    hostId: string;
    guests: Guest[];
    isClosed: boolean;
    contributions: {
        amount: number;
        contributorId: string;
    }[];
}

const GuestSchema = new Schema<Guest>({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    mobileNo: { type: String, unique: true, sparse: true },
    city: { type: String},
    guestId: { type: Schema.Types.ObjectId, ref: 'User', sparse: true }
});

const ContributionSchema = new Schema({
    amount: { type: Number, required: true },
    contributorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const EventSchema = new Schema<EventDocument>({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guests: { type: [GuestSchema], default: [] },
    contributions: { type: [ContributionSchema], default: [] },
    isClosed: { type: Boolean, default: false }
});


const Event: Model<EventDocument> = mongoose.models?.Event || mongoose.model<EventDocument>('Event', EventSchema);

export default Event;