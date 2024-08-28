import mongoose, { Document, Model, Schema } from 'mongoose';

interface Guest {
    name: string;
    email: string;
    phoneNumber: string;
}

interface EventDocument extends Document {
    eventName: string;
    date: Date;
    venue: string;
    hostId: Schema.Types.ObjectId;
    guests: Guest[];
    isClosed: boolean;
    contributions: {
        amount: number;
        contributorId: Schema.Types.ObjectId;
    }[];
}

const GuestSchema = new Schema<Guest>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

const ContributionSchema = new Schema({
    amount: { type: Number, required: true },
    contributorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const EventSchema = new Schema<EventDocument>({
    eventName: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guests: { type: [GuestSchema], default: [] },
    contributions: { type: [ContributionSchema], default: [] },
    isClosed: { type: Boolean, default: false }
});


const Event: Model<EventDocument> = mongoose.models?.Event || mongoose.model<EventDocument>('Event', EventSchema);

export default Event;