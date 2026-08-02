'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { NumericKeypad } from './NumericKeypad';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxDigits?: number;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  allowRepeatingDigits?: boolean;
}

export function NumberInput({
  value,
  onChange,
  placeholder = 'Enter 4 digits',
  maxDigits = 4,
  onComplete,
  disabled = false,
  readOnly = false,
  label,
  allowRepeatingDigits = true,
}: NumberInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timeout = window.setTimeout(() => setError(null), 1600);
    return () => window.clearTimeout(timeout);
  }, [error, isActive]);

  const handleDigit = (digit: string) => {
    if (disabled || readOnly || value.length >= maxDigits) {
      return;
    }

    if (!allowRepeatingDigits && value.includes(digit)) {
      setError('Digits must be unique.');
      return;
    }

    const nextValue = `${value}${digit}`;
    onChange(nextValue);
    setError(null);
  };

  const handleDelete = () => {
    if (disabled || readOnly) {
      return;
    }

    onChange(value.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    if (disabled || readOnly) {
      return;
    }

    onChange('');
    setError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly) {
      return;
    }

    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      handleDigit(event.key);
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      handleDelete();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (value.length === maxDigits) {
        onComplete?.(value);
      } else {
        setError(`Please enter ${maxDigits} digits.`);
      }
      return;
    }

    if (event.key === 'Escape') {
      handleClear();
    }
  };

  const boxes = Array.from({ length: maxDigits }, (_, index) => {
    const digit = value[index] ?? '';
    return (
      <div
        key={`${index}-${digit}`}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-semibold shadow-sm transition-all duration-150 sm:h-16 sm:w-16 ${
          digit ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-300'
        } ${isActive ? 'ring-2 ring-slate-400' : ''}`}
      >
        {digit || '□'}
      </div>
    );
  });

  return (
    <div className="w-full" ref={containerRef}>
      {label ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p> : null}
      <div
        className={`rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-200 ${error ? 'border-rose-400 ring-2 ring-rose-200' : ''}`}
        tabIndex={disabled || readOnly ? -1 : 0}
        role="textbox"
        aria-label={label || placeholder}
        aria-valuetext={value.length > 0 ? value : 'No digits entered'}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">{boxes}</div>
        <p className="mt-3 text-center text-sm text-slate-500">{placeholder}</p>
        {error ? <p className="mt-2 text-center text-sm font-medium text-rose-500">{error}</p> : null}
      </div>
      <div className="mt-4">
        <NumericKeypad
          value={value}
          maxDigits={maxDigits}
          onDigit={handleDigit}
          onDelete={handleDelete}
          onClear={handleClear}
          onComplete={onComplete}
          disabled={disabled}
          readOnly={readOnly}
          ariaLabel={label || placeholder}
        />
      </div>
    </div>
  );
}
