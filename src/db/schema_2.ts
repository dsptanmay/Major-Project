import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["user", "organization"]);
export const accessStatusEnum = pgEnum("access_status", [
  "pending",
  "granted",
  "denied",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  wallet_address: text("wallet_address").unique().notNull(),
  role: userRoleEnum("role").notNull(),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const medicalRecords = pgTable("medical_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  token_id: text("token_id").unique().notNull(), // NFT token ID
  ipfs_hash: text("ipfs_hash").notNull(),
  encrypted_file_key: text("encrypted_file_key").notNull(), // AES key encrypted with user's public key
  description: text("description"),
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
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  message: text("message").notNull(),
  related_record_id: uuid("related_record_id"),
  related_request_id: uuid("related_request_id"),
  is_read: boolean("is_read").default(false).notNull(),
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
