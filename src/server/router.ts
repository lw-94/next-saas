import { fileRoutes } from './routes/file'

import { createCallerFactory, router } from '@/utils/trpcRouter'

export const trpcRouter = router({
  file: fileRoutes,
})

export type TRPCRouter = typeof trpcRouter

const serverCaller = createCallerFactory(trpcRouter)
export const typeServerCaller = serverCaller({})
