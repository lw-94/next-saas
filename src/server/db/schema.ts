import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import type { AdapterAccountType } from 'next-auth/adapters'
import { relations } from 'drizzle-orm'

const connectionString = 'postgres://postgres:123456@localhost:5432/postgres'
const pool = postgres(connectionString, { max: 1 })

export const db = drizzle(pool)

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable('account', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, account => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId],
  }),
}))

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, verificationToken => ({
  compositePk: primaryKey({
    columns: [verificationToken.identifier, verificationToken.token],
  }),
}))

export const authenticators = pgTable('authenticator', {
  credentialId: text('credential_id').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  providerAccountId: text('providerAccountId').notNull(),
  credentialPublicKey: text('credentialPublicKey').notNull(),
  counter: integer('counter').notNull(),
  credentialDeviceType: text('credentialDeviceType').notNull(),
  credentialBackedUp: boolean('credentialBackedUp').notNull(),
  transports: text('transports'),
}, authenticator => ({
  compositePK: primaryKey({
    columns: [authenticator.userId, authenticator.credentialId],
  }),
}))

//
export const files = pgTable('files', {
  id: uuid('id').primaryKey().notNull().defaultRandom(), // 使用uuid，防止用户通过自增id猜测出文件
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  path: varchar('path', { length: 1024 }).notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  userId: text('user_id').notNull(),
  contentType: varchar('content_type', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
  appId: uuid('app_id').notNull(),
}, file => ({
  cursorIdx: index('cursor_idx').on(file.createdAt, file.id), // 复合索引,防止只用createdAt时间相同引发问题
}))

export const apps = pgTable('app', {
  id: uuid('id').primaryKey().notNull(), // 使用uuid，防止用户通过自增id猜测出文件
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
  // storageId: integer('storage_id'),
})

// relations
export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
  apps: many(apps),
}))

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  app: one(apps, {
    fields: [files.appId],
    references: [apps.id],
  }),
}))

export const appsRelations = relations(apps, ({ one, many }) => ({
  user: one(users, {
    fields: [apps.userId],
    references: [users.id],
  }),
  files: many(files),
}))
