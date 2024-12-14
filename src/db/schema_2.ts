import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  wallet_address: text("wallet_address").unique().notNull(),
  role: userRoleEnum("role").notNull(),
  username: text("username"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const medicalRecords = pgTable("medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  token_id: text("token_id").unique().notNull(), // NFT token ID
  encryption_key: text("encryption_key").notNull(), // AES key encrypted with user's public key
  title: text("title").notNull(),
  description: text("description").notNull(),
  uploaded_at: timestamp("uploaded_at").defaultNow().notNull(),
});

export const accessRequests = pgTable("access_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  record_id: uuid("record_id")
    .references(() => medicalRecords.id)
    .notNull(),
  organization_id: uuid("organization_id")
    .references(() => users.id)
    .notNull(),
  status: accessStatusEnum("status").default("pending").notNull(),
  requested_at: timestamp("requested_at").defaultNow().notNull(),
  processed_at: timestamp("processed_at"),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  org_id: uuid("organization_id")
    .references(() => users.id)
    .notNull(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  status: notificationStatusEnum("status").default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
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
