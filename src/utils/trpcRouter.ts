import { auth } from '~/auth'
import {initTRPC} from '@trpc/server'

export async function createTRPCContext() {
  const session = await auth()
  // if (!session?.user) {
  //   throw new Error('Not logged in')
  // }
  return {
    // session
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

const checkAuthMiddleware = t.middleware(async ({ctx, next}) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not logged in')
  }
  return next({
    ctx: {
      ...ctx,
      session
    }
  })
})

const authProcedure = t.procedure.use(checkAuthMiddleware)

export const trpcRouter = t.router({
  hello: t.procedure.query(async () => {
    return `hello trpc`
  }),
  createApp: authProcedure.mutation(async ({ctx}) => {
    return `${ctx.session.user?.name} create app`
  })
})

export type TRPCRouterType = typeof trpcRouter