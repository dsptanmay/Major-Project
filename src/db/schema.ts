import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "medical_organization",
]);
export const accessStatusEnum = pgEnum("access_status", [
  "pending",
  "approved",
  "denied",
]);

export const notificationStatusEnum = pgEnum("notif_status", [
  "pending",
  "approved",
  "denied",
]);

export const historyEventEnum = pgEnum("history_event_type", ["write", "read"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  wallet_address: text("wallet_address").unique().notNull(),
  role: userRoleEnum("role").notNull(),
  username: text("username").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  created_at: z.coerce.date(),
});

export const medicalRecords = pgTable("medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id")
    .references(() => users.id)
    .notNull(),
  token_id: text("token_id").unique().notNull(), // NFT token ID
  encryption_key: text("encryption_key").notNull(), // AES key encrypted with user's public key
  title: text("title").notNull(),
  description: text("description").notNull(),
  uploaded_at: timestamp("uploaded_at").defaultNow().notNull(),
});

export const insertRecordSchema = createInsertSchema(medicalRecords, {
  uploaded_at: z.coerce.date(),
});

export const accessRequests = pgTable("access_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  record_id: uuid("record_id")
    .references(() => medicalRecords.id)
    .notNull(),
  organization_id: text("organization_id")
    .references(() => users.id)
    .notNull(),
  status: accessStatusEnum("status").default("pending").notNull(),
  requested_at: timestamp("requested_at").defaultNow().notNull(),
  processed_at: timestamp("processed_at"),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  record_id: uuid("record_id")
    .references(() => medicalRecords.id)
    .notNull(),
  org_id: text("organization_id")
    .references(() => users.id)
    .notNull(),
  user_id: text("user_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  status: notificationStatusEnum("status").default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications, {
  created_at: z.coerce.date(),
});

export const history = pgTable("history", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id")
    .references(() => users.id)
    .notNull(),
  event_type: historyEventEnum("event").notNull(),
  transaction_hash: text("tx_hash"),
  comments: text("comments").notNull(),
  performed_at: timestamp("performed_at").defaultNow().notNull(),
});

export const insertHistorySchema = createInsertSchema(history, {
  performed_at: z.coerce.date(),
})
  .omit({ id: true, performed_at: true, user_id: true })
  .superRefine((input, ctx) => {
    if (input.event_type === "write" && !input.transaction_hash) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "string",
        received: "null",
        message: "Transaction Hash must be set when event type is 'write'",
      });
    }
  });

export const usersRelations = relations(users, ({ many }) => ({
  medical_records: many(medicalRecords),
  access_requests: many(accessRequests),
  notifications: many(notifications),
}));

export const medicalRecordsRelations = relations(
  medicalRecords,
  ({ one, many }) => ({
    user: one(users, {
      fields: [medicalRecords.user_id],
      references: [users.id],
    }),
    access_requests: many(accessRequests),
  }),
);

export const accessRequestsRelations = relations(accessRequests, ({ one }) => ({
  record: one(medicalRecords, {
    fields: [accessRequests.record_id],
    references: [medicalRecords.id],
  }),
  organization: one(users, {
    fields: [accessRequests.organization_id],
    references: [users.id],
  }),
}));

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertRecord = typeof medicalRecords.$inferInsert;
export type SelectRecord = typeof medicalRecords.$inferSelect;

export type InsertRequest = typeof accessRequests.$inferInsert;
export type SelectRequest = typeof accessRequests.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type SelectNotification = typeof notifications.$inferSelect;
