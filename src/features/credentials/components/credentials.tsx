"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/Workflows/entity-components";
import {useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@prisma/client";
import { KeyIcon, WorkflowIcon } from "lucide-react";
import { formatDistanceToNow} from "date-fns"

export const CredentialsSearch = () => {
    const [params , setParams] = useCredentialsParams()
    const {searchValue, onSearchChange} = useEntitySearch({
        params,
        setParams
    }) 

    return(
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search credentials..."
        />
    )
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();
   
    return (
        <EntityList
        items={credentials.data.items}
        getKey={(credential) => credential.id}
        renderItems={(credential) => <CredentialItem data={credential}/>}
        emptyView = {<CredentialsEmpty/>}
        />
    )
}

export const CredentialsHeader = ({disabled}: {disabled?:boolean}) => {
    return(
            <EntityHeader 
            title="Credentials"
            description="Create and manage your Credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled= {disabled}
            />
        
    )
}

export const CredentialsPagiantions = () => {
    const workflows = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams()

    return(
        <EntityPagination
        disabled = {workflows.isFetching}
        totalPages={workflows.data.totalPages}
        page = {workflows.data.page}
        onPageChange = {(page) => setParams({...params, page})}
         />
    )
}

export const CredentialsContainer = (
    {
        children
    } : {
        children: React.ReactNode;
    }
) => {
    return(
        <EntityContainer
        header = {<CredentialsHeader />}
        search = {<CredentialsSearch />}
        pagination = {<CredentialsPagiantions/>}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading Credentials..." />
}

export const CredentialsError = () => {
    return <ErrorView message="Error Loading Credentials..." />
}


export const CredentialsEmpty = () => {

    const router = useRouter();
    
    const handleCreate = () => {
                router.push(`/credentials/new`)
    }

    return(
            <EmptyView
            message="You don't have any active credentials. Get started by storing your first credential"
            onNew={handleCreate}
            />
    )
}


export const CredentialItem = ({data}:{data:Workflow}) =>{

    const removeCredential = useRemoveCredential()

    const handleRemove = () => {
        removeCredential.mutate({id: data.id})
    }


    return(
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle = {
                <>
                    Updated {formatDistanceToNow(data.updatedAt)} {" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, {addSuffix: true})}
                </>
            }

            image={
                <div className="size-8 flex items-center justify-center">

                    <KeyIcon className="size-5 text-muted-foreground" />

                </div>
            }

            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}