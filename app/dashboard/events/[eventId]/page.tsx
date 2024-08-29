
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { CalendarDays, MapPin } from 'lucide-react';
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "./actions";

import { closeEvent } from './actions';
import CloseContributionButton from './closeEvent';

export default async function EventPage({ params }: { params: { eventId: string } }) {
    const event = await getEvent(params.eventId);
    
    if (!event) {
        notFound();
    }
    const session = await getSession();


    return (
        <Card>
            <CardHeader>
                <Button className="max-w-16" size="sm" variant="link" asChild>
                    <Link href="/">
                        Home
                    </Link>
                </Button>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription className="text-gray-600">
                    <MapPin className="size-4 mr-2 inline-block" />
                    {event.venue}
                    {`  `}
                    <CalendarDays className="size-4 mx-2 inline-block" />
                    {new Date(event.date).toLocaleDateString()}
                </CardDescription>
                <div className="mt-5">
                    <CloseContributionButton closeContribution={closeEvent.bind(null, params.eventId)} isClosed={event.isClosed}/>
                </div>
            </CardHeader>
            <CardContent>
                
            </CardContent>
        </Card>

    );
}