
export interface AuthUser {
  id: string;
  name: string;
  email: string;
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
