import { useState } from 'react';
import { ServiceCheckboxes } from './ServiceCheckboxes';
import { FormStatus } from './FormStatus';
import { submitContactForm, ApiError } from '../../services/api';
import type { FormData } from './types';

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  message: '',
  services: []
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      if (!formData.services.length) {
        throw new ApiError('Please select at least one service of interest');
      }

      const result = await submitContactForm(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData(initialFormData);

        if (result.redirectUrl) {
          setTimeout(() => {
            window.location.href = result.redirectUrl;
          }, 1500);
        }
      } else {
        throw new ApiError(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof ApiError 
          ? `${error.message}${error.details ? `: ${error.details}` : ''}`
          : 'An unexpected error occurred. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <FormStatus status={submitStatus} message={errorMessage} />
      
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              required
              disabled={isSubmitting}
              minLength={2}
              maxLength={50}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              required
              disabled={isSubmitting}
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
            disabled={isSubmitting}
            minLength={2}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
            disabled={isSubmitting}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>

        <ServiceCheckboxes
          selectedServices={formData.services}
          onServicesChange={(services) => setFormData(prev => ({ ...prev, services }))}
          disabled={isSubmitting}
        />

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
            disabled={isSubmitting}
            minLength={10}
            maxLength={1000}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? 'Submitting...' : 'Let\'s Connect'}
        </button>
      </div>
    </form>
  );
}