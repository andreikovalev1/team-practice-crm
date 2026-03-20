"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import FloatingSelect from "@/components/FloatingSelect";
import OvalButton from "@/components/button/OvalButton";
import { GET_ALL_PROJECTS } from "./graphql";
import { Project, AddCvProjectInput } from "./types";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: Omit<AddCvProjectInput, "cvId">) => Promise<void>;
}

export function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
  const { data: projectsData } = useQuery<{ projects: Project[] }>(GET_ALL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [currentResp, setCurrentResp] = useState("");
  const selectedProject = projectsData?.projects.find((p) => p.id === selectedProjectId);
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (endDate && newStart > endDate) setEndDate("");
  };

  const handleAddResponsibility = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentResp.trim() !== "") {
      e.preventDefault();
      setResponsibilities([...responsibilities, currentResp.trim()]);
      setCurrentResp("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !startDate) return;

    await onAdd({
      projectId: selectedProjectId,
      start_date: startDate,
      end_date: endDate || undefined,
      roles: [],
      responsibilities,
    });
    
    setSelectedProjectId("");
    setStartDate("");
    setEndDate("");
    setResponsibilities([]);
    onClose();
  };

  const projectOptions = projectsData?.projects.map(p => ({
    id: p.id,
    name: p.name
  })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add project">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 max-h-[70vh] md:max-h-none overflow-y-auto px-1 pb-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <FloatingSelect
            label="Project"
            options={projectOptions}
            value={selectedProject?.name || ""}
            onChange={(name) => {
              const id = projectOptions.find(opt => opt.name === name)?.id;
              setSelectedProjectId(id || "");
            }}
          />

          <FloatingInput
            label="Domain"
            readOnly
            value={selectedProject?.domain || ""}
            disabled
          />

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 transition-all">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full bg-transparent border border-gray-300 p-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-red-700 transition-colors"
            />
          </div>

          <div className="relative">
            <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500 transition-all">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              disabled={!startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent border border-gray-300 p-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-red-700 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div className="relative">
          <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-400">
            Description
          </label>
          <textarea
            readOnly
            rows={3}
            value={selectedProject?.description || ""}
            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm md:text-base text-gray-500 focus:outline-none cursor-not-allowed resize-none"
          />
        </div>

        <div className="relative border border-gray-200 p-3 min-h-[52px] flex items-center flex-wrap gap-2 bg-gray-50">
          <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-400">
            Environment
          </label>
          {selectedProject?.environment?.length ? (
            selectedProject.environment.map((env, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-sm md:text-base font-medium">
                {env}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm  md:text-base">No environment specified</span>
          )}
        </div>

        <div>
          <FloatingInput
            label="Responsibilities (Press Enter to add)"
            value={currentResp}
            onChange={(e) => setCurrentResp(e.target.value)}
            onKeyDown={handleAddResponsibility}
          />
          <div className="flex flex-wrap gap-2">
            {responsibilities.map((resp, idx) => (
              <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs flex items-center gap-2 border border-red-100">
                {resp}
                <button type="button" onClick={() => setResponsibilities(prev => prev.filter((_, i) => i !== idx))}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-4 pt-4 bg-white sticky bottom-0">
            <OvalButton text="CANCEL" variant="ovalOutline" type="button" onClick={onClose} className="w-full" />
            <OvalButton text="ADD" variant="oval" type="submit" className="w-full" />
        </div>
      </form>
    </Modal>
  );
}