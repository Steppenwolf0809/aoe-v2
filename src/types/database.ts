import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import type { profiles, contracts, subscriptions, leads, calculatorSessions, blogPosts, auditLog } from '@/db/schema'

// Select types (reading from DB)
export type Profile = InferSelectModel<typeof profiles>
export type Contract = InferSelectModel<typeof contracts>
export type Subscription = InferSelectModel<typeof subscriptions>
export type Lead = InferSelectModel<typeof leads>
export type CalculatorSession = InferSelectModel<typeof calculatorSessions>
export type BlogPostRecord = InferSelectModel<typeof blogPosts>
export type AuditLogRecord = InferSelectModel<typeof auditLog>

// Insert types (writing to DB)
export type NewProfile = InferInsertModel<typeof profiles>
export type NewContract = InferInsertModel<typeof contracts>
export type NewSubscription = InferInsertModel<typeof subscriptions>
export type NewLead = InferInsertModel<typeof leads>
export type NewCalculatorSession = InferInsertModel<typeof calculatorSessions>
export type NewBlogPost = InferInsertModel<typeof blogPosts>
export type NewAuditLog = InferInsertModel<typeof auditLog>
