import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateModal from "../UpdateModal";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user.types";

jest.mock("@apollo/client/react");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("react-hot-toast");

const mockUser: User = {
  id: "u1",
  email: "john@example.com",
  role: "Employee",
  department_name: "IT",
  position_name: "Dev",
  profile: { first_name: "John", last_name: "Doe" },
  cvs: [{ id: "cv1" }]
};

describe("UpdateModal", () => {
  const mockClose = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ refresh: jest.fn() });
    (useMutation as unknown as jest.Mock).mockReturnValue([mockUpdateUser, { loading: false }]);
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: { 
        departments: [{ id: "d1", name: "IT" }, { id: "d2", name: "HR" }], 
        positions: [{ id: "p1", name: "Dev" }, { id: "p2", name: "QA" }] 
      },
      loading: false,
    });
  });

  it("кнопка Update заблокирована, если изменений нет", () => {
    render(<UpdateModal isOpen={true} onClose={mockClose} user={mockUser} />);
    const submitBtn = screen.getByRole("button", { name: /update/i });
    expect(submitBtn).toBeDisabled();
  });

  it("активирует кнопку Update при изменении роли", async () => {
    const user = userEvent.setup();
    render(<UpdateModal isOpen={true} onClose={mockClose} user={mockUser} />);
    await user.click(screen.getByText(/employee/i));
    await user.click(screen.getByText(/admin/i));
    const submitBtn = screen.getByRole("button", { name: /update/i });
    expect(submitBtn).not.toBeDisabled();
  });

  it("вызывает мутацию с правильными данными", async () => {
    const user = userEvent.setup();
    mockUpdateUser.mockResolvedValue({ data: { updateUser: {} } });
    render(<UpdateModal isOpen={true} onClose={mockClose} user={mockUser} />);
    await user.click(screen.getByText(/employee/i));
    await user.click(screen.getByText(/admin/i));
    await user.click(screen.getByRole("button", { name: /update/i }));
    expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
      variables: {
        user: {
          userId: "u1",
          role: "Admin",
          departmentId: "d1",
          positionId: "p1",
          cvsIds: ["cv1"]
        }
      }
    }));
  });
});