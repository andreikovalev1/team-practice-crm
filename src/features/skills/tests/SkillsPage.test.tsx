import { render, screen, fireEvent } from "@testing-library/react";
import { SkillsPage } from "../SkillsPage"; 
import { User } from "@/types/user.types";
import * as ProfileHook from "@/features/profile/useIsOwnProfile";
import * as LogicHook from "../useSkillsLogic";
import * as AdminHook from "@/lib/useAdmin";

jest.mock("@/features/profile/useIsOwnProfile");
jest.mock("../useSkillsLogic");
jest.mock("@/lib/useAdmin");

const mockAuthorizedUser: User = {
  id: "user-123",
  email: "test@test.com",
  role: "Employee"
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

    jest.spyOn(AdminHook, "useAdmin").mockReturnValue(false);
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
    } as ReturnType<typeof LogicHook.useSkillsLogic>);

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
    } as ReturnType<typeof LogicHook.useSkillsLogic>);

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
    } as ReturnType<typeof LogicHook.useSkillsLogic>);

    render(<SkillsPage />);
    
    const addButton = screen.getByText(/Add/i); 
    fireEvent.click(addButton);
    expect(screen.getByText(/Add skill/i)).toBeInTheDocument();
  });

  it("открывает модалку обновления при клике на навык", () => {
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
    } as ReturnType<typeof LogicHook.useSkillsLogic>);

    render(<SkillsPage />);
    const skillItem = screen.getByText("React");
    fireEvent.click(skillItem);
    expect(screen.getByText(/Update skill/i)).toBeInTheDocument();
  });

  it("скрывает кнопки в режиме read-only (не свой профиль и не админ)", () => {
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
    } as ReturnType<typeof LogicHook.useSkillsLogic>);

    render(<SkillsPage />);
    
    expect(screen.queryByText(/Add skill/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Remove skills/i)).not.toBeInTheDocument();
  });

  it("показывает кнопки, если профиль чужой, но пользователь — админ", () => {
    jest.spyOn(ProfileHook, "useIsOwnProfile").mockReturnValue({
      user: mockAuthorizedUser,
      profileUserId: "user-456",
      isOwnProfile: false,
    });

    jest.spyOn(AdminHook, "useAdmin").mockReturnValue(true);

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
    } as ReturnType<typeof LogicHook.useSkillsLogic>);

    render(<SkillsPage />);
    
    expect(screen.getByText(/Add/i)).toBeInTheDocument();
  });
});