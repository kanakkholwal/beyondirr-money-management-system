
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarDays, MapPin } from 'lucide-react';
import { notFound } from "next/navigation";
import { getEvent, sendContribution } from "./actions";
import ContributeButton from "./contributeButton";

const event = {
    _id: "123",
    name: "Sample Event",
    venue: "Sample Venue",
    date: "2024-12-31",
    isClosed: false,
}

export default async function EventPage({ params }: { params: { eventId: string } }) {
    const _event = await getEvent(params.eventId);

    if (!event) {
        notFound();
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription className="text-gray-600">
                    <MapPin className="size-4 mr-2 inline-block" />
                    {event.venue}
                    {`  `}
                    <CalendarDays className="size-4 mx-2 inline-block" />
                    {new Date(event.date).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {event.isClosed ? (<>
                    <p className="text-gray-600">Event is closed</p>
                    <Button disabled>
                        Contribute
                    </Button>
                </>) : (<>
                    <ContributeButton sendContribution={sendContribution.bind(null, params.eventId)} />
                </>)}
            </CardContent>
        </Card>

    );
}