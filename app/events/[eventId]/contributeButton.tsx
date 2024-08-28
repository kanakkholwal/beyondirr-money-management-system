"use client";

import { Button } from "@/components/ui/button";

interface ContributeButtonProps{
    sendContribution: (amount: number) => Promise<any>;
} 

export default function ContributeButton({sendContribution}:ContributeButtonProps) {

    return <Button onClick={() => sendContribution(123)}>
        Contribute
    </Button>
}

//  payment success lottiefile
// https://lottie.host/81a37d1b-5034-4292-999b-e1d2aa25dc07/kI6MQUsIfN.json