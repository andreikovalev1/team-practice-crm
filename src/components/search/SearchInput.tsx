"use client"

import { IoIosSearch } from "react-icons/io"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}: SearchInputProps) {
  return (
    <div
      className={`w-[320px] h-10 rounded-[40px] border border-gray-300 bg-white flex items-center px-4 ${className}`}
    >
      <IoIosSearch className="text-zinc-400 mr-2" size={18} />

      <Input
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-full w-full"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}