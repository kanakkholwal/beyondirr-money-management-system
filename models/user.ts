import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
    name: string;
    email: string;
    mobileNo: string;
    city: string;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
});

// Export the User model and necessary types
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
export default User;
