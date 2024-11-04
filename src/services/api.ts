import type { FormData } from '../components/Contact/types';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  redirectUrl?: string;
}

export class ApiError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function submitContactForm(formData: FormData): Promise<ApiResponse> {
  try {
    console.log('Submitting form data:', formData);

    const response = await fetch('/.netlify/functions/create-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      throw new ApiError('Invalid server response format');
    }

    let data: ApiResponse;
    try {
      data = await response.json();
      console.log('Response data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new ApiError('Failed to parse server response');
    }

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Failed to submit form',
        data.details
      );
    }

    return data;
  } catch (error) {
    console.error('Form submission error:', error);

    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new ApiError('Invalid response format from server');
    }

    throw new ApiError(
      'Network error occurred. Please check your connection and try again.'
    );
  }
}