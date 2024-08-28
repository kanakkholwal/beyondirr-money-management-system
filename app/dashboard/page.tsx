import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { IndianRupee } from 'lucide-react';
import Link from "next/link";


export default function DashboardPage() {

    return <>
        <div className="flex justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <Button asChild>
                <Link href="/dashboard/events/create">
                    Create Event
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl text-teal-600">{69}<IndianRupee className="inline-block size-8" /></CardTitle>
                    <CardDescription>Received as gifts</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="text-4xl text-cyan-600">{96}<IndianRupee className="inline-block size-8" /></CardTitle>
                <CardDescription>Contributed as gifts</CardDescription>
                </CardHeader>
            </Card>

        </div>

    </>
}