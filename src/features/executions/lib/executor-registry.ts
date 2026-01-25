import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/manual-triggers/executor";

export const executorRegistry: Record<NodeType, NodeExecutor>={
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : manualTriggerExecutor,

}

export const getExecutor = (type: NodeType):NodeExecutor => {
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for the node type: ${type}`);
    }

    return executor;
}