"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface CloseContributionButtonProps {
    closeContribution: () => Promise<any>;
    isClosed: boolean;
}

export default function CloseContributionButton({ closeContribution,isClosed }: CloseContributionButtonProps) {

    return (<>
        <Button size="sm" onClick={() => {
            toast.promise(closeContribution(), {
                loading: isClosed ? 'Opening Contribution' : 'Closing Contribution',
                success: isClosed ? 'Contribution opened' : 'Contribution closed',
                error: isClosed ? 'Failed to open contribution' : 'Failed to close contribution'
            });

        }}>
            {isClosed ? "Open Contribution" : "Close Contribution"}
        </Button>
    </>
    )
    return
}

