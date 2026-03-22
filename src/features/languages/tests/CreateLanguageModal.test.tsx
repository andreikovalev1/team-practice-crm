import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateGlobalLanguageModal from "../CreateLanguageModal";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

jest.mock("@apollo/client/react");
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("react-hot-toast");

const mockedUseMutation = useMutation as unknown as jest.Mock;

describe("CreateLanguageModal", () => {
  const mockClose = jest.fn();
  const mockCreateLanguage = jest.fn();
  const mockRouterRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRouterRefresh });
    mockedUseMutation.mockReturnValue([mockCreateLanguage, { loading: false }]);
  });

  it("кнопка Create заблокирована, если обязательные поля пусты", () => {
    render(<CreateGlobalLanguageModal isOpen={true} onClose={mockClose} />);
    const submitBtn = screen.getByRole("button", { name: /create/i });
    expect(submitBtn).toBeDisabled();
  });

  it("вызывает мутацию при правильном заполнении формы", async () => {
    const user = userEvent.setup();
    mockCreateLanguage.mockResolvedValue({ data: { createLanguage: {} } });
    render(<CreateGlobalLanguageModal isOpen={true} onClose={mockClose} />);
    await user.type(screen.getByLabelText(/language name/i), "English");
    await user.type(screen.getByLabelText(/iso2 code/i), "en");
    const submitBtn = screen.getByRole("button", { name: /create/i });
    expect(submitBtn).not.toBeDisabled();
    await user.click(submitBtn);
    expect(mockCreateLanguage).toHaveBeenCalledWith({
      variables: {
        language: {
          name: "English",
          native_name: "",
          iso2: "en",
        }
      }
    });
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });
});