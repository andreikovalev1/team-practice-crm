import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Layout from "./layout";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe("Компонент Auth Layout", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("должен показывать табы и рендерить детей на странице ЛОГИНА", () => {
    (usePathname as jest.Mock).mockReturnValue(ROUTES.LOGIN);
    render(
      <Layout>
        <div data-testid="child-content">Контент формы</div>
      </Layout>
    );
    expect(screen.getByRole("tab", { name: /войти/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /создать/i })).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("должен СКРЫВАТЬ табы на странице СБРОСА ПАРОЛЯ", () => {
    (usePathname as jest.Mock).mockReturnValue(ROUTES.RESET);
    render(
      <Layout>
        <div data-testid="child-content">Контент формы сброса</div>
      </Layout>
    );
    expect(screen.queryByRole("tab", { name: /войти/i })).toBeNull();
    expect(screen.queryByRole("tab", { name: /создать/i })).toBeNull();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("должен вызывать router.push при клике на таб", async () => {
    const user = userEvent.setup();
    (usePathname as jest.Mock).mockReturnValue(ROUTES.LOGIN);
    render(<Layout>Контент</Layout>);
    const registerTab = screen.getByRole("tab", { name: /создать/i });
    
    await user.click(registerTab);
    
    expect(mockPush).toHaveBeenCalledWith(ROUTES.REGISTER);
  });
});