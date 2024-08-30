"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
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
import { getGuests } from "./actions";
import paymentGif from "./payment.gif";


interface GuestType {
    name: string;
    email: string;
    mobileNo: string;
    city: string;
    guestId?: string | null;
}

interface AddContributeButtonProps {
    addContribution: (data: {
        amount: number;
        data: {
            name: string;
            city: string;
            mobileNo: string;
            email: string;
        } | string;
    }) => Promise<any>;
}

export default function AddContributeButton({ addContribution }: AddContributeButtonProps) {
    const [loading, setLoading] = React.useState(false);
    const [paymentSuccess, setPaymentSuccess] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(0);
    const [guests, setGuests] = React.useState<GuestType[]>([]);
    const [selectedGuest, setSelectedGuest] = React.useState<GuestType | null>(null);

    async function onSearch(query: string) {
        if (query.length < 4) return;
        try {
            setLoading(true);
            const guests = await getGuests(query);
            setGuests(guests.map((guest) => ({
                name: guest.name || "",
                email: guest.email || "",
                mobileNo: guest.mobileNo || "",
                city: guest.city || "",
                guestId: guest?._id || ""
            })));
        }
        catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button size="sm" >
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
                    Enter the amount you want to contribute as gift
                </DialogDescription>
            </DialogHeader>
            {paymentSuccess ? (
                <Image src={paymentGif} alt="Payment Success" width={512} height={512} className="mx-auto" />
            ) : (<>
                <div className="flex gap-4">
                    <Combobox
                        loading={loading}
                        onChange={onSearch}
                        options={guests.map((guest) => ({
                            label: guest.name + " | " + guest.city,
                            value: guest.email || guest!.mobileNo!,
                        }))}
                        onSelect={(value) => {
                            console.log(value);
                            const result = guests.find((guest) => guest.email === value || guest.mobileNo === value);
                            result && setSelectedGuest(result);
                        }}
                    />
                    <Button
                        size="sm"
                        type="button"
                        onClick={() => {
                            setSelectedGuest({ name: "", email: "", mobileNo: "", city: "" });
                        }}
                    >
                        Add Guest
                    </Button>
                </div>
                {selectedGuest && (<div className="mt-4 flex gap-4 flex-wrap items-center">
                    <Input type="text" value={selectedGuest?.name} disabled={!!selectedGuest?.guestId} onChange={(e) => setSelectedGuest({ ...selectedGuest, name: e.target.value })} placeholder="Name" />
                    <Input type="text" value={selectedGuest?.city} disabled={!!selectedGuest?.guestId} onChange={(e) => setSelectedGuest({ ...selectedGuest, city: e.target.value })} placeholder="City" />
                    <Input type="text" value={selectedGuest?.email} disabled={!!selectedGuest?.guestId} onChange={(e) => setSelectedGuest({ ...selectedGuest, email: e.target.value })} placeholder="Email" />
                    <Input type="text" value={selectedGuest?.mobileNo} disabled={!!selectedGuest?.guestId} onChange={(e) => setSelectedGuest({ ...selectedGuest, mobileNo: e.target.value })} placeholder="Mobile No" />
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </div>)}
                <Button
                    onClick={async () => {
                        try {
                            if (!selectedGuest) {
                                toast.error("Please select a guest");
                                return;
                            }
                            if (amount <= 0) {
                                toast.error("Please enter a valid amount");
                                return;
                            }
                            setLoading(true);
                            await addContribution({
                                amount,
                                data: selectedGuest?.guestId || {
                                    name: selectedGuest.name,
                                    city: selectedGuest.city,
                                    email: selectedGuest.email,
                                    mobileNo: selectedGuest.mobileNo
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
            </>)}
        </DialogContent>
    </Dialog>
    )
    return
}

