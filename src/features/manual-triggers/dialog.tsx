"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface ManualTriggerDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void
}

export const ManualTriggerDialog = ({
    open,
    onOpenChange

}: ManualTriggerDialogProps) => {

    return(
        <Dialog open = {open}  onOpenChange={onOpenChange}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        What will the <b>Manual Trigger</b> Node do?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">

                    <p className="text-sm text-muted-foreground">This node is simply used to manually trigger your workflow. No external configurations needed.</p>

                </div>
            </DialogContent>

        </Dialog>
    )
}