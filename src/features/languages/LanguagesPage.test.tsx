import { render, screen, fireEvent } from "@testing-library/react";
import { LanguagesPage } from "./LanguagesPage";
import { User } from "@/types/user.types";
import * as ProfileHook from "@/features/profile/useIsOwnProfile";
import * as LogicHook from "./useLanguagesLogic";

jest.mock("@/features/profile/useIsOwnProfile");
jest.mock("./useLanguagesLogic");

const mockAuthorizedUser: User = {
  id: "user-123",
  email: "test@test.com",
//   role: "employee", // Не админ
};

describe("Компонент LanguagesPage", () => {
  const mockAddLanguage = jest.fn();
  const mockRemoveLanguages = jest.fn();
  const mockUpdateLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ProfileHook, "useIsOwnProfile").mockReturnValue({
      user: mockAuthorizedUser,
      profileUserId: "user-123",
      isOwnProfile: true,
    });
  });

  it("показывает состояние загрузки", () => {
    jest.spyOn(LogicHook, "useLanguagesLogic").mockReturnValue({
      loading: true,
      userLanguagesCount: 0,
      userLanguages: [],
      availableLanguages: [],
      addLanguage: mockAddLanguage,
      updateLanguage: mockUpdateLanguage,
      removeLanguages: mockRemoveLanguages,
      isAdding: false,
      isDeleting: false,
    });

    render(<LanguagesPage />);
    expect(screen.getByText("Loading languages...")).toBeInTheDocument();
  });

  it("отображает пустое состояние, когда нет добавленных языков", () => {
    jest.spyOn(LogicHook, "useLanguagesLogic").mockReturnValue({
      loading: false,
      userLanguagesCount: 0,
      userLanguages: [],
      availableLanguages: [],
      addLanguage: mockAddLanguage,
      updateLanguage: mockUpdateLanguage,
      removeLanguages: mockRemoveLanguages,
      isAdding: false,
      isDeleting: false,
    });

    render(<LanguagesPage />);
    expect(screen.getByText("No languages added yet.")).toBeInTheDocument();
    expect(screen.queryByText(/Remove languages/i)).not.toBeInTheDocument();
  });

  it("открывает модалку добавления при клике на 'Add language'", () => {
    jest.spyOn(LogicHook, "useLanguagesLogic").mockReturnValue({
      loading: false,
      userLanguagesCount: 1,
      userLanguages: [{ name: "English", proficiency: "B2" }],
      availableLanguages: [],
      addLanguage: mockAddLanguage,
      updateLanguage: mockUpdateLanguage,
      removeLanguages: mockRemoveLanguages,
      isAdding: false,
      isDeleting: false,
    });

    render(<LanguagesPage />);
    const addButton = screen.getByText(/Add/i); 
    fireEvent.click(addButton);
    
    expect(screen.getByText("Add language")).toBeInTheDocument();
  });

  it("открывает модалку обновления при клике на язык", () => {
    jest.spyOn(LogicHook, "useLanguagesLogic").mockReturnValue({
      loading: false,
      userLanguagesCount: 1,
      userLanguages: [{ name: "English", proficiency: "B2" }],
      availableLanguages: [],
      addLanguage: mockAddLanguage,
      updateLanguage: mockUpdateLanguage,
      removeLanguages: mockRemoveLanguages,
      isAdding: false,
      isDeleting: false,
    });

    render(<LanguagesPage />);
    
    const languageItem = screen.getByText("English");
    fireEvent.click(languageItem);
    
    expect(screen.getByText("Update language")).toBeInTheDocument();
  });

  it("скрывает элементы управления в режиме read-only (чужой профиль и не админ)", () => {
    jest.spyOn(ProfileHook, "useIsOwnProfile").mockReturnValue({
      user: mockAuthorizedUser,
      profileUserId: "user-456",
      isOwnProfile: false,
    });

    jest.spyOn(LogicHook, "useLanguagesLogic").mockReturnValue({
      loading: false,
      userLanguagesCount: 1,
      userLanguages: [{ name: "English", proficiency: "B2" }],
      availableLanguages: [],
      addLanguage: mockAddLanguage,
      updateLanguage: mockUpdateLanguage,
      removeLanguages: mockRemoveLanguages,
      isAdding: false,
      isDeleting: false,
    });

    render(<LanguagesPage />);
    expect(screen.queryByText(/Add language/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Remove languages/i)).not.toBeInTheDocument();
  });
});