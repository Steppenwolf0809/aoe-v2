import { pgTable, uuid, text, timestamp, boolean, jsonb, numeric, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', ['FREE', 'PREMIUM', 'ADMIN'])
export const contractStatusEnum = pgEnum('contract_status', ['DRAFT', 'PAID', 'GENERATED', 'DOWNLOADED'])
export const documentTypeEnum = pgEnum('document_type', [
  'VEHICLE_CONTRACT', 'POWER_OF_ATTORNEY', 'DECLARATION',
  'PROMISE', 'TRANSFER', 'TRAVEL_AUTH', 'CUSTOM'
])

// Profiles - extends Supabase auth.users
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // references auth.users.id
  fullName: text('full_name'),
  phone: text('phone'),
  role: userRoleEnum('role').default('FREE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Contracts
export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  type: documentTypeEnum('type').notNull(),
  data: jsonb('data').notNull(),
  pdfUrl: text('pdf_url'),
  pdfHash: text('pdf_hash'),
  downloadToken: uuid('download_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  status: contractStatusEnum('status').default('DRAFT').notNull(),
  paymentId: text('payment_id'),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  plan: userRoleEnum('plan').default('FREE').notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  active: boolean('active').default(true).notNull(),
  paymentMethod: text('payment_method'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Leads
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email'),
  phone: text('phone'),
  source: text('source'),
  calculatorType: text('calculator_type'),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Calculator Sessions
export const calculatorSessions = pgTable('calculator_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  visitorId: text('visitor_id'),
  type: text('type').notNull(),
  inputs: jsonb('inputs').notNull(),
  result: jsonb('result').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Blog Posts
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  category: text('category'),
  tags: jsonb('tags').$type<string[]>(),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Audit Log
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: uuid('resource_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
