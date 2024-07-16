import {createTRPCContext, trpcRouter} from '@/utils/trpcRouter'
import { NextRequest } from 'next/server'
import {fetchRequestHandler} from '@trpc/server/adapters/fetch'


const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: trpcRouter,
    createContext: createTRPCContext,
  })
}

export {handler as GET, handler as POST}