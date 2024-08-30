import "next-auth";
import { sessionUserType } from "@/types/user";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: sessionUserType;
    expires: string;
  }
}
