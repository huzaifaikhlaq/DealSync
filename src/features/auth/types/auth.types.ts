export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthMode = "login" | "register";

export type AuthFieldName =
  | "name"
  | "email"
  | "password"
  | "confirmPassword";

export type AuthFieldErrors = Partial<Record<AuthFieldName, string[]>>;
