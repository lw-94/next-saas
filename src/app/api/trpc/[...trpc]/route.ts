import type { NextRequest } from 'next/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createTRPCContext, trpcRouter } from '@/utils/trpcRouter'

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: trpcRouter,
    createContext: createTRPCContext,
  })
}

export { handler as GET, handler as POST }
