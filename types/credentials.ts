export type LoginCredentials = {
  username: string;
  password: string;
}

export type RegisterCredentials = {
  username: string;
  password: string;
  fullname: string;
  recoveryCodes: string[];
}

export type UserType = {
  id: string;
  username: string;
  fullname: string;
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