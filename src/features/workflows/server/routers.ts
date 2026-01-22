import prisma from "@/lib/db"
import {createTRPCRouter, premiumProcedure, protectedProcedure} from "@/trpc/init"
import {generateSlug} from "random-word-slugs"
import z from "zod"
import { PAGINATION } from "../../../config/constants"
import { NodeType } from "@prisma/client"
import { Node , Edge } from "@xyflow/react"

//Creating WORKFLOW CRUD
export const workFlowsRouter = createTRPCRouter({

    //CREATE
    create: premiumProcedure.mutation(({ctx}) => {
        return prisma.workflow.create({
            data:{
                name: generateSlug(3),
                userId: ctx.auth.user.id,
                nodes: {
                    create:{
                        type: NodeType.INITIAL,
                        position: {x: 0, y:0},
                        name: NodeType.INITIAL
                    }
                }
            }
        })
    }),

    //REMOVE(DELETE)
    remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(({ctx , input})=>{
        return prisma.workflow.delete({
            where:{
                id: input.id,
                userId: ctx.auth.user.id
            }
        })
    }),

    //UPDATE(NAME)
    updateName: protectedProcedure
    .input(z.object({id: z.string(), name: z.string().min(1)}))
    .mutation(({ctx , input}) => {
        return prisma.workflow.update({
            where: {id: input.id, userId: ctx.auth.user.id},
            data: {name: input.name}
        })
    }),

    //Get one Workflow
    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async({ctx , input}) => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where:{
                id: input.id,
                userId: ctx.auth.user.id
            },
            include: {nodes: true, connections: true}
        })

        //Transforming the server nodes to ReactFlow compatible nodes
        const nodes: Node[] = workflow.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position as {x: number, y:number},
            data: (node.data as Record<string, unknown>) || {}
        }))

        //Transforming the server connections to ReactFlow compatible edges

        const edges: Edge[] = workflow.connections.map((connection) => ({
            id: connection.id,
            source: connection.fromNodeId,
            target: connection.toNodeId,
            sourceHandle: connection.fromOutput,
            targetHandle: connection.toInput
        }))

        return {
            id: workflow.id,
            name: workflow.name,
            nodes,
            edges
        }


    }),

    //Get All the user's workflows
    getMany: protectedProcedure
    .input(
        z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z
            .number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        })
    )
    .query(async ({ctx , input}) => {
        const {page, pageSize, search} = input;
        const [items, totalCount] = await Promise.all([
            prisma.workflow.findMany({
                skip: (page - 1)*pageSize,
                take: pageSize,
                where: {
                    userId: ctx.auth.user.id,
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                orderBy:{
                    updatedAt: "desc"
                }
            }),
            prisma.workflow.count({
                where:{
                    userId: ctx.auth.user.id,
                    name:{
                        contains: search,
                        mode: "insensitive"
                    }
                }
            })
        ])

        const totalPages = Math.ceil(totalCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1

        return{
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    }),
})