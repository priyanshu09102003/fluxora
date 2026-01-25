import type { NodeExecutor } from "../executions/types";

type ManualTriggerData = Record<string, unknown>

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async({
    nodeId, context, step})=>
{

    //loading state for manual trigger

    const result = await step.run("manual-trigger" , async() => context)

    //Success state for manual trigger


    return result

}