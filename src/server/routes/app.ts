import { createAppSchema } from '../db/validate-schema'
import { dbClient } from '../db/db'
import { apps } from '../db/schema'
import { authProcedure, router } from '@/utils/trpcRouter'

export const appRouter = router({
  createApp: authProcedure.input(createAppSchema.pick({ name: true, description: true })).mutation(async ({ ctx, input }) => {
    const { session } = ctx
    const { name, description } = input

    const result = await dbClient.insert(apps).values({
      id: crypto.randomUUID(),
      name,
      description,
      userId: session.userId,
    }).returning()
    return result[0]
  }),
})
