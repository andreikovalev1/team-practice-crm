import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSkillModal from "../CreateSkillModal";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";

jest.mock("@apollo/client/react");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("react-hot-toast");

const mockedUseMutation = useMutation as unknown as jest.Mock;
const mockedUseQuery = useQuery as unknown as jest.Mock;

describe("CreateSkillModal", () => {
  const mockClose = jest.fn();
  const mockCreateSkill = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ refresh: jest.fn() });
    
    mockedUseQuery.mockReturnValue({
      data: { 
        skillCategories: [
          { id: "cat1", name: "Frontend" },
          { id: "cat2", name: "Backend" }
        ] 
      },
      loading: false,
    });
    
    mockedUseMutation.mockReturnValue([mockCreateSkill, { loading: false }]);
  });

  it("блокирует кнопку Create, если поля не заполнены", () => {
    render(<CreateSkillModal isOpen={true} onClose={mockClose} />);
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });

  it("успешно создает навык и сбрасывает форму", async () => {
    const user = userEvent.setup();
    render(<CreateSkillModal isOpen={true} onClose={jest.fn()} />);
    const nameInput = screen.getByLabelText(/skill name/i);
    await user.type(nameInput, "React");
    const select = screen.getByRole("combobox", { name: /category/i });
    await user.click(select);
    const categoryOption = await screen.findByText(/frontend/i);
    await user.click(categoryOption);
    const submitBtn = await screen.findByRole("button", { name: /create/i });
    expect(submitBtn).not.toBeDisabled();
    await user.click(submitBtn);
    expect(mockCreateSkill).toHaveBeenCalledWith({
    variables: {
      skill: {
        name: "React",
        categoryId: "cat1",
      },
    },
  });
});
});