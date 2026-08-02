'use client';

import { type KeyboardEvent } from 'react';

interface NumericKeypadProps {
  value: string;
  maxDigits: number;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  ariaLabel?: string;
}

const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export function NumericKeypad({
  value,
  maxDigits,
  onDigit,
  onDelete,
  onClear,
  onComplete,
  disabled = false,
  readOnly = false,
  className = '',
  ariaLabel = 'Numeric keypad',
}: NumericKeypadProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && value.length >= maxDigits) {
      event.preventDefault();
      onComplete?.(value);
    }
  };

  return (
    <div
      className={`w-full ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => onDigit(digit)}
            disabled={disabled || readOnly || value.length >= maxDigits}
            aria-label={`Enter ${digit}`}
            className="flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={onClear}
          disabled={disabled || readOnly}
          aria-label="Clear input"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-300 bg-slate-100 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          CLR
        </button>
        <button
          type="button"
          onClick={() => onDigit('0')}
          disabled={disabled || readOnly || value.length >= maxDigits}
          aria-label="Enter 0"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          0
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled || readOnly || value.length === 0}
          aria-label="Delete last digit"
          className="flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-300 bg-slate-100 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          DEL
        </button>
      </div>
    </div>
  );
}
