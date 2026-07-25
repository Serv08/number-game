'use client';

import { useState } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function NumberInput({ value, onChange, placeholder = 'Enter 4 digits' }: NumberInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (input: string) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length <= 4) {
      onChange(cleaned);
      setError(cleaned.length === 4 ? null : 'Please enter 4 digits.');
    }
  };

  return (
    <div className="w-full">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg font-medium shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
