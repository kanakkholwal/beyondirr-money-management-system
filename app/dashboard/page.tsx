import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee } from 'lucide-react';
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getAnalytics, getEvents, getGifts,getTopGuestsAndHosts } from './actions';

export default async function DashboardPage() {
    const { receivedContributions, contributions } = await getAnalytics();
    const events = await getEvents();
    const gifts = await getGifts();
    const {topGuests, topHosts } = await getTopGuestsAndHosts();


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
            {events.length === 0 && <h4 className="text-red-500 text-center">No events found</h4>}
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

            <CardContent>
                <Tabs defaultValue="received" className="w-full">
                    <TabsList>
                        <TabsTrigger value="received">
                            Received
                        </TabsTrigger>
                        <TabsTrigger value="contributed">Contributed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="received">
                        {gifts["received"].length === 0 && <h4 className="text-red-500 text-center">No gifts received</h4>}
                        {gifts["received"].map((contribution) => <ReceivedCard key={contribution._id} contribution={contribution} />)}
                    </TabsContent>
                    <TabsContent value="contributed">
                        {gifts["contributed"].length === 0 && <h4 className="text-red-500 text-center">No gifts contributed</h4>}
                        {gifts["contributed"].map((contribution) => <ContributeCard key={contribution._id} contribution={contribution} />)}
                    </TabsContent>
                </Tabs>

            </CardContent>
        </Card>
        <Card className="mt-10">
            <CardHeader className="flex-row flex justify-between">
                <CardTitle className="text-2xl">topGuests</CardTitle>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="topGuests" className="w-full">
                    <TabsList>
                        <TabsTrigger value="topGuests">
                        topGuests
                        </TabsTrigger>
                        <TabsTrigger value="topHosts">topHosts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="topGuests">
                        {topGuests.length === 0 && <h4 className="text-red-500 text-center">No topGuests found</h4>}
                        {topGuests.map((guest) => {
                            return <Card key={guest._id}>
                                <CardHeader>
                                    <CardTitle>{guest.name}</CardTitle>
                                    <CardDescription>{guest.email}</CardDescription>
                                    <Badge>{guest.totalAmount}</Badge>

                                </CardHeader>
                            </Card>
                        })}
                        
                    </TabsContent>
                    <TabsContent value="topHosts">
                        {topHosts.length === 0 && <h4 className="text-red-500 text-center">No topHosts found</h4>}
                        {topHosts.map((host) => {
                            return <Card key={host._id}>
                                <CardHeader>
                                    <CardTitle>{host.name}</CardTitle>
                                    <CardDescription>{host.email}</CardDescription>
                                    <Badge>{host.totalAmount}</Badge>
                                </CardHeader>
                            </Card>
                        })}
                    </TabsContent>
                </Tabs>

            </CardContent>
        </Card>

    </>
}

function ReceivedCard({ contribution }: {
    contribution: {
        _id: string;
        event: string;
        amount: number;
        contributor: {
            name: string;
            email: string;
            mobileNo: string;
        }
    }
}) {

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{contribution.event}</CardTitle>
                <CardDescription>
                    <Badge>{contribution.amount}</Badge>
                    {" "} by <span className="font-bold">{contribution.contributor.name}</span>

                </CardDescription>
            </CardHeader>
        </Card>
    )

}
function ContributeCard({ contribution }: {
    contribution: {
        _id: string;

        event: string;
        amount: number;
        contributor: {
            name: string;
            email: string;
            mobileNo: string;
        }
    }
}) {

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{contribution.event}</CardTitle>
                <CardDescription>
                    <Badge>{contribution.amount}</Badge>
                </CardDescription>
            </CardHeader>
        </Card>
    )

}