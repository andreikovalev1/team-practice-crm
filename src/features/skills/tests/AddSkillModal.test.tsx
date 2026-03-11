import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddSkillModal } from "../AddSkillModal";
import { GlobalSkill } from "../types";
import { ReactNode } from "react";

interface MockFloatingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
}

jest.mock("@/components/FloatingSelect", () => {
  return function MockFloatingSelect({ label, value, onChange, options }: MockFloatingSelectProps) {
    return (
      <div data-testid={`select-wrapper-${label}`}>
        <label>{label}</label>
        <select 
          data-testid={`select-${label}`} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.name}>{opt.name}</option>
          ))}
        </select>
      </div>
    );
  };
});

interface MockModalProps {
  isOpen: boolean;
  children: ReactNode;
  title: string;
}

jest.mock("@/components/ui/Modal", () => {
  return function MockModal({ isOpen, children, title }: MockModalProps) {
    if (!isOpen) return null;
    return <div data-testid="mock-modal"><h1>{title}</h1>{children}</div>;
  };
});

interface MockOvalButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

jest.mock("@/components/button/OvalButton", () => {
  return function MockOvalButton({ text, onClick, type = "button" }: MockOvalButtonProps) {
    return <button type={type} onClick={onClick}>{text}</button>;
  };
});

describe("Компонент AddSkillModal", () => {
  const mockAvailableSkills: GlobalSkill[] = [
    { id: "1", name: "React", category_name: "Frontend" },
    { id: "2", name: "Node.js", category_name: "Backend" },
  ];

  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("не рендерится, если isOpen === false", () => {
    render(
      <AddSkillModal 
        isOpen={false} 
        onClose={mockOnClose} 
        availableSkills={mockAvailableSkills} 
        onAdd={mockOnAdd} 
        isAdding={false} 
      />
    );
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("рендерится и позволяет отправить форму", async () => {
    mockOnAdd.mockResolvedValueOnce(undefined); 
    const user = userEvent.setup();

    render(
      <AddSkillModal 
        isOpen={true} 
        onClose={mockOnClose} 
        availableSkills={mockAvailableSkills} 
        onAdd={mockOnAdd} 
        isAdding={false} 
      />
    );

    const skillSelect = screen.getByTestId("select-Skill");
    const masterySelect = screen.getByTestId("select-Skill mastery");
    const submitBtn = screen.getByText("Confirm");

    await user.selectOptions(skillSelect, "React");
    await user.selectOptions(masterySelect, "Advanced");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith("React", "Frontend", "Advanced");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});