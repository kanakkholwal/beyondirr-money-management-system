import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateEventForm from "./form";


export default function CreateEventPage() {

    return <Card>
            <Button variant="link" className="mt-5 ml-4" asChild>
                <Link href="/dashboard">
                    Back
                </Link>
            </Button>
        <CardHeader>
            <CardTitle>
                Create Event
            </CardTitle>
            <CardDescription>
                Create a new event
            </CardDescription>
        </CardHeader>
        <CreateEventForm/>
    </Card>

}