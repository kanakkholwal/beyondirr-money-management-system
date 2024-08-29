import { getSession } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { registerUser } from "./actions";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
    title: "Register | NexoNauts",
};

interface PageProps {
    searchParams: {
        redirect?: string;
    };
}

export default async function Page({ searchParams }: PageProps) {
    const session = await getSession();
    if (session) return redirect("/dashboard");

    const IsWaitingList = true;

    return (
        <div className="mt-20">
            <header className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome!</h1>
                <p className="text-sm text-muted-foreground">
                    Register for a seamless experience or <Link href="/login" className="text-primary underline">login</Link>
                </p>
            </header>

            <main className="flex flex-col items-center justify-center w-full p-4 space-y-4">
                <RegisterForm registerUser={registerUser} />
            </main>
        </div>
    );
}