"use client";

import { useState, useRef, useEffect, useId } from "react";
import { RxTriangleDown } from "react-icons/rx";

interface Option {
  id: string;
  name: string;
}

interface FloatingSelectProps {
  id?: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function FloatingSelect({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  className = "",
}: FloatingSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div
        id={selectId}
        role="combobox"
        aria-labelledby={`${selectId}-label`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        className={`
          relative w-full border duration-200 cursor-pointer flex items-center justify-between
          bg-transparent px-3 py-3 text-sm text-gray-900
          ${disabled ? "opacity-50 cursor-not-allowed border-gray-300" : ""}
          ${isFocused ? "border-red-700" : "border-gray-300"} // красная граница при фокусе
        `}
      >
        <span className={`truncate ${value ? "text-gray-900" : "text-transparent"}`}>
          {value || "Placeholder"}
        </span>

        <RxTriangleDown
          size={23}
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <label
        id={`${selectId}-label`}
        className={`
          absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none z-5
          ${isOpen || value ? "-top-3 text-sm" : "top-3.5 text-base"}
          ${isFocused ? "text-[#C10007]" : "text-gray-500"}
        `}
      >
        {label}
      </label>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.name)}
                className={`
                  px-4 py-2.5 text-sm cursor-pointer transition-colors text-left
                  ${value === opt.name ? "bg-red-50 text-[#C8372D] font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                `}
              >
                {opt.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}