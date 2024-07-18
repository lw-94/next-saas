import { initTRPC } from '@trpc/server'
import { auth } from '@/auth'

const t = initTRPC.create()

const { router, middleware, procedure, createCallerFactory } = t

const checkAuthMiddleware = middleware(async ({ ctx, next }) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not logged in')
  }
  return next({
    ctx: {
      ...ctx,
      session,
    },
  })
})

const authProcedure = procedure.use(checkAuthMiddleware)

export const trpcRouter = router({
  hello: procedure.query(async () => {
    return `hello trpc`
  }),
  testAuth: authProcedure.mutation(async ({ ctx }) => {
    return `${ctx.session.user?.name} logged`
  }),
})

export type TRPCRouter = typeof trpcRouter

const serverCaller = createCallerFactory(trpcRouter)
export const caller = serverCaller({})
