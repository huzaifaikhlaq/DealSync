export type Lead = {
  id: string | number;
  name: string;
  role: string;
  email: string;
  company: string;
  domain: string;
  phone: string;
  form: string;
  formId?: string;
  status: string;
  submitted: string;
  initials: string;
  color: string;
  verified?: boolean;
  notes?: string | null;
};
