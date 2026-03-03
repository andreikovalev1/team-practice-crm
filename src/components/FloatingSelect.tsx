"use client";

import React from "react";

interface Option {
  id: string;
  name: string;
}

interface FloatingSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

export default function FloatingSelect({
  label,
  options,
  className = "",
  ...props
}: FloatingSelectProps) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={`peer w-full border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-0 appearance-none transition-colors ${className}`}
      >
        <option value="">Select {label}</option>

        {options.map((opt) => (
          <option key={opt.id} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>

      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        ▼
      </div>

      <label className="absolute left-3 -top-2.5 bg-[#F8F8F8] px-1 text-xs text-gray-500 pointer-events-none">
        {label}
      </label>
    </div>
  );
}