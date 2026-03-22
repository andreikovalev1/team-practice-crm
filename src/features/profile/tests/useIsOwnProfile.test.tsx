import { renderHook, waitFor } from "@testing-library/react";
import { useIsOwnProfile } from "../useIsOwnProfile";
import { useUserStore } from "@/store/useUserStore";
import { useParams } from "next/navigation";

jest.mock("@/store/useUserStore");
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

const mockedUseUserStore = useUserStore as jest.MockedFunction<typeof useUserStore>;
const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;

describe("useIsOwnProfile", () => {
  const mockUser = { id: "123", email: "test@test.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен возвращать isOwnProfile = true, если нет параметра userId (свой профиль)", async () => {
    mockedUseUserStore.mockReturnValue({ user: mockUser });
    mockedUseParams.mockReturnValue({});

    const { result } = renderHook(() => useIsOwnProfile());

    expect(result.current.isOwnProfile).toBe(false);

    await waitFor(() => {
      expect(result.current.isOwnProfile).toBe(true);
    });
    
    expect(result.current.user).toEqual(mockUser);
  });

  it("должен возвращать isOwnProfile = true, если параметр userId совпадает с user.id", async () => {
    mockedUseUserStore.mockReturnValue({ user: mockUser });
    mockedUseParams.mockReturnValue({ userId: "123" });

    const { result } = renderHook(() => useIsOwnProfile());

    await waitFor(() => {
      expect(result.current.isOwnProfile).toBe(true);
    });
  });

  it("должен возвращать isOwnProfile = true, если передан explicitOwnerId, совпадающий с user.id", async () => {
    mockedUseUserStore.mockReturnValue({ user: mockUser });
    mockedUseParams.mockReturnValue({ userId: "999" });

    const { result } = renderHook(() => useIsOwnProfile("123"));

    await waitFor(() => {
      expect(result.current.isOwnProfile).toBe(true);
    });
  });

  it("должен возвращать isOwnProfile = false, если параметр userId другой (чужой профиль)", async () => {
    mockedUseUserStore.mockReturnValue({ user: mockUser });
    mockedUseParams.mockReturnValue({ userId: "999" });

    const { result } = renderHook(() => useIsOwnProfile());

    await waitFor(() => {
      expect(result.current.isOwnProfile).toBe(false);
    });
  });

  it("должен возвращать isOwnProfile = false, если пользователь не авторизован", async () => {
    mockedUseUserStore.mockReturnValue({ user: null });
    mockedUseParams.mockReturnValue({ userId: "123" });

    const { result } = renderHook(() => useIsOwnProfile());

    await waitFor(() => {
      expect(result.current.isOwnProfile).toBe(false);
    });
  });
});