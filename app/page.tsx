import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {

  const session = await getSession();
  const authenticated = !!session?.user;


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-32">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Money Gift Management Web Application
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">

        <Link
          href={authenticated ? "/dashboard" : "/login"}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 "
        >
          <h2 className="mb-3 text-2xl font-semibold">
            {authenticated ? "Dashboard" : "Login"}{" "}
            {" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {authenticated ? "Go to your dashboard" : "Login to your account"}
          </p>
        </Link>

      </div>
    </main>
  );
}
