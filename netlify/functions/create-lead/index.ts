import type { Handler } from '@netlify/functions';
import axios from 'axios';

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
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers 
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!ACCESS_KEY || !SECRET_KEY) {
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
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const leadData: LeadData = JSON.parse(event.body);

    if (!validateLeadData(leadData)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid data format',
          details: 'Request body missing required fields or has invalid types'
        })
      };
    }

    const requiredFields = ['firstName', 'lastName', 'company', 'email', 'message', 'services'];
    const missingFields = requiredFields.filter(field => !leadData[field as keyof LeadData]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: `Missing: ${missingFields.join(', ')}`
        })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid email format'
        })
      };
    }

    if (!leadData.services.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Services array is empty',
          details: 'At least one service must be selected'
        })
      };
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: response.data,
        redirectUrl: 'https://outlook.office365.com/owa/calendar/FullScopeDiscoveryCall@fullscopemsp.com/bookings/'
      })
    };
  } catch (error) {
    console.error('Error creating lead:', error);

    if (axios.isAxiosError(error)) {
      return {
        statusCode: error.response?.status || 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to create lead in Salesmate',
          details: error.response?.data || error.message
        })
      };
    }

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