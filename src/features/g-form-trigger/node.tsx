import { BaseTriggerNode } from "@/components/NodeSelector/base-trigger-nodes";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { GoogleFormTriggerDialog } from "./dialog";




export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true);



        const nodeStatus = "initial"
        
    return(
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />

            <BaseTriggerNode 
                {...props}
                icon="/googleform.svg"
                name="Google Form"
                description="Triggered when a Google Form is submitted"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})