import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsPage } from "../BaseSkillsPage";
import { User } from "@/types/user.types";
import * as ProfileHook from "@/features/profile/useIsOwnProfile";
import * as LogicHook from "../useSkillsLogic";

jest.mock("@/features/profile/useIsOwnProfile");
jest.mock("../useSkillsLogic");
const mockAuthorizedUser: User = {
  id: "user-123",
  email: "test@test.com",
};

describe("SkillsPage Компонент", () => {
  const mockAddSkill = jest.fn();
  const mockRemoveSkills = jest.fn();
  const mockUpdateMastery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ProfileHook, "useIsOwnProfile").mockReturnValue({
      user: mockAuthorizedUser,
      profileUserId: "user-123",
      isOwnProfile: true,
    });
  });

  it("показывает состояние загрузки", () => {
    jest.spyOn(LogicHook, "useSkillsLogic").mockReturnValue({
      loading: true,
      groupedSkills: {},
      userSkillsCount: 0,
      availableSkills: [],
      addSkill: mockAddSkill,
      removeSkills: mockRemoveSkills,
      updateMastery: mockUpdateMastery,
      isAdding: false,
      isDeleting: false,
    });

    render(<SkillsPage />);
    expect(screen.getByText("Loading skills...")).toBeInTheDocument();
  });

  it("отображает пустое состояние, когда нет навыков", () => {
    jest.spyOn(LogicHook, "useSkillsLogic").mockReturnValue({
      loading: false,
      groupedSkills: {},
      userSkillsCount: 0,
      availableSkills: [],
      addSkill: mockAddSkill,
      removeSkills: mockRemoveSkills,
      updateMastery: mockUpdateMastery,
      isAdding: false,
      isDeleting: false,
    });

    render(<SkillsPage />);
    expect(screen.getByText("No skills added yet.")).toBeInTheDocument();
    expect(screen.queryByText("Remove skills")).not.toBeInTheDocument();
  });

  it("открывает модалку когда нажата кнопка add skill", () => {
    jest.spyOn(LogicHook, "useSkillsLogic").mockReturnValue({
      loading: false,
      groupedSkills: { "Frontend": [{ name: "React", categoryId: "1", mastery: "Expert" }] },
      userSkillsCount: 1,
      availableSkills: [],
      addSkill: mockAddSkill,
      removeSkills: mockRemoveSkills,
      updateMastery: mockUpdateMastery,
      isAdding: false,
      isDeleting: false,
    });

    render(<SkillsPage />);
    const addButton = screen.getByText(/Add/i); 
    fireEvent.click(addButton);
    expect(screen.getByText("Add skill")).toBeInTheDocument();
  });

  it("открывает модалку обновления (Update skill) при клике на навык", () => {
    jest.spyOn(LogicHook, "useSkillsLogic").mockReturnValue({
      loading: false,
      groupedSkills: { "Frontend": [{ name: "React", categoryId: "1", mastery: "Expert" }] },
      userSkillsCount: 1,
      availableSkills: [],
      addSkill: mockAddSkill,
      removeSkills: mockRemoveSkills,
      updateMastery: mockUpdateMastery,
      isAdding: false,
      isDeleting: false,
    });

    render(<SkillsPage />);
    const skillItem = screen.getByText("React");
    fireEvent.click(skillItem);
    expect(screen.getByText("Update skill")).toBeInTheDocument();
  });

  it("скрывает кнопки в режиме read-only", () => {
    jest.spyOn(ProfileHook, "useIsOwnProfile").mockReturnValue({
      user: mockAuthorizedUser,
      profileUserId: "user-456",
      isOwnProfile: false,
    });

    jest.spyOn(LogicHook, "useSkillsLogic").mockReturnValue({
      loading: false,
      groupedSkills: { "Frontend": [{ name: "React", categoryId: "1", mastery: "Expert" }] },
      userSkillsCount: 1,
      availableSkills: [],
      addSkill: mockAddSkill,
      removeSkills: mockRemoveSkills,
      updateMastery: mockUpdateMastery,
      isAdding: false,
      isDeleting: false,
    });

    render(<SkillsPage />);
    expect(screen.queryByText(/Add skill/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Remove skills/i)).not.toBeInTheDocument();
  });
});