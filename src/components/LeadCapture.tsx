import { useState } from 'react';
import { Mail } from 'lucide-react';

export function LeadCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, to: 'leads@fullscopemsp.com' }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-blue-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Mail className="h-12 w-12 text-blue-400 mx-auto" />
          <h2 className="mt-4 text-3xl font-bold text-white">Stay Informed with Full Scope MSP</h2>
          <p className="mt-2 text-xl text-blue-100">
            Want to stay up to date on the latest in cybersecurity and IT management? Subscribe for insights and industry news that help you protect and grow your business.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-md px-4 py-3 text-gray-900"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-400 text-blue-900 px-6 py-3 rounded-md font-semibold hover:bg-blue-300 disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {status === 'success' && (
            <p className="mt-2 text-blue-200">Thank you for subscribing!</p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-red-300">An error occurred. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default LeadCapture;