import { auth } from '~/auth'
import {initTRPC} from '@trpc/server'

export async function createTRPCContext() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not logged in')
  }
  return {
    session
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

export const trpcRouter = t.router({
  hello: t.procedure.query(async ({ctx}) => {
    return `hello ${ctx.session.user?.name}`
  }),
})

export type TRPCRouterType = typeof trpcRouter