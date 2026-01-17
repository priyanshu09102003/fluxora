import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server";
import { Loader2 } from "lucide-react";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import {ErrorBoundary} from "react-error-boundary"

type Props = {
    searchParams: Promise<SearchParams>
}

const Page = async({searchParams}:Props) => {
    await requireAuth();


    const params = await workflowsParamsLoader(searchParams)
    prefetchWorkflows(params);


    return (

        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<p>Error!</p>}>

                    <Suspense fallback={<p className="flex justify-self-center gap-2"><Loader2 className="animate-spin" />Loading...</p>}>

                        <WorkflowsList />

                    </Suspense>

                </ErrorBoundary>
                
            </HydrateClient>
        </WorkflowsContainer>
    )
}

export default Page