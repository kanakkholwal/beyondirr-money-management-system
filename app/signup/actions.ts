import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";


export async function createUser(data: {
    mobileNo: string;
    name: string;
    city: string;
    email: string;
}) {

    const { mobileNo, name, city, email } = data;
    try {
        await dbConnect();

        const userExists = await User.findOne({ $or: [{ mobileNo }, { email }] });
        if (userExists) {
            return Promise.reject({ message: 'User already exists', data: null });
        }

        const newUser = new User({ mobileNo, name, city, email });
        await newUser.save();

        return Promise.resolve({
            message: 'User created successfully',
            data: {
                mobileNo: newUser.mobileNo,
                name: newUser.name,
                city: newUser.city,
                email: newUser.email
            }
        })
    } catch (error) {
        console.log(error);
        return null;
    }
}