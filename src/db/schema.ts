import { pgEnum, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const status = pgEnum("status", ["approved", "pending", "denied"]);

export const notificationsTable = pgTable(
  "notifications",
  {
    org_address: varchar({ length: 255 }).notNull(),
    org_name: varchar({ length: 255 }).notNull(),
    user_address: varchar({ length: 255 }).notNull(),
    nft_token_id: varchar({ length: 255 }).notNull(),
    comments: varchar({ length: 255 }).notNull(),
    status: status().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.org_address, table.user_address, table.nft_token_id],
      }),
    };
  },
);

export const organizationWalletTable = pgTable("organization_wallets", {
  organization_name: varchar({ length: 255 }).notNull().primaryKey(),
  wallet_address: varchar({ length: 255 }).notNull().unique(),
});

export const organizationGrantedTokens = pgTable(
  "granted_tokens_org",
  {
    org_name: varchar({ length: 255 })
      .notNull()
      .references(() => organizationWalletTable.organization_name),
    token_id: varchar({ length: 255 })
      .notNull()
      .references(() => userNFTsTable.token_id),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.org_name, table.token_id],
      }),
    };
  },
);

export const userNFTsTable = pgTable("user_files", {
  token_id: varchar({ length: 255 }).primaryKey(),
  user_address: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
});

export const tokenEncryptions = pgTable("token_encryptions", {
  token_id: varchar("token_id", { length: 255 }).primaryKey().notNull(),
  encryption_key: varchar("encryption_key", { length: 255 }).notNull(),
});
