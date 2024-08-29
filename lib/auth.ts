import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { sessionType } from "@/types/session";
import { getServerSession } from "next-auth/next";

export const getSession = async (): Promise<sessionType | null> => {
  return await getServerSession(authOptions);
};