import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';
import Link from "next/link";

import { getAnalytics, getEvents } from './actions';

export default async function DashboardPage() {
    const { receivedContributions, contributions } = await getAnalytics();
    const events = await getEvents();

    return <>
        <div className="flex justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>


        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl text-teal-600">{receivedContributions}<IndianRupee className="inline-block size-8" /></CardTitle>
                    <CardDescription>Received as gifts</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl text-cyan-600">{contributions}<IndianRupee className="inline-block size-8" /></CardTitle>
                    <CardDescription>Contributed as gifts</CardDescription>
                </CardHeader>
            </Card>
        </div>
        <Card className="mt-10">
            <CardHeader className="flex-row flex justify-between">
                <CardTitle className="text-2xl">Events</CardTitle>
                <div>
                    <Button asChild>
                        <Link href="/dashboard/events/create">
                            Create Event
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
                {events.map((event) => (
                    <Card key={event._id}>
                        <CardHeader>
                            <CardTitle>{event.name}</CardTitle>
                            <CardDescription>{new Date(event.date).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="link" asChild>
                                <Link href={`/dashboard/events/${event._id}`}>
                                    View
                                </Link>
                            </Button>
                            <Button variant="link" asChild>
                                <Link target="_blank" href={`/events/${event._id}`}>
                                    View as Guest
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
        </Card>
        <Card className="mt-10">
            <CardHeader className="flex-row flex justify-between">
                <CardTitle className="text-2xl">Gifts</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
                
            </CardContent>
        </Card>

    </>
}