const { Handler } = require('@netlify/functions');
const axios = require('axios');

const SALESMATE_API_URL = 'https://fullscopemsp.salesmate.io/apis/v3';
const ACCESS_KEY = process.env.SALESMATE_API_KEY;
const SECRET_KEY = process.env.SALESMATE_SECRET_KEY;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const validateLeadData = (data) => {
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

exports.handler = async (event) => {
  console.log('Function invoked with event:', event);

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
    if (!event.body) {
      throw new Error('Request body is required');
    }

    let leadData;
    try {
      console.log('Parsing request body:', event.body);
      leadData = JSON.parse(event.body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON format',
          details: parseError.message
        })
      };
    }

    if (!validateLeadData(leadData)) {
      console.error('Invalid data structure:', leadData);
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
    const missingFields = requiredFields.filter(field => !leadData[field]);

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
      console.error('Axios error response:', error.response?.data);
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
        details: error.message
      })
    };
  }
};