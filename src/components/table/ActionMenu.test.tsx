import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ActionMenu from "./ActionMenu"

jest.mock("lucide-react", () => ({
  MoreVertical: () => <div data-testid="more-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
}));

describe("ActionMenu Component", () => {
  const mockRow = { id: "1", name: "Test Project" };
  const mockRenderModal = jest.fn((row, close, action) => (
    <div data-testid="modal">
      {action} modal for {row.name}
      <button onClick={close}>Close</button>
    </div>
  ));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерит триггер меню (кнопку с иконкой)", () => {
    render(<ActionMenu row={mockRow} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("открывает выпадающий список при клике на триггер", async () => {
    const user = userEvent.setup();
    render(<ActionMenu row={mockRow} entityName="Project" />);

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText(/Update Project/i)).toBeInTheDocument();
    expect(await screen.findByText(/Delete Project/i)).toBeInTheDocument();
  });

  it("вызывает renderModal с параметром 'update' при клике на Update", async () => {
    const user = userEvent.setup();
    render(<ActionMenu row={mockRow} entityName="Project" renderModal={mockRenderModal} />);

    await user.click(screen.getByRole("button"));
    const updateItem = await screen.findByText(/Update Project/i);
    await user.click(updateItem);

    expect(mockRenderModal).toHaveBeenCalledWith(mockRow, expect.any(Function), "update");
    expect(screen.getByTestId("modal")).toHaveTextContent("update modal for Test Project");
  });

  it("вызывает renderModal с параметром 'delete' при клике на Delete", async () => {
    const user = userEvent.setup();
    render(<ActionMenu row={mockRow} entityName="Project" renderModal={mockRenderModal} />);

    await user.click(screen.getByRole("button"));
    const deleteItem = await screen.findByText(/Delete Project/i);
    await user.click(deleteItem);

    expect(mockRenderModal).toHaveBeenCalledWith(mockRow, expect.any(Function), "delete");
    expect(screen.getByTestId("modal")).toHaveTextContent("delete modal for Test Project");
  });

  it("закрывает модалку при вызове функции close", async () => {
    const user = userEvent.setup();
    render(<ActionMenu row={mockRow} renderModal={mockRenderModal} />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText(/Update Item/i));
    
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    await user.click(screen.getByText("Close"));

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});