import { createInsertSchema } from 'drizzle-zod'
import { apps, users } from './schema'

export const createUserSchema = createInsertSchema(users, {
  email: schema => schema.email.email(),
})

export const createAppSchema = createInsertSchema(apps, {
  name: schema => schema.name.min(3),
})
