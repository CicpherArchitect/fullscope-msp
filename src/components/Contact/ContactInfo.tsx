import { Mail, Phone } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="flex items-center">
          <Phone className="h-6 w-6 text-blue-600" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Phone</h3>
            <p className="text-gray-600">(951) 717-8781</p>
            <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
          </div>
        </div>
        <div className="flex items-center">
          <Mail className="h-6 w-6 text-blue-600" />
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Email</h3>
            <p className="text-gray-600">contact@fullscopemsp.com</p>
            <p className="text-sm text-gray-500">Response within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}