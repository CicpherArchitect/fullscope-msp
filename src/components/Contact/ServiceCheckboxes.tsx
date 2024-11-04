interface ServiceCheckboxesProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  disabled: boolean;
}

export function ServiceCheckboxes({ selectedServices, onServicesChange, disabled }: ServiceCheckboxesProps) {
  const services = [
    'Managed IT Services',
    '24/7 SOC/SIEM',
    'Endpoint Protection',
    'Access Management',
    'Cyber Incident Response',
    'Digital Forensics',
    'Data Recovery',
    'Website Services',
    'DevOps & DevSecOps',
    'SRE Support'
  ];

  const handleServiceChange = (service: string) => {
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter(s => s !== service)
      : [...selectedServices, service];
    onServicesChange(updatedServices);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Services of Interest
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <label key={service} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => handleServiceChange(service)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">{service}</span>
          </label>
        ))}
      </div>
    </div>
  );
}