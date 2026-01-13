

import { requireAuth } from "@/lib/auth-utils";




const Page = async () => {
  await requireAuth()
  return (
    <div>
      protected
    </div>
  );
}

export default Page