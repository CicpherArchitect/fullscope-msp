export default function Logo() {
  return (
    <div className="flex items-center">
      <img 
        src="/logo.png" 
        alt="Full Scope MSP" 
        className="h-12 w-auto object-contain"
        style={{ maxWidth: '180px' }}
      />
    </div>
  );
}