import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageItem } from "../LanguageItem";
import { ProfileLanguage } from "../types";

const mockLanguage: ProfileLanguage = {
  name: "English",
  proficiency: "B2",
};

describe("Компонент LanguageItem", () => {
  it("правильно отображает название языка и уровень", () => {
    render(<LanguageItem language={mockLanguage} isReadOnly={true} />);
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
  });

  it("не вызывает onEditClick в режиме только для чтения", () => {
    const mockOnEdit = jest.fn();
    render(
      <LanguageItem language={mockLanguage} isReadOnly={true} onEditClick={mockOnEdit} />
    );
    
    const item = screen.getByText("English");
    fireEvent.click(item);
    
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it("отображает чекбокс в режиме удаления", () => {
    render(
      <LanguageItem language={mockLanguage} isReadOnly={false} isRemoveMode={true} />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("устанавливает флажок, когда isSelected имеет значение true", () => {
    render(
      <LanguageItem 
        language={mockLanguage} 
        isReadOnly={false} 
        isRemoveMode={true} 
        isSelected={true} 
      />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("вызывает onToggleSelect при клике на чекбокс (или на сам блок) в режиме удаления", () => {
    const mockOnToggle = jest.fn();
    render(
      <LanguageItem 
        language={mockLanguage} 
        isReadOnly={false} 
        isRemoveMode={true} 
        onToggleSelect={mockOnToggle} 
      />
    );
    
    const container = screen.getByText("English").closest("div");
    fireEvent.click(container!);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith("English");
  });

  it("вызывает onEditClick при щелчке (не в режиме удаления и не read-only)", () => {
    const mockOnEdit = jest.fn();
    render(
      <LanguageItem 
        language={mockLanguage} 
        isReadOnly={false} 
        onEditClick={mockOnEdit} 
      />
    );

    const container = screen.getByText("English").closest("div");
    fireEvent.click(container!);
    
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockLanguage); 
  });
});