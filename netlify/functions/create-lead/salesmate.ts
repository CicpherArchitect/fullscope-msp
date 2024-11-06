import axios from 'axios';
import { SALESMATE_BASE_URL } from './config';
import type { LeadData, SalesmateCompany, SalesmateHeaders } from './types';

export async function findCompany(companyName: string, headers: SalesmateHeaders): Promise<SalesmateCompany | null> {
  try {
    const searchPayload = {
      displayingFields: [
        "company.id",
        "company.name",
        "company.type",
        "company.owner.id"
      ],
      filterQuery: {
        group: {
          operator: "AND",
          rules: [
            {
              condition: "LIKE",
              moduleName: "Company",
              field: {
                fieldName: "company.name",
                displayName: "Company Name",
                type: "Text"
              },
              data: companyName
            }
          ]
        }
      },
      moduleId: 5,
      reportType: "get_data",
      getRecordsCount: true
    };

    const response = await axios.post(
      `${SALESMATE_BASE_URL}/company/v4/search?rows=250&from=0`,
      searchPayload,
      { headers }
    );

    if (response.data?.data?.length > 0) {
      const company = response.data.data.find((c: any) => 
        c.name.toLowerCase() === companyName.toLowerCase()
      );
      if (company) {
        return {
          id: company.id,
          name: company.name
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error searching for company:', error);
    return null;
  }
}

export async function createCompany(companyName: string, headers: SalesmateHeaders): Promise<SalesmateCompany> {
  const companyData = {
    name: companyName,
    owner: 1,
    type: 'Lead',
    billingAddressLine1: '',
    billingCity: '',
    billingState: '',
    billingCountry: '',
    billingZipCode: '',
    phone: '',
    website: '',
    industry: '',
    description: 'Lead generated from website contact form'
  };

  const response = await axios.post(
    `${SALESMATE_BASE_URL}/company/v4`,
    companyData,
    { headers }
  );

  return {
    id: response.data.id,
    name: response.data.name
  };
}

export async function createContact(data: LeadData, companyId: number, headers: SalesmateHeaders) {
  const contactData = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    type: 'Lead',
    company: companyId,
    owner: 1,
    description: `Message: ${data.message.trim()}\n\nServices of Interest:\n${data.services.join('\n')}`,
    tags: data.services.join(','),
    emailOptOut: false,
    smsOptOut: false,
    billingAddressLine1: '',
    billingCity: '',
    billingState: '',
    billingCountry: '',
    billingZipCode: '',
    phone: '',
    mobile: '',
    designation: '',
    source: 'Website Contact Form'
  };

  const response = await axios.post(
    `${SALESMATE_BASE_URL}/contact/v4`,
    contactData,
    { headers }
  );

  return response.data;
}