import { render, screen } from "@testing-library/react";
import { LanguagesList } from "../LanguagesList";
import { ProfileLanguage } from "../types";

describe("Компонент LanguagesList", () => {
  const mockLanguages: ProfileLanguage[] = [
    { name: "English", proficiency: "B2" },
    { name: "Spanish", proficiency: "A1" },
    { name: "Belarusian", proficiency: "Native" },
  ];

  it("отображает все переданные языки", () => {
    render(<LanguagesList languages={mockLanguages} isReadOnly={true} />);
    
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("Belarusian")).toBeInTheDocument();
    
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("Native")).toBeInTheDocument();
  });

  it("передает isRemoveMode и отображает чекбоксы", () => {
    render(
      <LanguagesList 
        languages={mockLanguages} 
        isReadOnly={false} 
        isRemoveMode={true} 
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });
});