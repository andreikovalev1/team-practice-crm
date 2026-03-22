import { renderHook, act } from "@testing-library/react";
import { useProfileFormLogic } from "../useProfileFormLogic";
import { useUserStore } from "@/store/useUserStore";
import { User } from "@/types/user.types";
import { useQuery, useMutation } from "@apollo/client/react"; 

jest.mock("@/store/useUserStore");
jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

const mockUser: User = {
  id: "1",
  email: "test@test.com",
  role: "Employee",
  department_name: "IT",
  position_name: "Developer",
  profile: {
    first_name: "John",
    last_name: "Doe",
    avatar: "url",
  },
};

describe("useProfileFormLogic", () => {
  const mockSetLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    jest.mocked(useUserStore).mockReturnValue({ 
      setLogin: mockSetLogin,
      user: null, 
      isLoggedIn: false,
      logout: jest.fn()
    });

    jest.mocked(useQuery).mockReturnValue({ 
      data: undefined, 
      loading: false 
    } as unknown as ReturnType<typeof useQuery>);

    jest.mocked(useMutation).mockReturnValue([
      jest.fn(), 
      { loading: false }
    ] as unknown as ReturnType<typeof useMutation>);
  });

  it("инициализируется начальными данными пользователя", () => {
    const { result } = renderHook(() => useProfileFormLogic(mockUser, false));

    expect(result.current.firstName).toBe("John");
    expect(result.current.lastName).toBe("Doe");
    expect(result.current.department).toBe("IT");
    expect(result.current.isDirty).toBe(false); 
  });

  it("меняет флаг isDirty на true при изменении данных", () => {
    const { result } = renderHook(() => useProfileFormLogic(mockUser, false));

    act(() => {
      result.current.setFirstName("Jane");
    });

    expect(result.current.firstName).toBe("Jane");
    expect(result.current.isDirty).toBe(true); 
  });

  it("возвращает isDirty = false, если вернуть данные к исходным", () => {
    const { result } = renderHook(() => useProfileFormLogic(mockUser, false));

    act(() => {
      result.current.setFirstName("Jane"); 
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.setFirstName("John"); 
    });
    expect(result.current.isDirty).toBe(false);
  });
});