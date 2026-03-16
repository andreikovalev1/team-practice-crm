import { renderHook } from "@testing-library/react";
import { useIsOwnProfile } from "../useIsOwnProfile";
import { useUserStore } from "@/store/useUserStore";
import { useParams } from "next/navigation";

jest.mock("@/store/useUserStore");
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

describe("useIsOwnProfile", () => {
  const mockUser = { id: "123", email: "test@test.com" };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен возвращать isOwnProfile = true, если нет параметра userId (свой профиль)", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({ user: mockUser });
    (useParams as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useIsOwnProfile());
    expect(result.current.isOwnProfile).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it("должен возвращать isOwnProfile = true, если параметр userId совпадает с user.id", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({ user: mockUser });
    (useParams as jest.Mock).mockReturnValue({ userId: "123" });
    const { result } = renderHook(() => useIsOwnProfile());
    expect(result.current.isOwnProfile).toBe(true);
  });

  it("должен возвращать isOwnProfile = false, если параметр userId другой (чужой профиль)", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({ user: mockUser });
    (useParams as jest.Mock).mockReturnValue({ userId: "999" });
    const { result } = renderHook(() => useIsOwnProfile());
    expect(result.current.isOwnProfile).toBe(false);
  });

  it("должен возвращать isOwnProfile = false, если пользователь не авторизован", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({ user: null });
    (useParams as jest.Mock).mockReturnValue({ userId: "123" });
    const { result } = renderHook(() => useIsOwnProfile());
    expect(result.current.isOwnProfile).toBe(false);
  });
});