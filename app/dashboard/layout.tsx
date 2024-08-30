import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!(session && session.user)) {
        redirect("/login");
        return null
    }

    return children
}