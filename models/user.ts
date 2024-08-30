import * as bcrypt from "bcryptjs";
import mongoose, { CallbackError, Document, Model, Schema } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  mobileNo: string;
  city: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String, unique: true, sparse: true
  },
  mobileNo: {
    type: String, required: true, sparse: true,
    
  },
  city: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Your password must be at least 6 characters long"],
    select: false, // Don't send back password after request
  },
}, {
  timestamps: true,
}
);


UserSchema.pre<IUser>('save', async function (next) {
  if (!this.mobileNo && !this.email) {
    next(new Error('User must have either a mobile number or an email'));
  }
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    return next(err as CallbackError);
  }
});
// Method to compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    if (!this.password) {
      throw new Error('Password not set for this user');
    }
    return await bcrypt.compare(password, this.password);
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// Export the User model and necessary types
const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
export default User;
