import { render, screen } from "@testing-library/react";
import { SkillsList } from "../SkillsList";
import { ProfileSkillMastery } from "../types";

describe("SkillsList Компонент", () => {
  const mockGroupedSkills: Record<string, ProfileSkillMastery[]> = {
    "Frontend": [
      { name: "React", categoryId: "cat-1", mastery: "Expert" },
      { name: "HTML", categoryId: "cat-1", mastery: "Advanced" },
    ],
    "Backend": [
      { name: "Node.js", categoryId: "cat-2", mastery: "Competent" },
    ],
  };

  it("корректно отображает заголовки категорий", () => {
    render(<SkillsList groupedSkills={mockGroupedSkills} isReadOnly={true} />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("отображает все навыки из сгруппированного объекта", () => {
    render(<SkillsList groupedSkills={mockGroupedSkills} isReadOnly={true} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("передает isRemoveMode в SkillsItem", () => {
    render(
      <SkillsList 
        groupedSkills={mockGroupedSkills} 
        isReadOnly={false} 
        isRemoveMode={true} 
      />
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });
});