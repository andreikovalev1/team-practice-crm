import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdateLanguageModal } from "./UpdateLanguageModal";
import { ProfileLanguage } from "./types";
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

describe("Компонент UpdateLanguageModal", () => {
  const mockLanguage: ProfileLanguage = {
    name: "English",
    proficiency: "B2",
  };

  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("не рендерится, если isOpen === false", () => {
    render(
      <UpdateLanguageModal 
        isOpen={false} 
        onClose={mockOnClose} 
        language={mockLanguage} 
        onUpdate={mockOnUpdate} 
      />
    );
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("открывается и подставляет текущие данные языка по умолчанию", () => {
    render(
      <UpdateLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        language={mockLanguage} 
        onUpdate={mockOnUpdate} 
      />
    );

    const languageSelect = screen.getByTestId("select-Language") as HTMLSelectElement;
    expect(languageSelect).toBeDisabled();
    expect(languageSelect.value).toBe("English");
    
    const proficiencySelect = screen.getByTestId("select-Proficiency") as HTMLSelectElement;
    expect(proficiencySelect.value).toBe("B2");
  });

  it("позволяет изменить уровень и успешно отправляет форму", async () => {
    mockOnUpdate.mockResolvedValueOnce(undefined); 
    const user = userEvent.setup();

    render(
      <UpdateLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        language={mockLanguage} 
        onUpdate={mockOnUpdate} 
      />
    );

    const proficiencySelect = screen.getByTestId("select-Proficiency");
    const submitBtn = screen.getByText("Confirm");

    await user.selectOptions(proficiencySelect, "C1");
    await user.click(submitBtn);
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith("English", "C1");
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("вызывает onClose при клике на кнопку Cancel", async () => {
    const user = userEvent.setup();

    render(
      <UpdateLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        language={mockLanguage} 
        onUpdate={mockOnUpdate} 
      />
    );

    const cancelBtn = screen.getByText("Cancel");
    await user.click(cancelBtn);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it("показывает состояние загрузки (Saving...) при isUpdating === true", () => {
    render(
      <UpdateLanguageModal 
        isOpen={true} 
        onClose={mockOnClose} 
        language={mockLanguage} 
        onUpdate={mockOnUpdate} 
        isUpdating={true}
      />
    );

    const submitBtn = screen.getByText("Saving...") as HTMLButtonElement;
    expect(submitBtn).toBeDisabled();
    const cancelBtn = screen.getByText("Cancel") as HTMLButtonElement;
    expect(cancelBtn).toBeDisabled();
    const proficiencySelect = screen.getByTestId("select-Proficiency") as HTMLSelectElement;
    expect(proficiencySelect).toBeDisabled();
  });
});