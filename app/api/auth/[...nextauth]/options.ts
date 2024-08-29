import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

// Define types for environment variables
interface AuthEnv {
  NEXT_AUTH_SECRET: string;
  NEXTAUTH_URL: string;
}

// Read environment variables
const env: AuthEnv = {
  NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
};

// Check if all required environment variables are defined
Object.values(env).forEach((value) => {
  if (!value) {
    throw new Error(`Environment variable ${value} is not defined`);
  }
});

const emailOrMobileNoSchema= z.union([
  z.string().email({ message: "Invalid email address" }), // Validate as email
  z.string().regex(/^\d{10}$/, { message: "Invalid mobile number" }) // Validate as a 10-digit mobile number
]).refine(value => value.length >= 3 && value.length <= 50, {
  message: "Email or Mobile Number must be between 3 and 50 characters long",
});

export const authOptions: NextAuthOptions = {
  // Enable JSON Web Tokens since we will not store sessions in our DB
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 72 hours
  },
  secret: env.NEXT_AUTH_SECRET,
  // Here we add our login providers - this is where you could add Google or Github SSO as well
  providers: [
    CredentialsProvider({
      name: "credentials",
      // The credentials object is what's used to generate Next Auth default login page - We will not use it however.
      credentials: {
        emailOrMobileNo: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Authorize callback is ran upon calling the sign-in function
      authorize: async (credentials) => {
        return new Promise(async (resolve, reject) => {
          if (!credentials || !credentials.emailOrMobileNo || !credentials.password) {
            return reject({
              status: 401,
              message: "Credentials not provided",
              success: false,
            });
          }
          try {

            const result = emailOrMobileNoSchema.safeParse(credentials.emailOrMobileNo);
            if (!result.success) {
              return reject({
                status: 401,
                message: result.error?.message,
                success: false,
              });
            }
            
            await dbConnect();
            const userInDb = await UserModel.findOne({
                $or: [
                    { email: credentials.emailOrMobileNo },
                    { mobileNo: credentials.emailOrMobileNo },
                ],
            }).select("+password");

            if (!userInDb)
              return reject({
                status: 401,
                message: "User not found",
                success: false,
              });
            const pwValid = await userInDb.comparePassword(
              credentials.password
            );

            if (!pwValid)
              return reject({
                status: 401,
                message: "Wrong Password",
                success: false,
              });
            const user = {
              _id: userInDb?._id?.toString(),
              name: userInDb.name,
              email: userInDb?.email,
              mobileNo: userInDb.mobileNo,
              city: userInDb.city,
            };

            console.log("user found", user);
            return resolve(JSON.parse(JSON.stringify(user)));
          } catch (err) {
            console.log(err);
            return reject(err);
          }
        });
      },
    }),
  ],
  // All of this is just to add user information to be accessible for our app in the token/session
  callbacks: {
    // We can pass in additional information from the user document MongoDB returns
    // This could be avatars, role, display name, etc...
    async jwt({ token, user }: { token: any; user: any }): Promise<any> {
      if (user) {
        token.user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNo: user.mobileNo,

        };
      }
      return token;
    },
    // If we want to access our extra user info from sessions we have to pass it the token here to get them in sync:
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },

  pages: {
    // Here you can define your own custom pages for login, recover password, etc.
    signIn: "/login", // Displays sign in buttons
    newUser: "/signup",
    // signOut: '/auth/sign out',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
  },
};