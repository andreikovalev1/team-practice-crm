import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";
import { authContent } from "@/features/auth/config";
import { useAuthModeStore } from "@/store/useAuthModeStore";

describe("AuthForm Component (Zustand)", () => {
  beforeEach(() => {
    useAuthModeStore.setState({ mode: 'login' });
    jest.clearAllMocks();
  });

  it("должен корректно отображать режим логина (login)", () => {
    render(<AuthForm />);
    expect(screen.getByText(authContent.login.title)).toBeInTheDocument();
    expect(screen.getByText(authContent.login.description)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Почта")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
    expect(screen.getByText(authContent.login.feature)).toBeInTheDocument();
  });

  it("должен корректно отображать режим регистрации (register)", () => {
    useAuthModeStore.setState({mode: 'register'});
    render(<AuthForm />);
    expect(screen.getByText(authContent.register.title)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Пароль")).toBeInTheDocument();
  });

  it("должен скрывать поле пароля в режиме сброса (reset)", () => {
    useAuthModeStore.setState({mode: 'reset'});
    render(<AuthForm />);
    expect(screen.getByText(authContent.reset.title)).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Пароль")).not.toBeInTheDocument(); // queryBy вернет null и корректно проверит отсутствие элемента, а getBy вернул бы ошибку
  });

  it("должен вызывать setMode('reset') при клике на 'ЗАБЫЛИ ПАРОЛЬ' в режиме login", () => {
    render(<AuthForm />);
    const forgotBtn = screen.getByText(authContent.login.feature);
    fireEvent.click(forgotBtn);
    expect(useAuthModeStore.getState().mode).toBe("reset");
  });

  it("должен вызывать setMode('login') при клике на доп. кнопку в режиме reset или register", () => {
    useAuthModeStore.setState({mode: 'reset'})
    render(<AuthForm />);
    const cancelBtn = screen.getByText(authContent.reset.feature);
    fireEvent.click(cancelBtn);
    expect(useAuthModeStore.getState().mode).toBe("login");
  });
});