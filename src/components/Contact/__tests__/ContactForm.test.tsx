import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '../ContactForm';
import { submitContactForm } from '../../../services/api';

// Mock the API module
vi.mock('../../../services/api', () => ({
  submitContactForm: vi.fn(),
  ApiError: class extends Error {
    constructor(message: string, public details?: any) {
      super(message);
      this.name = 'ApiError';
    }
  }
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByText(/services of interest/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /connect/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/select at least one service/i)).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    const mockSubmit = submitContactForm as unknown as ReturnType<typeof vi.fn>;
    mockSubmit.mockResolvedValueOnce({ success: true });

    render(<ContactForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/company/i), 'Test Corp');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@test.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
    
    // Select a service
    const serviceCheckbox = screen.getByLabelText(/managed it services/i);
    await userEvent.click(serviceCheckbox);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /connect/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        company: 'Test Corp',
        email: 'john@test.com',
        message: 'Test message',
        services: ['Managed IT Services']
      });
    });
  });

  it('handles API errors', async () => {
    const mockSubmit = submitContactForm as unknown as ReturnType<typeof vi.fn>;
    mockSubmit.mockRejectedValueOnce(new Error('API Error'));

    render(<ContactForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/company/i), 'Test Corp');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@test.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
    
    // Select a service
    const serviceCheckbox = screen.getByLabelText(/managed it services/i);
    await userEvent.click(serviceCheckbox);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /connect/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/error occurred/i)).toBeInTheDocument();
  });
});