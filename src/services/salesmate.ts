import axios from 'axios';

const SALESMATE_API_URL = 'https://fullscopemsp.salesmate.io/apis/v3';
const ACCESS_KEY = 'e55130c0-d0b7-11ee-9435-517682d0b702';
const SECRET_KEY = 'e55130c1-d0b7-11ee-9435-517682d0b702';

interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  message: string;
  services: string[];
}

export async function createLead(formData: ContactFormData) {
  try {
    const response = await axios.post(
      `${SALESMATE_API_URL}/leads/add`,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        email: formData.email,
        description: formData.message,
        customFields: {
          services: formData.services.join(', ')
        }
      },
      {
        headers: {
          'accesskey': ACCESS_KEY,
          'secretkey': SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}