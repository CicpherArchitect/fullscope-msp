import type { LeadData } from './types';

export const validateLeadData = (data: any): data is LeadData => {
  return (
    typeof data === 'object' &&
    typeof data.firstName === 'string' &&
    typeof data.lastName === 'string' &&
    typeof data.company === 'string' &&
    typeof data.email === 'string' &&
    typeof data.message === 'string' &&
    Array.isArray(data.services)
  );
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateServices = (services: string[]): boolean => {
  return services.length > 0;
};