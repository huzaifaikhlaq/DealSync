export type FormRecord = {
  id: string;
  title: string;
  status: "Active" | "Draft" | "Archived";
  date: string;
  slug: string;
  submissions: string;
  publicId?: string;
  allowedOrigins?: string[];
  createdAt?: string;
};
