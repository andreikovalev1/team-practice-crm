import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsItem } from "../SkillsItem";
import { ProfileSkillMastery } from "../types";

const mockSkill: ProfileSkillMastery = {
  name: "React",
  categoryId: "cat-1",
  mastery: "Advanced",
};

describe("SkillsItem компонент", () => {
  it("правильно отображает название навыка", () => {
    render(<SkillsItem skill={mockSkill} isReadOnly={true} />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("не отображает зоны клика в режиме только для чтения", () => {
    const { container } = render(<SkillsItem skill={mockSkill} isReadOnly={true} />);
    const clickZones = container.querySelector(".absolute.inset-0.flex");
    expect(clickZones).not.toBeInTheDocument();
  });

  it("отображение чекбоксов в режиме удаления", () => {
    render(<SkillsItem skill={mockSkill} isReadOnly={false} isRemoveMode={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("Флажок устанавливается, когда isSelected имеет значение true.", () => {
    render(
      <SkillsItem 
        skill={mockSkill} 
        isReadOnly={false} 
        isRemoveMode={true} 
        isSelected={true} 
      />
    );
    
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("вызов onToggleSelect когда кликаешь на remove skill", () => {
    const mockOnToggle = jest.fn();
    render(
      <SkillsItem 
        skill={mockSkill} 
        isReadOnly={false} 
        isRemoveMode={true} 
        onToggleSelect={mockOnToggle} 
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith("React");
  });

  it("Вызывает метод onEditClick при щелчке по скиллу (не в режиме удаления и не read-only)", () => {
    const mockOnEdit = jest.fn();
    render(
      <SkillsItem 
        skill={mockSkill} 
        isReadOnly={false} 
        onEditClick={mockOnEdit} 
      />
    );

    const item = screen.getByText("React");
    fireEvent.click(item);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockSkill); 
  });
});