import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider as BaseMockedProvider } from "@apollo/client/testing/react";
import { ReactNode, FC } from "react";
import AuthForm from "./AuthForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import toast from "react-hot-toast";
import { ROUTES } from "@/app/configs/routesConfig";
import { 
  LOGIN_QUERY, 
  REGISTER_MUTATION, 
  FORGOT_PASSWORD_MUTATION, 
  RESET_PASSWORD_MUTATION 
} from "@/features/auth/graphql";

interface MockedProviderProps {
  mocks?: ReadonlyArray<unknown>;
  addTypename?: boolean;
  children: ReactNode;
}

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/store/useUserStore", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockPush = jest.fn();
const mockSetLogin = jest.fn();
const MockedProvider = BaseMockedProvider as unknown as FC<MockedProviderProps>;

const registerSuccessMock = {
  request: {
    query: REGISTER_MUTATION,
    variables: { auth: { email: "new@mail.com", password: "password123" } },
  },
  result: {
    data: {
      signup: {
        access_token: "fake-jwt-token",
        user: { id: "2", email: "new@mail.com" },
      },
    },
  },
};

const loginSuccessMock = {
  request: {
    query: LOGIN_QUERY,
    variables: { auth: { email: "test@mail.com", password: "password123" } },
  },
  result: {
    data: {
      login: {
        access_token: "fake-jwt-token",
        user: { id: "1", email: "test@mail.com" },
      },
    },
  },
};

const forgotPasswordErrorMock = {
  request: {
    query: FORGOT_PASSWORD_MUTATION,
    variables: { auth: { email: "broken@mail.com" } },
  },
  error: new Error("Failed to send email"),
};

const resetPasswordSuccessMock = {
  request: {
    query: RESET_PASSWORD_MUTATION,
    variables: { auth: { newPassword: "new-password123" } },
  },
  result: {
    data: {
      resetPassword: true,
    },
  },
};

describe("Компонент AuthForm", () => {
  let cookieSetterSpy: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "fake-token" });
    (useUserStore as unknown as jest.Mock).mockReturnValue({ setLogin: mockSetLogin });

    cookieSetterSpy = jest.fn();
    Object.defineProperty(document, "cookie", {
      set: cookieSetterSpy,
      configurable: true,
    });
  });

  it("должен правильно рендерить поля для режима LOGIN", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthForm mode="login" />
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("должен скрывать поле пароля в режиме RESET", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthForm mode="reset" />
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Password")).toBeNull();
  });

  it("должен успешно авторизовать пользователя и сделать редирект", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[loginSuccessMock]} addTypename={false}>
        <AuthForm mode="login" />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /log in/i });

    await user.type(emailInput, "test@mail.com");
    await user.type(passwordInput, "password123");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetLogin).toHaveBeenCalledWith({ id: "1", email: "test@mail.com" });
      expect(cookieSetterSpy).toHaveBeenCalledWith("auth_token=fake-jwt-token; path=/; max-age=86400");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("должен успешно зарегистрировать пользователя и показать уведомление", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[registerSuccessMock]} addTypename={false}>
        <AuthForm mode="register" />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButtons = screen.getAllByRole("button");
    const submitButton = submitButtons[0];

    await user.type(emailInput, "new@mail.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Registration was successful! You can now log in.", expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith(ROUTES.LOGIN);
    });
  });

  it("должен поймать ошибку 'Failed to send email' при сбросе пароля", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[forgotPasswordErrorMock]} addTypename={false}>
        <AuthForm mode="reset" />
      </MockedProvider>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButtons = screen.getAllByRole("button");
    const submitButton = submitButtons[0];

    await user.type(emailInput, "broken@mail.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to send email/i)).toBeInTheDocument();
    });
  });

  it("должен успешно отправить новый пароль и сделать редирект", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[resetPasswordSuccessMock]} addTypename={false}>
        <AuthForm mode="new_password" />
      </MockedProvider>
    );

    const newPasswordInput = screen.getByPlaceholderText("New password");
    const submitButtons = screen.getAllByRole("button");
    const submitButton = submitButtons[0];

    await user.type(newPasswordInput, "new-password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Your password has been successfully changed! You can log in with your new password.");
      expect(mockPush).toHaveBeenCalledWith(ROUTES.LOGIN);
    });
  });

  it("должен показать ошибку, если нет токена в режиме NEW_PASSWORD", async () => {
    const user = userEvent.setup();
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => null });

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <AuthForm mode="new_password" />
      </MockedProvider>
    );

    const newPasswordInput = screen.getByPlaceholderText("New password");
    const submitButtons = screen.getAllByRole("button");
    const submitButton = submitButtons[0];

    await user.type(newPasswordInput, "new-password123");
    await user.click(submitButton);

    expect(
      screen.getByText("Recovery token not found. Please follow the link in the email.")
    ).toBeInTheDocument();
  });
});