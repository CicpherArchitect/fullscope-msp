import { Handler } from '@netlify/functions';
import axios, { AxiosError } from 'axios';

const SALESMATE_API_URL = 'https://fullscopemsp.salesmate.io/apis/v3';
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

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const validateLeadData = (data: any): data is LeadData => {
  console.log('Validating lead data structure:', data);
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

export const handler: Handler = async (event) => {
  // Log incoming request
  console.log('Request method:', event.httpMethod);
  console.log('Request headers:', event.headers);
  console.log('Raw request body:', event.body);

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return { 
      statusCode: 204, 
      headers 
    };
  }

  // Ensure POST method
  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Validate API credentials
  if (!ACCESS_KEY || !SECRET_KEY) {
    console.error('Missing API credentials');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        details: 'Missing API credentials'
      })
    };
  }

  try {
    // Validate request body
    if (!event.body) {
      console.error('Empty request body');
      throw new Error('Request body is required');
    }

    // Parse request body
    let leadData: LeadData;
    try {
      console.log('Attempting to parse request body');
      leadData = JSON.parse(event.body);
      console.log('Successfully parsed lead data:', leadData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw body that failed to parse:', event.body);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON format',
          details: parseError instanceof Error ? parseError.message : 'Failed to parse request body',
          rawBody: event.body // Include raw body in response for debugging
        })
      };
    }

    // Validate data structure
    if (!validateLeadData(leadData)) {
      console.error('Invalid data structure:', leadData);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid data format',
          details: 'Request body missing required fields or has invalid types',
          receivedData: leadData
        })
      };
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'company', 'email', 'message', 'services'];
    const missingFields = requiredFields.filter(field => !leadData[field as keyof LeadData]);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: `Missing: ${missingFields.join(', ')}`
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      console.error('Invalid email format:', leadData.email);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid email format'
        })
      };
    }

    // Validate services array
    if (!leadData.services.length) {
      console.error('Empty services array');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Services array is empty',
          details: 'At least one service must be selected'
        })
      };
    }

    // Prepare data for Salesmate
    const salesmateData = {
      owner_id: 1,
      first_name: leadData.firstName.trim(),
      last_name: leadData.lastName.trim(),
      company_name: leadData.company.trim(),
      email: leadData.email.trim(),
      description: `Message: ${leadData.message.trim()}\n\nServices of Interest:\n${leadData.services.join('\n')}`,
      source: 'Website Contact Form',
      status: 'New'
    };

    console.log('Sending to Salesmate:', JSON.stringify(salesmateData, null, 2));

    // Send to Salesmate
    const response = await axios.post(
      `${SALESMATE_API_URL}/leads/add`,
      salesmateData,
      {
        headers: {
          'accesskey': ACCESS_KEY,
          'secretkey': SECRET_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('Salesmate response:', response.data);

    const successResponse = {
      success: true,
      data: response.data,
      redirectUrl: 'https://outlook.office365.com/owa/calendar/FullScopeDiscoveryCall@fullscopemsp.com/bookings/'
    };

    console.log('Sending success response:', successResponse);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(successResponse)
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Axios error response:', axiosError.response?.data);
      return {
        statusCode: axiosError.response?.status || 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to create lead in Salesmate',
          details: axiosError.response?.data || axiosError.message
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        stack: error instanceof Error ? error.stack : undefined
      })
    };
  }
};