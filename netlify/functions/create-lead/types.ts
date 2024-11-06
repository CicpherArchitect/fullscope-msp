export interface LeadData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
  services: string[];
}

export interface SalesmateCompany {
  id: number;
  name: string;
}

export interface SalesmateHeaders {
  'Content-Type': string;
  'accessToken': string | undefined;
  'x-linkname': string;
}