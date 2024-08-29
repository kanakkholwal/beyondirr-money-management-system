"use client";
import { signIn } from "next-auth/react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { BiLockOpenAlt } from "react-icons/bi";
import { LuMail } from "react-icons/lu";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";
import * as z from "zod";

const formSchema = z.object({
    emailOrMobileNo: z.union([
        z.string().email({ message: "Invalid email address" }), // Validate as email
        z.string().regex(/^\d{10}$/, { message: "Invalid mobile number" }) // Validate as a 10-digit mobile number
    ]).refine(value => value.length >= 3 && value.length <= 50, {
        message: "Email or Mobile Number must be between 3 and 50 characters long",
    }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = (
        searchParams?.get("callbackUrl")
            ? searchParams?.get("callbackUrl")
            : searchParams?.get("redirect") || "/dashboard"
    ) as string;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailOrMobileNo: "",
            password: "",
        },
    });
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);

        setIsLoading(true);

        toast.promise(signInPromise(data), {
            loading: "Logging in...",
            success: (data: any) => {
                console.log(data);
                setIsLoading(false);
                if (callbackUrl) {
                    router.push(callbackUrl);
                    return `Logged in successfully to ${callbackUrl}`;
                }
                router.push("/dashboard");
                return `Logged in successfully to dashboard`;
            },
            error: (err: any) => {
                console.log(err);
                setIsLoading(false);
                return err.message || "An error occurred while logging in";
            },
        });
    }
    const signInPromise = async (data: z.infer<typeof formSchema>) =>
        new Promise(async (resolve, reject) => {
            try {
                signIn("credentials", {
                    emailOrMobileNo: data.emailOrMobileNo,
                    password: data.password,
                    redirect: false,
                })
                    .then((data) => {
                        console.log(data);
                        if (data && data.ok === false) {
                            reject(data.error);
                            return;
                        } else if (data && data.ok === true) {
                            resolve(data);
                            return;
                        }
                        resolve(data);
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    });
            } catch (error: any) {
                reject(error);
            }
        });


    return (
        <div
            className={cn("grid gap-6 lg:max-w-lg text-left", className)}
            {...props}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="emailOrMobileNo"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative group">
                                    <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                        <LuMail className="w-4 h-4" />
                                    </FormLabel>
                                    <FormControl className="relative">
                                        <Input
                                            placeholder="name@example.com or 10-digit mobile number"
                                            autoCapitalize="none"
                                            disabled={isLoading}
                                            autoCorrect="off"
                                            className="pl-10 pr-5"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative group">
                                    <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                        <BiLockOpenAlt className="w-4 h-4" />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*********"
                                            type="password"
                                            autoCapitalize="none"
                                            autoComplete="password"
                                            autoCorrect="off"
                                            disabled={isLoading}
                                            className="pl-10 pr-5 !mt-0"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="mt-2 tracking-wide"
                        variant="default"
                    >
                        {isLoading && (
                            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                    </Button>
                </form>
            </Form>
        </div>
    );
}