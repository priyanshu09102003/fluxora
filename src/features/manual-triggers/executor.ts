import { manualTriggerChannel } from "@/inngest/channels/manual-trigger-channel";
import type { NodeExecutor } from "../executions/types";

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async({
    nodeId, context, step ,publish})=>
{

    //loading state for manual trigger
    await publish(
        manualTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    const result = await step.run("manual-trigger" , async() => context)

    //Success state for manual trigger

     await publish(
        manualTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )


    return result

}