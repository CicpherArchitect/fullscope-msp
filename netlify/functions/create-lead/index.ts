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
      console.error('Missing Salesmate session token');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing API credentials'
        })
      };
    }

    // Parse and validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    let leadData: LeadData;
    try {
      leadData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON format',
          details: parseError instanceof Error ? parseError.message : 'Failed to parse request body'
        })
      };
    }

    if (!validateLeadData(leadData)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid lead data format' })
      };
    }

    if (!validateEmail(leadData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    if (!validateServices(leadData.services)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'At least one service must be selected' })
      };
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
      
      return {
        statusCode: apiError.response?.status || 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to process lead in Salesmate',
          details: apiError.response?.data?.Error?.message || apiError.message
        })
      };
    }
  } catch (error) {
    console.error('Error processing request:', error);

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