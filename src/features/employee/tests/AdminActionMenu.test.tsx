import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminActionMenu from "../AdminActionMenu";
import type { User } from "@/types/user.types";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

jest.mock("@apollo/client/react", () => ({
  useMutation: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockEmployee: User = {
  id: "1",
  email: "test@test.com",
  profile: { first_name: "John", last_name: "Doe" },
  role: "Employee",
};

describe("AdminActionMenu", () => {
  const mockDeleteUser = jest.fn();
  const mockRouterRefresh = jest.fn();

  beforeEach(() => {
    (useMutation as unknown as jest.Mock).mockReturnValue([mockDeleteUser, { loading: false }]);
    (useRouter as unknown as jest.Mock).mockReturnValue({ refresh: mockRouterRefresh });
  });

  it("открывает меню и отображает опции", async () => {
    const user = userEvent.setup();
    render(<AdminActionMenu employee={mockEmployee} />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(screen.getByText(/user profile/i)).toBeInTheDocument();
    expect(screen.getByText(/update user/i)).toBeInTheDocument();
    expect(screen.getByText(/delete user/i)).toBeInTheDocument();
  });

  it("вызывает удаление при подтверждении", async () => {
    const user = userEvent.setup();
    mockDeleteUser.mockResolvedValue({});
    render(<AdminActionMenu employee={mockEmployee} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText(/delete user/i));
    const confirmDeleteBtn = screen.getByRole("button", { name: /delete/i });
    await user.click(confirmDeleteBtn);
    expect(mockDeleteUser).toHaveBeenCalledWith({ variables: { userId: "1" } });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});