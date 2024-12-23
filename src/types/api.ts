import { notificationStatusEnum, userRoleEnum } from "@/db/schema_2";

export type CreateUserRequest = {
  wallet_address: string;
  clerk_user_id: string;
  username: string;
  role: (typeof userRoleEnum.enumValues)[number];
};
export type GetUserResponse = {
  id: string;
  wallet_address: string;
  username: string;
  created_at: Date;
  role: (typeof userRoleEnum.enumValues)[number];
};

export type CreateNotificationRequest = {
  org_wallet_address: string;
  token_id: string;
  message: string;
};
export type GetUserNotificationResponse = {
  id: string;
  tokenId: string;
  message: string;
  orgName: string;
  orgAddress: string;
};
export type GetOrgNotificationResponse = {
  id: string;
  tokenId: string;
  message: string;
  recordTitle: string;
  status: (typeof notificationStatusEnum.enumValues)[number];
};
export type DeleteNotificationResponse = {
  id: string;
  record_id: string;
  org_id: string;
  user_id: string;
  message: string;
  status: (typeof notificationStatusEnum.enumValues)[number];
  created_at: Date;
};

export type GetRecordsResponse = {
  id: string;
  user_id: string;
  token_id: string;
  encryption_key: string;
  title: string;
  description: string;
  uploaded_at: Date;
};
export type CreateRecordsRequest = {
  wallet_address: string;
  token_id: string;
  encryption_key: string;
  title: string;
  description: string;
};
