import { and, desc, eq, isNull } from 'drizzle-orm'
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

  listApps: authProcedure.query(async ({ ctx }) => {
    const { session } = ctx
    const result = await dbClient.query.apps.findMany({
      where: and(
        eq(apps.userId, session.userId),
        isNull(apps.deletedAt),
      ),
      orderBy: [desc(apps.createdAt)],
    })
    return result
  }),
})
