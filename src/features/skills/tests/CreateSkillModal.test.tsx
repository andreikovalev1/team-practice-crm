import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateSkillModal from "../CreateSkillModal";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// 1. Мокаем все хуки и библиотеки
jest.mock("@apollo/client/react");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

// 2. ПРАВИЛЬНЫЙ мок для тостов, чтобы toast.loading не ломал тест
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    loading: jest.fn(() => "mock-toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

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
    
    // Мутация возвращает функцию вызова и стейт загрузки
    mockedUseMutation.mockReturnValue([mockCreateSkill, { loading: false }]);
  });

  it("блокирует кнопку Create, если поля не заполнены", () => {
    render(<CreateSkillModal isOpen={true} onClose={mockClose} />);
    // Ищем кнопку по точному тексту, так как компонент OvalButton может рендериться по-разному
    expect(screen.getByRole("button", { name: "Create" })).toBeDisabled();
  });

  it("успешно создает навык и сбрасывает форму", async () => {
    const user = userEvent.setup();
    render(<CreateSkillModal isOpen={true} onClose={mockClose} />);
    
    // 3. Вводим название скилла
    const nameInput = screen.getByLabelText(/skill name/i);
    await user.type(nameInput, "React");
    
    // 4. Ищем кастомный селект по тексту лейбла (а не по роли combobox)
    const selectTrigger = screen.getByText("Placeholder");
    await user.click(selectTrigger);
    
    // 5. Выбираем опцию
    const categoryOption = await screen.findByText("Frontend");
    await user.click(categoryOption);
    
    // 6. Жмем кнопку сабмита
    const submitBtn = screen.getByRole("button", { name: "Create" });
    expect(submitBtn).not.toBeDisabled(); // Кнопка должна разблокироваться
    await user.click(submitBtn);
    
    // 7. Оборачиваем проверку в waitFor, так как handleSubmit асинхронный
    await waitFor(() => {
      expect(mockCreateSkill).toHaveBeenCalledWith({
        variables: {
          skill: {
            name: "React",
            categoryId: "cat1", // Проверяем, что подставился правильный ID, а не имя
          },
        },
      });
    });

    // Опционально: можно проверить, что модалка закрылась
    expect(mockClose).toHaveBeenCalled();
  });
});