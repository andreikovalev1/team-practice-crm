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
        className={`peer w-full border border-gray-300 rounded-md bg-transparent px-3 py-2.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-0 transition-colors ${className}`}
      />
      <label className="absolute left-3 -top-2.5 bg-[#F8F8F8] px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-900 pointer-events-none">
        {label}
      </label>
    </div>
  );
}