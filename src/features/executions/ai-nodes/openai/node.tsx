"use client";

import { Node , NodeProps, useReactFlow } from "@xyflow/react";


import { memo , useState } from "react";
import { BaseExecutionNode } from "@/components/NodeSelector/base-execution-node";

import { useNodeStatus } from "@/hooks/use-node-status";
import { OpenAIDialog, OpenAIFormValues } from "./openai-dialog";
import { fetchOpenAIRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";



type OpenAINodeData = {
    variableName?: string;
    systemPrompt: string;
    userPrompt: string
}

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (values: OpenAIFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return{
                    ...node,
                    data:{
                        ...node.data,
                        ...values
                    }
                }
            }

            return node
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.userPrompt
    ? `gpt-4 : ${nodeData.userPrompt.slice(0, 50)}...`: "Not configured";

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAIRealtimeToken
    });

    return(
        <>
            <OpenAIDialog 
            open = {dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defaultValues={nodeData}
            />

            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/openai.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})
OpenAINode.displayName = "OpenAINode"