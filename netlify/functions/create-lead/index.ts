import { Handler } from '@netlify/functions';
import axios from 'axios';

const SALESMATE_BASE_URL = 'https://fullscope.salesmate.io/apis';
const ACCESS_KEY = process.env.SALESMATE_API_KEY;
const SECRET_KEY = process.env.SALESMATE_SECRET_KEY;

interface LeadData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
  services: string[];
}

interface SalesmateCompany {
  id: number;
  name: string;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const salesmateHeaders = {
  'accesskey': ACCESS_KEY,
  'secretkey': SECRET_KEY,
  'Content-Type': 'application/json'
};

const validateLeadData = (data: any): data is LeadData => {
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

async function findCompany(companyName: string): Promise<SalesmateCompany | null> {
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
        { headers: salesmateHeaders }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
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

async function createCompany(companyName: string): Promise<SalesmateCompany> {
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
      { headers: salesmateHeaders }
  );

  return {
    id: response.data.id,
    name: response.data.name
  };
}

async function createContact(data: LeadData, companyId: number) {
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
      { headers: salesmateHeaders }
  );

  return response.data;
}

export const handler: Handler = async (event) => {
  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Check for required environment variables
    if (!ACCESS_KEY || !SECRET_KEY) {
      throw new Error('Missing API credentials');
    }

    // Parse and validate request body
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const leadData: LeadData = JSON.parse(event.body);

    if (!validateLeadData(leadData)) {
      throw new Error('Invalid lead data format');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate services array
    if (!leadData.services.length) {
      throw new Error('At least one service must be selected');
    }

    // Find or create company
    let company = await findCompany(leadData.company);
    if (!company) {
      company = await createCompany(leadData.company);
    }

    // Create contact/lead
    const contact = await createContact(leadData, company.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          company,
          contact
        },
        redirectUrl: 'https://outlook.office365.com/owa/calendar/FullScopeDiscoveryCall@fullscopemsp.com/bookings/'
      })
    };
  } catch (error) {
    console.error('Error processing request:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON format',
          details: error.message
        })
      };
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;

      return {
        statusCode: status,
        headers,
        body: JSON.stringify({
          error: 'Failed to process lead',
          details: errorMessage,
          step: error.config?.url?.includes('company') ? 'company' : 'contact'
        })
      };
    }

    // Generic error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    };
  }
};
