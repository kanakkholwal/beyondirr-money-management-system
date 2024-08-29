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
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import paymentGif from "./payment.gif";

interface ContributeButtonProps {
    sendContribution: (amount: number) => Promise<any>;
}

export default function ContributeButton({ sendContribution }: ContributeButtonProps) {
    const [loading, setLoading] = React.useState(false);
    const [paymentSuccess, setPaymentSuccess] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(0);

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
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <Button
                    onClick={async () => {
                        setLoading(true);
                        try {
                            await sendContribution(amount).then(() => {
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
            </>)}
        </DialogContent>
    </Dialog>
    )
    return
}

//  payment success lottiefile
// https://lottie.host/81a37d1b-5034-4292-999b-e1d2aa25dc07/kI6MQUsIfN.json