import { render } from "@testing-library/react";
import TokenUpdater from "./TokenUpdater";
import { updateAuthCookies } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
  updateAuthCookies: jest.fn(),
}));

describe("TokenUpdater", () => {
  it("должен вызывать updateAuthCookies при изменении пропсов", () => {
    const { rerender } = render(
      <TokenUpdater accessToken="old-token" refreshToken="old-refresh" />
    );
    expect(updateAuthCookies).toHaveBeenCalledWith("old-token", "old-refresh");
    rerender(<TokenUpdater accessToken="new-token" refreshToken="new-refresh" />);
    expect(updateAuthCookies).toHaveBeenCalledWith("new-token", "new-refresh");
  });
});