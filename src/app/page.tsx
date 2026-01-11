import { caller } from "@/trpc/server";


const Page = async() => {
  const users = await caller.getUsers()
  return (
    <div>
      Building FluxorAI
    </div>
  );
}

export default Page