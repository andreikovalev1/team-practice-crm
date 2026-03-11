import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddLanguageModal } from "../AddLanguageModal";
import { GlobalLanguage } from "../types";
import { ReactNode } from "react";

interface MockFloatingSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
  disabled?: boolean;
}

jest.mock("@/components/FloatingSelect", () => {
  return function MockFloatingSelect({ label, value, onChange, options, disabled }: MockFloatingSelectProps) {
    return (
      <div data-testid={`select-wrapper-${label}`}>
        <label>{label}</label>
        <select 
          data-testid={`select-${label}`} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">-- Choose --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
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
  disabled?: boolean;
}

jest.mock("@/components/button/OvalButton", () => {
  return function MockOvalButton({ text, onClick, type = "button", disabled }: MockOvalButtonProps) {
    return <button type={type} onClick={onClick} disabled={disabled}>{text}</button>;
  };
});

describe("Компонент AddLanguageModal", () => {
  const mockAvailableLanguages: GlobalLanguage[] = [
    { id: "1", name: "English", iso2: "en" },
    { id: "2", name: "Spanish", iso2: "es" },
  ];

  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("не рендерится, если isOpen === false", () => {
    render(
      <AddLanguageModal 
        isOpen={false} 
        onClose={mockOnClose} 
        availableLanguages={mockAvailableLanguages} 
        onAdd={mockOnAdd} 
      />
    );
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("открывается с пустыми полями по умолчанию", () => {
    render(
      <AddLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        availableLanguages={mockAvailableLanguages} 
        onAdd={mockOnAdd} 
      />
    );

    const languageSelect = screen.getByTestId("select-Language") as HTMLSelectElement;
    expect(languageSelect.value).toBe("");
    
    const proficiencySelect = screen.getByTestId("select-Proficiency") as HTMLSelectElement;
    expect(proficiencySelect.value).toBe("");
  });

  it("позволяет выбрать язык и уровень и успешно отправляет форму", async () => {
    mockOnAdd.mockResolvedValueOnce(undefined); 
    const user = userEvent.setup();

    render(
      <AddLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        availableLanguages={mockAvailableLanguages} 
        onAdd={mockOnAdd} 
      />
    );

    const languageSelect = screen.getByTestId("select-Language");
    const proficiencySelect = screen.getByTestId("select-Proficiency");
    const submitBtn = screen.getByText("Confirm");

    await user.selectOptions(languageSelect, "2");
    await user.selectOptions(proficiencySelect, "C1"); 
    
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith("2", "C1");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("показывает состояние загрузки (Adding...) при isAdding === true", () => {
    render(
      <AddLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        availableLanguages={mockAvailableLanguages} 
        onAdd={mockOnAdd} 
        isAdding={true}
      />
    );

    const submitBtn = screen.getByText("Adding...") as HTMLButtonElement;
    expect(submitBtn).toBeDisabled();
    
    const languageSelect = screen.getByTestId("select-Language") as HTMLSelectElement;
    expect(languageSelect).toBeDisabled();
  });
});