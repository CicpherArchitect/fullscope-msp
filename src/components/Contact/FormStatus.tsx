interface FormStatusProps {
  status: 'idle' | 'success' | 'error';
  message: string | null;
}

export function FormStatus({ status, message }: FormStatusProps) {
  if (status === 'idle' || !message) return null;

  const statusClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`mb-4 p-4 rounded-md border ${statusClasses[status]}`}>
      {message}
    </div>
  );
}