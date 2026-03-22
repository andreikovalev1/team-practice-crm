import { renderHook } from "@testing-library/react";
import { useProfileUser } from "../useProfileUser";
import { useIsOwnProfile } from "../useIsOwnProfile";
import { useQuery } from "@apollo/client/react";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
}));
jest.mock("../useIsOwnProfile");

describe("useProfileUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("делает GraphQL-запрос и возвращает чужого юзера, если профиль чужой", () => {
    const mockOtherUser = { id: "999", email: "other@test.com", role: "employee" };

    (useIsOwnProfile as jest.Mock).mockReturnValue({
      user: { id: "123", role: "admin" },
      profileUserId: "999",
      isOwnProfile: false,
    });

    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: { user: mockOtherUser },
      loading: false,
    });
    const { result } = renderHook(() => useProfileUser());

    expect(result.current.loading).toBe(false);
    expect(result.current.profileUser).toEqual(mockOtherUser);
  });
});