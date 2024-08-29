import { getSession } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserAuthForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login | NexoNauts",
};
interface PageProps {
  searchParams: {
    redirect?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const session = await getSession();
  if (session) return redirect("/dashboard");

  return (
    <div className="mt-20">
      <header className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back!</h1>
        <p className="text-sm text-muted-foreground">
          Log in for a seamless experience or <Link href="/register" className="text-primary underline">register</Link>
        </p>
      </header>
      <main className="flex flex-col items-center justify-center w-full p-4 space-y-4">
        <UserAuthForm className="flex-auto w-full" key={"form"} />
      </main>
    </div>
  );
}