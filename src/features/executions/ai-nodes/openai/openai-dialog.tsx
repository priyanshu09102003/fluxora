"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@prisma/client";



interface OpenAIDialogProps {
    open: boolean;
    onOpenChange: (open:boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<OpenAIFormValues>
}

const formSchema = z.object({
    variableName: z
    .string()
    .min(1, {message: "Variable name is required"})
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
        message: "Variable name must start with a 'LETTER' or 'UNDERSCORE' and contain only letters, numbers and underscores"
    }),
    credentialId: z.string().min(1, "Credential is required"),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User Prompt is required to make the model work")
})



export type OpenAIFormValues = z.infer<typeof formSchema>

export const OpenAIDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},

}: OpenAIDialogProps) => {

    const {data: credentials , isLoading : isLoadingCredentials} = useCredentialsByType(CredentialType.OPENAI)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            variableName: defaultValues.variableName || "",
            systemPrompt: defaultValues.systemPrompt || " ",
            userPrompt: defaultValues.userPrompt || "",
            credentialId: defaultValues.credentialId || ""
        }
    })

    //Reset the form values if the dialog opens with new defaults
    useEffect(() => {
        if(open){
            form.reset({
                variableName: defaultValues.variableName || "" ,
                systemPrompt: defaultValues.systemPrompt || " ",
                userPrompt: defaultValues.userPrompt || "",
                credentialId: defaultValues.credentialId || ""
            })
        }
    } , [open, defaultValues, form])

    const watchVariableName = form.watch("variableName") || "myPromptVar"


    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false)
    }

    return(
        <Dialog open = {open}  onOpenChange={onOpenChange}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>OpenAI Configuration</DialogTitle>
                    <DialogDescription>
                        Configure <b>OpenAI</b> model and prompt for this node
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">

                        <FormField control={form.control} name="variableName" render={({field}) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                    
                                    <FormControl>
                                        <Input placeholder="Eg: myPromptVar" {...field}/>
                                    </FormControl>

                                    <FormDescription>
                                        Add a variable name so that the results from this node can be referenced in the other nodes:{" "} {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                            </FormItem>
                        )} />

                            <FormField 
                               control={form.control}
                                                                                                        name='credentialId'
                                                                                                        render={({field}) => (
                                                                                                            <FormItem>
                                                                                                                <FormLabel>OpenAI Credential</FormLabel>
                                                                                                                <Select
                                                                                                                onValueChange={field.onChange}
                                                                                                                defaultValue={field.value}
                                                                                                                disabled = {isLoadingCredentials || !credentials?.length}
                                                                                                                >
                                                                            
                                                                                                                    <FormControl>
                                                                                                                        <SelectTrigger className='w-full'>
                                                                                                                            <SelectValue placeholder = "Select a credential..." />
                                                                            
                                                                                                                        </SelectTrigger>
                                                                                                                    </FormControl>
                                                                            
                                                                                                                    <SelectContent>
                                                                                                                        {credentials?.map((credential) => (
                                                                                                                            <SelectItem key={credential.id} value={credential.id}>
                                                                            
                                                                                                                                <div className='flex items-center gap-2'>
                                                                                                                                    <Image src="/openai.svg" alt="Openai" width={16} height={16} />
                                                                            
                                                                                                                                    {credential.name}
                                                                                                                                </div>
                                                                            
                                                                                                                            </SelectItem>
                                                                                                                        ))}
                                                                                                                    </SelectContent>
                                                                            
                                                                                                                </Select>
                                                                                                                <FormMessage />
                                                                                                            </FormItem>
                                 )}
                            />
                            

                                <FormField
                                    control={form.control}
                                    name="systemPrompt"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>System Prompt (Optional)</FormLabel>
                                            
                                            <FormControl>
                                                <Textarea 
                                                placeholder="E.g: You are a helpful assistant. Help me to do ..."
                                                className="min-h-[80px] font-mono text-sm"   
                                                {...field}/>
                                            </FormControl>

                                            <FormDescription>
                                                Sets the behavior of your driving AI Assistant. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                            </FormDescription>
                                            <FormMessage />
                                    </FormItem>
                                )} 
                                
                            />

                            <FormField
                                    control={form.control}
                                    name="userPrompt"
                                    render={({field}) => (
                                    <FormItem>
                                        <FormLabel>User Prompt</FormLabel>
                                            
                                            <FormControl>
                                                <Textarea 
                                                placeholder="E.g: Summarize this text: {{json.httpResponse.data}}"
                                                className="min-h-[120px] font-mono text-sm"   
                                                {...field}/>
                                            </FormControl>

                                            <FormDescription>
                                                The prompt to send to the AI. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                            </FormDescription>
                                            <FormMessage />
                                    </FormItem>
                                )} 
                                
                            />

                        <DialogFooter className="mt-4">
                            <Button type="submit">Configure</Button>

                        </DialogFooter>

                    </form>

                </Form>

            </DialogContent>

        </Dialog>
    )
}