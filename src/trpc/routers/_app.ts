
import { inngest } from '@/inngest/client';
import {createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { workFlowsRouter } from '@/features/workflows/server/routers';
import { credentialsRouter } from '@/features/credentials/server/routers';
import { executionssRouter } from '../../features/executions/server/routers';

export const appRouter = createTRPCRouter({
  workflows: workFlowsRouter,
  credentials: credentialsRouter,
  executions: executionssRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;