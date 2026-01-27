import { BaseTriggerNode } from "@/components/NodeSelector/base-trigger-nodes";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger-channel";


export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true);



        const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: MANUAL_TRIGGER_CHANNEL_NAME,
            topic: "status",
            refreshToken: fetchManualTriggerRealtimeToken
        });
        
    return(
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode 
                {...props}
                icon={MousePointerIcon}
                name="On clicking 'Execute Workflow'"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})