"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FloatingInput from "@/components/FloatingInput";
import FloatingSelect from "@/components/FloatingSelect"
import OvalButton from "@/components/button/OvalButton";
import { Project, UpdateProjectInput, CvProject } from "./types";

interface UpdateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
  cvProject?: CvProject | null;
  onUpdate: (projectId: string, input: UpdateProjectInput) => void;
  availableEnvironments: string[];
}

const formatDateForInput = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  } catch {
    return "";
  }
};



export function UpdateProjectModal({ isOpen, onClose, projectToEdit, cvProject, onUpdate, availableEnvironments }: UpdateProjectModalProps) {
    const hasData = !!projectToEdit || !!cvProject;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update project" className="max-w-2xl">
      {hasData ? (
        <ProjectFormContent 
          key={projectToEdit?.id || cvProject?.project.id} 
          project={projectToEdit || (cvProject?.project as Project)} 
          cvProject={cvProject || undefined}
          onUpdate={onUpdate} 
          onClose={onClose}
          availableEnvironments={availableEnvironments}
        />
      ) : (
        <div className="p-8 text-center text-gray-500">Loading project data...</div>
      )}
    </Modal>
  );
}

function ProjectFormContent({ 
  project,
  cvProject,
  onUpdate, 
  onClose,
  availableEnvironments
}: { 
  project: Project;
  cvProject?: CvProject;
  onUpdate: (projectId: string, input: UpdateProjectInput) => void; 
  onClose: () => void;
  availableEnvironments: string[];
}) {
  const baseProject = cvProject ? cvProject.project : project;
  const [name, setName] = useState(baseProject.name || "");
  const [domain, setDomain] = useState(baseProject.domain || "");
  const [startDate, setStartDate] = useState(
    formatDateForInput(cvProject?.start_date || project?.start_date)
  );
  const [endDate, setEndDate] = useState(
    formatDateForInput(cvProject?.end_date || project?.end_date)
  );
  const [description, setDescription] = useState(baseProject?.description || "");
  const [environment, setEnvironment] = useState<string[]>(baseProject?.environment || []);
  const [currentEnv, setCurrentEnv] = useState("");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (endDate && newStart && newStart > endDate) setEndDate("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim() || !startDate || !description.trim()) return;

    const input: UpdateProjectInput = {
      projectId: project.id,
      name: name.trim(),
      domain: domain.trim(),
      start_date: startDate,
      end_date: endDate || undefined,
      description: description.trim(),
      environment,
    };

    onUpdate(project.id, input);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] md:max-h-none overflow-y-auto px-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <FloatingInput
          label="Name"
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
          <label className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 transition-all">
            Start Date
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={handleStartDateChange}
            className="w-full bg-transparent border border-gray-300 dark:border-zinc-700 p-3 text-sm md:text-base text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
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
            className="w-full bg-transparent border border-gray-300 dark:border-zinc-700 p-3 text-sm md:text-base text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors disabled:opacity-50"
          />
        </div>
      </div>

      <div className="relative">
        <label className="absolute -top-3 left-3 bg-white px-1 text-xs text-gray-500">
          Description
        </label>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-transparent border border-gray-300 dark:border-zinc-700 p-3 text-sm md:text-base text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors resize-none"
          placeholder="Developing an autonomous..."
        />
      </div>

      <div>
        <FloatingSelect
          label="Select Environment / Stack"
          value={currentEnv}
          options={availableEnvironments
            .filter(env => !environment.includes(env))
            .map((env, index) => ({ id: `env-${index}`, name: env }))}
          onChange={(selectedName) => {
            if (selectedName && !environment.includes(selectedName)) {
              setEnvironment([...environment, selectedName]);
            }
            setCurrentEnv(""); 
          }}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {environment.map((env, idx) => (
            <span key={idx} className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white rounded-full text-xs flex items-center gap-2 border dark:border-zinc-600">
              {env}
              <button type="button" onClick={() => setEnvironment(prev => prev.filter((_, i) => i !== idx))}>
                <X size={12} className="text-zinc-500 hover:text-red-500" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end gap-4 dark:bg-zinc-900 sticky bottom-0 dark:border-zinc-800">
          <OvalButton text="CANCEL" variant="ovalOutline" type="button" onClick={onClose} className="w-full" />
          <OvalButton text="UPDATE" variant="oval" type="submit" className="w-full" />
      </div>
    </form>
  );
}