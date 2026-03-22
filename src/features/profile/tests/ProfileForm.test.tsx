import { render, screen, fireEvent } from "@testing-library/react";
import ProfileForm from "../ProfileForm";
import { useProfileUser } from "../useProfileUser";
import { useProfileFormLogic } from "../useProfileFormLogic";
import { User } from "@/types/user.types";

jest.mock("../useProfileUser");
jest.mock("../useProfileFormLogic");

describe("ProfileForm UI Component", () => {
  const mockUser: User = {
    id: "1",
    email: "test@test.com",
    role: "Employee",
    created_at: "1672531200000",
  };

  const defaultLogicMock = {
    firstName: "John",
    lastName: "Doe",
    department: "IT",
    position: "Dev",
    avatarPreview: null,
    isDirty: false,
    isSubmitting: false,
    setFirstName: jest.fn(),
    setLastName: jest.fn(),
    handleUpdate: jest.fn(),
    deptData: { departments: [] },
    posData: { positions: [] },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProfileFormLogic as jest.Mock).mockReturnValue(defaultLogicMock);
  });

  it("рендерит состояние загрузки", () => {
    (useProfileUser as jest.Mock).mockReturnValue({ isClient: true, loading: true });
    
    render(<ProfileForm />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("рендерит форму с данными пользователя", () => {
    (useProfileUser as jest.Mock).mockReturnValue({
      isClient: true,
      loading: false,
      profileUser: mockUser,
      isOwnProfile: true, 
    });

    render(<ProfileForm />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
    
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  it("рендерит форму в режиме 'Только чтение' (isReadOnly) для чужого профиля", () => {
    (useProfileUser as jest.Mock).mockReturnValue({
      isClient: true,
      loading: false,
      profileUser: mockUser,
      isOwnProfile: false,
    });

    render(<ProfileForm />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    
    expect(firstNameInput).toBeDisabled();
    
    expect(screen.queryByRole("button", { name: /Update/i })).not.toBeInTheDocument();
  });

  it("вызывает handleUpdate при клике на активную кнопку Update", () => {
    (useProfileUser as jest.Mock).mockReturnValue({
      isClient: true,
      loading: false,
      profileUser: mockUser,
      isOwnProfile: true,
    });

    (useProfileFormLogic as jest.Mock).mockReturnValue({
      ...defaultLogicMock,
      isDirty: true,
    });

    render(<ProfileForm />);

    const updateButton = screen.getByRole("button", { name: /Update/i });
    expect(updateButton).not.toBeDisabled();

    fireEvent.click(updateButton);

    expect(defaultLogicMock.handleUpdate).toHaveBeenCalledTimes(1);
  });
});