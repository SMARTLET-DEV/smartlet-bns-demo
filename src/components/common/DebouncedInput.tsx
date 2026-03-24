import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface DebouncedInputProps {
  value: string | number;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  type?: string;
  className?: string;
  min?: number;
  inputMode?: "numeric" | "text";
  pattern?: string;
  autoComplete?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Input component with built-in debouncing
 * Updates parent only after delay period (default: 800ms for price inputs)
 * 
 * @example
 * <DebouncedInput
 *   value={price}
 *   onChange={(val) => updateFilters({ priceMin: Number(val) })}
 *   delay={800}
 *   placeholder="Min Price"
 *   type="number"
 * />
 */
export function DebouncedInput({
  value: externalValue,
  onChange,
  delay = 800,
  placeholder,
  type = "text",
  className,
  min,
  inputMode,
  pattern,
  autoComplete,
  onBlur,
}: DebouncedInputProps) {
  const [internalValue, setInternalValue] = useState(String(externalValue || ""));

  // Sync external value changes to internal state (e.g., from URL changes)
  useEffect(() => {
    setInternalValue(String(externalValue || ""));
  }, [externalValue]);

  // Debounce internal value changes before calling parent onChange
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== String(externalValue)) {
        onChange(internalValue);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [internalValue, delay, onChange, externalValue]);

  return (
    <Input
      className={className}
      type={type}
      placeholder={placeholder}
      value={internalValue}
      min={min}
      onChange={(e) => setInternalValue(e.target.value)}
      onBlur={onBlur}
      inputMode={inputMode}
      pattern={pattern}
      autoComplete={autoComplete}
    />
  );
}

