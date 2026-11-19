
export type UserRole = "OWNER" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface SessionToken {
  rawToken: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface AuthResult {
  user: AuthUser;
  session: SessionToken;
}
