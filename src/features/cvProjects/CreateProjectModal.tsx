"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import OvalButton from "@/components/button/OvalButton";

interface CreateProjectFormInput {
  name: string;
  domain: string;
  start_date: string;
  end_date?: string;
  description: string;
  environment: string[];
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CreateProjectFormInput) => void; 
  availableEnvironments?: string[];
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreate,
  availableEnvironments = [],
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState<string[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTech, setSearchTech] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredOptions = availableEnvironments.filter(
    (t) =>
      !environment.includes(t) &&
      t.toLowerCase().includes(searchTech.toLowerCase())
  );

  const canAddCustom =
    searchTech.trim() !== "" &&
    !environment.includes(searchTech.trim()) &&
    !availableEnvironments.some(
      (t) => t.toLowerCase() === searchTech.trim().toLowerCase()
    );

  const handleAddTech = (tech: string) => {
    if (!environment.includes(tech)) {
      setEnvironment((prev) => [...prev, tech]);
    }
    setSearchTech("");
  };

  const handleRemoveTech = (tech: string) => {
    setEnvironment((prev) => prev.filter((t) => t !== tech));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (endDate && newStart > endDate) setEndDate("");
  };

  const resetForm = () => {
    setName("");
    setDomain("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setEnvironment([]);
    setSearchTech("");
    setIsDropdownOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain || !startDate || !description) return;

    onCreate({
      name,
      domain,
      start_date: startDate,
      end_date: endDate || undefined,
      description,
      environment,
    });

    resetForm();
    onClose(); 
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Project" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] md:max-h-none overflow-y-auto px-4 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FloatingInput
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FloatingInput
            label="Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 transition-all dark:peer-focus:text-red-700 dark:text-[#757575] dark:bg-[#353535]">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full bg-transparent border dark:text-[#ECECED] border-gray-300 p-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-red-700 transition-colors dark:border-[#757575] dark:focus:border-red-700"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500 transition-all dark:peer-focus:text-red-700 dark:text-[#757575] dark:bg-[#353535]">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              disabled={!startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent border border-gray-300 p-3 text-sm md:text-base text-gray-900 focus:outline-none disabled:opacity-50 focus:border-red-700 transition-colors dark:border-[#757575] dark:focus:border-red-700 dark:text-[#ECECED]"
            />
          </div>
        </div>

        <div className="relative">
          <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-400 dark:bg-[#353535] dark:border-[#757575] dark:text-[#757575] dark:peer-focus:text-red-700">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent border dark:text-[#ECECED] border-gray-300 p-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-red-700 transition-colors resize-none dark:border-[#757575] dark:focus:border-red-700" 
            placeholder="Describe the project..."
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 z-10 dark:peer-focus:text-red-700 dark:text-[#757575] dark:bg-[#353535]">
            Environment / Tech Stack
          </label>

          <div
            className={`w-full border ${
              isDropdownOpen
                ? "border-red-700"
                : "border-gray-300 dark:border-[#757575]"
            } bg-white dark:bg-[#353535] transition-colors cursor-pointer`}
            onClick={() => setIsDropdownOpen(true)}
          >
            <div className="p-3 min-h-[48px] flex flex-wrap gap-2 items-center pr-10">
              {environment.length === 0 && !isDropdownOpen && (
                <span className="text-gray-400 dark:text-[#757575] text-sm">Click to add technologies…</span>
              )}

              {environment.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs flex items-center gap-2 border border-red-100"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTech(tech);
                    }}
                    className="hover:text-red-900 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {isDropdownOpen && (
                <input
                  type="text"
                  autoFocus
                  value={searchTech}
                  onChange={(e) => setSearchTech(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Search or type custom…"
                  className="flex-1 min-w-[150px] outline-none text-sm bg-transparent"
                />
              )}
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {canAddCustom && (
                <button
                  type="button"
                  onClick={() => handleAddTech(searchTech.trim())}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-2 text-red-700 border-b border-gray-100"
                >
                  <Plus size={16} />
                  <span>Add &ldquo;{searchTech.trim()}&rdquo;</span>
                </button>
              )}

              {filteredOptions.length > 0 ? (
                filteredOptions.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleAddTech(tech)}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                  >
                    {tech}
                  </button>
                ))
              ) : (
                !canAddCustom && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    No matching technologies
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 sticky bottom-0">
          <OvalButton text="CANCEL" variant="ovalOutline" type="button" onClick={handleClose} className="w-full" />
          <OvalButton text="CREATE" variant="oval" type="submit" className="w-full" />
        </div>
      </form>
    </Modal>
  );
}