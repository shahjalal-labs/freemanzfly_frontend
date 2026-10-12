"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface SortDropdownProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-low-high", label: "Price (Low > High)" },
  { value: "price-high-low", label: "Price (High > Low)" },
]

export function SortDropdown({ value, onValueChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = sortOptions.find((option) => option.value === value) || sortOptions[0]

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-48 px-3 py-2 border bg-white text-gray-700 hover:bg-stone-50 transition rounded-[99px]"
      >
        {selectedOption.label}
        <ChevronDown
          className={`h-4 w-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
          {sortOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
              className={`px-3 py-2 cursor-pointer rounded-md transition-colors ${
                value === option.value
                  ? "bg-[#FC961A1A] text-gray-900"
                  : "text-gray-700 hover:bg-[#FC961A1A]"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}