import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateUserModal from "../CreateUserModal";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

jest.mock("@apollo/client/react");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("react-hot-toast");

describe("CreateUserModal", () => {
  const mockClose = jest.fn();
  const mockRouterRefresh = jest.fn();
  const mockCreateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRouterRefresh });
    (useMutation as unknown as jest.Mock).mockReturnValue([mockCreateUser, { loading: false }]);
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: { departments: [{ id: "d1", name: "IT" }], positions: [{ id: "p1", name: "Dev" }] },
      loading: false,
    });
  });

  it("корректно отправляет форму", async () => {
    const user = userEvent.setup();
    mockCreateUser.mockResolvedValue({ data: { createUser: {} } });
    render(<CreateUserModal isOpen={true} onClose={mockClose} />);
    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.click(screen.getByRole("button", { name: /create/i }));
    expect(mockCreateUser).toHaveBeenCalledWith(expect.objectContaining({
      variables: {
        user: {
          auth: { email: "test@test.com", password: "password123" },
          profile: { first_name: "John", last_name: "Doe" },
          cvsIds: [],
          role: "Employee",
          departmentId: null,
          positionId: null,
        }
      }
    }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("кнопка создания заблокирована, если форма пуста", () => {
    render(<CreateUserModal isOpen={true} onClose={mockClose} />);
    const submitBtn = screen.getByRole("button", { name: /create/i });
    expect(submitBtn).toBeDisabled();
  });
});