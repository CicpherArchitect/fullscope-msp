import axios from 'axios';
import { SALESMATE_BASE_URL } from './config';
import type { LeadData, SalesmateCompany, SalesmateHeaders } from './types';

export async function findCompany(companyName: string, headers: SalesmateHeaders): Promise<SalesmateCompany | null> {
  try {
    const searchPayload = {
      query: companyName,
      fields: ["id", "name"],
      type: "Company",
      limit: 1
    };

    const response = await axios.post(
      `${SALESMATE_BASE_URL}/company/v4/search`,
      searchPayload,
      { headers }
    );

    if (response.data?.Status === 'success' && response.data?.Records?.length > 0) {
      const company = response.data.Records[0];
      return {
        id: company.id,
        name: company.name
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching for company:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createCompany(companyName: string, headers: SalesmateHeaders): Promise<SalesmateCompany> {
  try {
    const companyData = {
      name: companyName,
      ownerId: 1,
      type: "Lead",
      source: "Website Contact Form",
      status: "Active"
    };

    const response = await axios.post(
      `${SALESMATE_BASE_URL}/company/v4`,
      companyData,
      { headers }
    );

    if (response.data?.Status !== 'success') {
      throw new Error('Failed to create company');
    }

    return {
      id: response.data.Data.id,
      name: response.data.Data.name
    };
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

export async function createContact(data: LeadData, companyId: number, headers: SalesmateHeaders) {
  try {
    const contactData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      type: "Lead",
      companyId: companyId,
      ownerId: 1,
      description: `Message: ${data.message.trim()}\n\nServices of Interest:\n${data.services.join('\n')}`,
      tags: data.services,
      source: "Website Contact Form",
      status: "New"
    };

    const response = await axios.post(
      `${SALESMATE_BASE_URL}/contact/v4`,
      contactData,
      { headers }
    );

    if (response.data?.Status !== 'success') {
      throw new Error('Failed to create contact');
    }

    return response.data.Data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}