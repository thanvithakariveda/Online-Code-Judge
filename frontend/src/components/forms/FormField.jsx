/** Reusable labeled input with inline validation error */
export default function FormField({ label, error, className = '', ...inputProps }) {
  return (
    <div>
      {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
      <input
        className={`input-field w-full ${error ? 'border-red-400/60 focus:border-red-400' : ''} ${className}`}
        {...inputProps}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
