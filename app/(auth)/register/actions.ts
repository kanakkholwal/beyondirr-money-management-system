"use server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { rawUserType } from "./schema";


export async function registerUser(data: rawUserType) {
    try {
        await dbConnect();
        const userExists = await User.findOne({
            $or: [
                { email: data.email },
                { mobileNo: data.mobileNo },
            ],
        });
        if (userExists) {
            return Promise.reject({
                status: 409,
                message: "User already exists",
                success: false,
            });
        }
        const user = new User(data);
        await user.save();
        return Promise.resolve({
            success: true,
            message: "Account created successfully.You can Login now",
        });
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}