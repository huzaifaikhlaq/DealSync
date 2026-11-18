export type DashboardLead = {
  name: string;
  role: string;
  company: string;
  form: string;
  score: number;
  status: "Qualified" | "In Progress" | "Attempted";
  time: string;
  initials: string;
  color: string;
};

export type PerformingForm = {
  title: string;
  detail: string;
  count: string;
  rate: string;
  bar: string;
  tag: string;
  best?: boolean;
};
