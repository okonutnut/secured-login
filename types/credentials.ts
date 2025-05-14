export type LoginCredentials = {
  username: string;
  password: string;
}

export type RegisterCredentials = {
  username: string;
  password: string;
  fullname: string;
  role: string;
  recoveryCodes: string[];
}

export type UserType = {
  id: string;
  username: string;
  fullname: string;
  role: string;
  recoveryCodes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type AccountRecoveryCredentials = {
  username: string;
  code: string;
}

export type ChangePasswordCredentials = {
  username: string;
  password: string;
}

export type AuditLogsType = {
  id?: string;
  userId: string;
  username: string;
  ipAddress?: string;
  action: string;
  status: string;
  timestamp: Date;
}

export type RegisteredUserType = {
  id?: string;
  username: string;
  password: string;
  fullname: string;
  role: string;
  isLocked: boolean;
  loginAttempts: number;
  lockTimestamp: Date | null;
  createdAt: Date;
  updatedAt: Date;
  recoveryCodes: string[];
}