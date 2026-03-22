import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { ROUTES } from "@/app/configs/routesConfig";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/useUserStore", () => ({
  useUserStore: jest.fn(),
}));

describe("Компонент LogoutButton", () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();
  let cookieSetterSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useUserStore as unknown as jest.Mock).mockReturnValue({ logout: mockLogout });
    cookieSetterSpy = jest.fn();
    Object.defineProperty(document, "cookie", {
      set: cookieSetterSpy,
      configurable: true,
    });
  });

  it("должен корректно рендерить кнопку", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: /log out/i });
    expect(button).toBeInTheDocument();
  });

  it("должен вызывать logout, очищать куки и делать редирект при клике", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(button);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(cookieSetterSpy).toHaveBeenCalledWith("auth_token=; path=/; max-age=0");
    expect(mockPush).toHaveBeenCalledWith(ROUTES.LOGIN);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
});