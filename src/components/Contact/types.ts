export interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
  services: string[];
}

export interface FormStatus {
  type: 'idle' | 'success' | 'error';
  message?: string;
}