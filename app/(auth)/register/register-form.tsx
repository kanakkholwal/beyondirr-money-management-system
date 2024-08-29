"use client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiLockOpenAlt } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { LuMail } from "react-icons/lu";
import { rawUserSchema, rawUserType } from "./schema";

interface Props {
    registerUser: (data: rawUserType) => Promise<{
        success: boolean;
        message: string;
    }>;
}

export function RegisterForm({ registerUser }: Props) {

    const [loading, setLoading] = useState(false);

    const form = useForm<rawUserType>({
        resolver: zodResolver(rawUserSchema),
        defaultValues: {
            name: "",
            city: "",
            password: "",
            email: "",
            mobileNo: "",
        },
    });
    async function onSubmit(data: rawUserType) {
        console.log(data);
        setLoading(true);
        toast.promise(registerUser(data), {
            loading: "Creating account...",
            success: (data: any) => {
                console.log(data);
                setState("registered");
                setLoading(false);
                return `Account created successfully. Please check your email to verify your account`;
            },
            error: (err) => {
                console.log(err);
                setLoading(false);
                return err.message || "An error occurred while creating account";
            },
        });
    }

    const [state, setState] = useState<"onboarding" | "registered">("onboarding");

    return (
        <>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full max-w-lg items-center gap-1.5"
                >
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative group">
                                        <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                            <UserRound className="w-4 h-4" />
                                        </FormLabel>
                                        <FormControl className="relative">
                                            <Input
                                                placeholder="John Doe"
                                                type="text"
                                                autoCapitalize="none"
                                                autoComplete="name"
                                                disabled={loading}
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
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative group">
                                        <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                            <MapPin className="w-4 h-4" />
                                        </FormLabel>
                                        <FormControl className="relative">
                                            <Input
                                                placeholder="Delhi"
                                                type="text"
                                                autoCapitalize="none"
                                                autoComplete="city"
                                                disabled={loading}
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
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative group">
                                    <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                        <LuMail className="w-4 h-4" />
                                    </FormLabel>
                                    <FormControl className="relative">
                                        <Input
                                            placeholder="johndoe@acme.com"
                                            type="email"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            disabled={loading}
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
                        name="mobileNo"
                        render={({ field }) => (
                            <FormItem>
                                <div className="relative group">
                                    <FormLabel className="absolute top-1/2 -translate-y-1/2 left-4 z-50">
                                        <LuMail className="w-4 h-4" />
                                    </FormLabel>
                                    <FormControl className="relative">
                                        <Input
                                            placeholder="08012345678"
                                            type="tel"
                                            autoCapitalize="none"
                                            autoComplete="tel"
                                            disabled={loading}
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
                                            disabled={loading}
                                            className="pl-10 pr-5"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={loading}
                        className="mt-4 w-full"
                        type="submit"
                    >
                        {loading && <CgSpinner className="animate-spin mr-2" />}
                        {loading ? "Creating account..." : "Create a new Account"}
                    </Button>
                </form>
            </Form>

        </>
    );
}