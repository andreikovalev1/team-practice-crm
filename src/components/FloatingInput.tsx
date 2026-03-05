"use client";

import React from "react";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FloatingInput({
  label,
  className = "",
  ...props
}: FloatingInputProps) {
  return (
    <div className="relative w-full">
      <input
        {...props}
        placeholder=" "
        className={`peer w-full border border-gray-300 bg-transparent px-3 py-3 text-sm text-gray-900 focus:border-red-700 focus:outline-none focus:ring-0 transition-colors ${className}`}
      />
      <label
        className="
          absolute left-3 top-1/2
          -translate-y-1/2
          bg-white px-1
          text-sm text-gray-500
          origin-left
          transition-all duration-200
          peer-focus:-translate-y-8
          peer-not-placeholder-shown:-translate-y-8
          peer-focus:text-xs
          peer-focus:text-red-700
          peer-not-placeholder-shown:text-xs
          pointer-events-none
        "
      >
        {label}
      </label>
    </div>
  );
}