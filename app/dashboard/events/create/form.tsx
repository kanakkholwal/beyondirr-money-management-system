"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { rawEventSchema } from "@/types/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { createEvent, getGuests } from "./actions";

import { Combobox } from "@/components/ui/combobox";


export default function CreateEventForm() {

    const [guests, setGuests] = useState<z.infer<typeof rawEventSchema>["guests"]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof rawEventSchema>>({
        resolver: zodResolver(rawEventSchema),
        defaultValues: {
            name: "",
            date: new Date(),
            venue: "",
            guests: [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "guests",
    });

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
                hostId:guest?._id || ""
            })));
        }
        catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function onSubmit(values: z.infer<typeof rawEventSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        try {
            await toast.promise(createEvent(values), {
                loading: "Creating event...",
                success: "Event created successfully",
                error: "Failed to create event",
            })
        }
        catch (error) {
            console.log(error);
        }

    }


    return (<Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-5">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Bootcamp" {...field} />
                        </FormControl>
                        <FormDescription>
                            The name of the event
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                            <DatePicker
                                date={field.value}
                                onSelect={(date) => {
                                    form.setValue("date", date);
                                }}
                            />
                        </FormControl>
                        <FormDescription>
                            The date of the event
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                            <Input placeholder="Lekki" {...field} />
                        </FormControl>
                        <FormDescription>
                            The venue of the event
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

            <FormField
                control={form.control}
                name="guests"
                render={() => (
                    <FormItem>
                        <FormLabel>Guests</FormLabel>

                        <div className="flex gap-4">
                            <Combobox
                                loading={loading}
                                onChange={onSearch}
                                options={guests.map((guest) => ({
                                    label: guest.name +  " | " + guest.city,
                                    value: guest.email || guest!.mobileNo!,
                                }))}
                                onSelect={(value) => {
                                    console.log(value);
                                    const result = guests.find((guest) => guest.email === value || guest.mobileNo === value);
                                    result && append(result);
                                }}
                            />
                            <Button
                                size="sm"
                                type="button"
                                onClick={() => append({ name: "", email: "", mobileNo: "",city:"" })}
                            >
                                Add Guest
                            </Button>
                        </div>




                        {fields.map((_: any, index: number) => (
                            <div key={`guests.${index}`} className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name={`guests.${index}.name`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`guests.${index}.email`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="johndoe@acme.com" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`guests.${index}.mobileNo`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="08012345678" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`guests.${index}.city`}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Input placeholder="Delhi" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <FormDescription>
                            The guests of the event
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            <Button type="submit">Create Event</Button>


        </form>

    </Form>)
}