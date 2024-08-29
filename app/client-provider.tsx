// provider.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { Next13ProgressBar } from "next13-progressbar";
import { Toaster } from "react-hot-toast";

export function Provider({ children }: { children: React.ReactNode }) {

    return (
        <SessionProvider>
            {children}
            <Next13ProgressBar
                height="4px"
                color="hsl(var(--primary))"
                options={{ showSpinner: true, trickle: true }}
                showOnShallow={true}
            />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    // Define default options
                    duration: 2500,
                }}
            />

        </SessionProvider>
    );
}