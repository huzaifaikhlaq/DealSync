export type FormRecord = {
  id: number;
  title: string;
  status: "Active" | "Draft • Unpublished" | "Archived";
  category: string;
  date: string;
  slug: string;
  submissions: string;
  conversion: string;
  last: string;
  tags: string[];
  variant?: string;
};
