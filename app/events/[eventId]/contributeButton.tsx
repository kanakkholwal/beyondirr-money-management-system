"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IndianRupee, LoaderCircle, Plus } from 'lucide-react';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import paymentGif from "./payment.gif";


interface GuestType {
    name: string;
    email: string;
    mobileNo: string;
    city: string;
    _id: string;
}
interface ContributeButtonProps {
    sendContribution:(data: {
        amount: number;
        data: {
            name: string;
            city: string;
            mobileNo: string;
            email: string;
        } | string;
    }) => Promise<any>;
}

export default function ContributeButton({ sendContribution }: ContributeButtonProps) {
    const [loading, setLoading] = React.useState(false);
    const [paymentSuccess, setPaymentSuccess] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(0);
    const { data: session } = useSession();
    const [guest, setGuest] = React.useState<GuestType>(session?.user || {
        name: "",
        email: "",
        mobileNo: "",
        city: "",
        _id: ""
    });

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
                <Plus className="size-4 mr-2 inline-block" />
                Add Contribution
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Contribute to event
                </DialogTitle>
                <DialogDescription>
                    Enter the amount you want to contribute
                </DialogDescription>
            </DialogHeader>
            {paymentSuccess ? (
                <Image src={paymentGif} alt="Payment Success" width={512} height={512} className="mx-auto" />
            ) : (<>
                <div className="space-y-3">
                    {guest && (<div className="mt-4 flex gap-4 flex-wrap items-center">
                        <Input type="text" value={guest?.name} disabled={!!session?.user} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="Name" />
                        <Input type="text" value={guest?.city} disabled={!!session?.user} onChange={(e) => setGuest({ ...guest, city: e.target.value })} placeholder="City" />
                        <Input type="text" value={guest?.email} disabled={!!session?.user} onChange={(e) => setGuest({ ...guest, email: e.target.value })} placeholder="Email" />
                        <Input type="text" value={guest?.mobileNo} disabled={!!session?.user} onChange={(e) => setGuest({ ...guest, mobileNo: e.target.value })} placeholder="Mobile No" />
                        <Input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                    </div>)}
                    <Button
                        onClick={async () => {
                            if (!guest.name || !guest.city) {
                                toast.error("Please provide guest details");
                                return;
                            }
                            if (!guest.email && !guest.mobileNo) {
                                toast.error("Please provide email or mobile no");
                                return;
                            }
                            if (amount <= 0) {
                                toast.error("Please provide a valid amount");
                                return;
                            }
                            setLoading(true);
                            try {
                                await sendContribution({
                                    amount,
                                    data: guest?._id?.trim()?.length > 0 ? guest._id : {
                                        name: guest.name,
                                        city: guest.city,
                                        email: guest.email,
                                        mobileNo: guest.mobileNo
                                    }
                                }).then(() => {
                                    setPaymentSuccess(true);
                                    setTimeout(() => {
                                        setPaymentSuccess(false);
                                        setOpen(false);
                                    }, 3000);
                                })
                            } catch (e) {
                                console.log(e);
                                toast.error("Failed to send contribution");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                    >
                        {loading ? <LoaderCircle className="animate-spin mr-2 size-4" /> : <IndianRupee className="mr-2 size-4" />}
                        {loading ? "Processing" : "Send Contribution"}
                    </Button>
                    <p className="text-sm">
                        <Link href={`/register`} className="text-primary underline mr-2">
                            Register
                        </Link>
                        for an account
                    </p>
                </div>
            </>)}
        </DialogContent>
    </Dialog>
    )
    return
}

