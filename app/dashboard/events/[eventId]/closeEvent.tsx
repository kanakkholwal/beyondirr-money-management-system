"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface CloseContributionButtonProps {
    closeContribution: () => Promise<any>;
    isClosed: boolean;
}

export default function CloseContributionButton({ closeContribution,isClosed }: CloseContributionButtonProps) {

    return (<>
        <Button size="sm" disabled={isClosed} onClick={() => {
            toast.promise(closeContribution(), {
                loading: 'Closing Contribution...',
                success: 'Contribution Closed',
                error: 'Failed to close contribution'
            });

        }}>
            {isClosed ? 'Closed' : 'Close Contribution'}
        </Button>
    </>
    )
    return
}

