import { Handler } from '@netlify/functions';
import axios from 'axios';
import { headers, getSalesmateHeaders } from './config';
import { validateLeadData, validateEmail, validateServices } from './validators';
import { findCompany, createCompany, createContact } from './salesmate';
import type { LeadData } from './types';

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
    const sessionToken = process.env.SALESMATE_SESSION_TOKEN;

    if (!sessionToken) {
      throw new Error('Missing Salesmate session token');
    }

    // Parse and validate request body
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const leadData: LeadData = JSON.parse(event.body);

    if (!validateLeadData(leadData)) {
      throw new Error('Invalid lead data format');
    }

    if (!validateEmail(leadData.email)) {
      throw new Error('Invalid email format');
    }

    if (!validateServices(leadData.services)) {
      throw new Error('At least one service must be selected');
    }

    const salesmateHeaders = getSalesmateHeaders(sessionToken);

    try {
      // Find or create company
      let company = await findCompany(leadData.company, salesmateHeaders);

      if (!company) {
        company = await createCompany(leadData.company, salesmateHeaders);
      }

      // Create contact/lead
      const contact = await createContact(leadData, company.id, salesmateHeaders);

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
    } catch (apiError) {
      console.error('Salesmate API error:', apiError.response?.data || apiError);
      throw new Error(apiError.response?.data?.message || 'Failed to process lead in Salesmate');
    }
  } catch (error) {
    console.error('Error processing request:', error);

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

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process lead',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    };
  }
};
