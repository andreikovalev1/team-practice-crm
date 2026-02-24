import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Layout from "./Layout";
import { useAuthModeStore } from "@/store/useAuthModeStore";

describe("Auth Layout Component (Zustand)", () => {

    beforeEach(() => {
        useAuthModeStore.setState({mode: 'login'})
    })
  
  it("должен по умолчанию отображать форму входа (login)", () => {
    render(<Layout />);
    const loginTab = screen.getByRole("tab", { name: /ВОЙТИ/i });
    expect(loginTab).toHaveAttribute("data-state", "active");
    expect(screen.getByText(/С возвращением/i)).toBeInTheDocument();
  });

  it("должен переключаться на форму регистрации при клике на вкладку СОЗДАТЬ", async () => {
    const user = userEvent.setup();
    render(<Layout />);
    const registerTab = screen.getByRole("tab", { name: /СОЗДАТЬ/i });
    await user.click(registerTab);
    expect(useAuthModeStore.getState().mode).toBe("register");
    await waitFor(() => {
        expect(registerTab).toHaveAttribute("data-state", "active");
    });
    const welcomeText = await screen.findByText(/Зарегистрируйтесь/i);
    expect(welcomeText).toBeInTheDocument();
  });

  it("должен скрывать табы, если выбран режим сброса пароля (reset)", async () => {
    const user = userEvent.setup();
    render(<Layout />);
    const forgotBtn = screen.getByText(/ЗАБЫЛИ ПАРОЛЬ/i);
    await user.click(forgotBtn);
    expect(useAuthModeStore.getState().mode).toBe("reset");
    expect(screen.getByText(/Забыли пароль/i)).toBeInTheDocument();
    const tabsList = screen.queryByRole("tablist");
    expect(tabsList).not.toBeInTheDocument();
  });
});