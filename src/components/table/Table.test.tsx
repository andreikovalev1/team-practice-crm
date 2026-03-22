import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";
import { useAdmin } from "@/lib/useAdmin";
import { usePathname } from "next/navigation";

jest.mock("@/lib/useAdmin");
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockData = [
  { id: "1", name: "Alpha", description: "First" },
  { id: "2", name: "Beta", description: "Second" },
];

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: false },
];

describe("Table Component", () => {
  beforeEach(() => {
    (useAdmin as jest.Mock).mockReturnValue(false);
    (usePathname as jest.Mock).mockReturnValue("/cvs");
  });

  it("рендерит данные корректно", () => {
    render(<Table data={mockData} columns={columns} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("сортирует данные при клике на заголовок", () => {
    render(<Table data={mockData} columns={columns} />);
    fireEvent.click(screen.getByText("Name"));  
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alpha");
    expect(rows[2]).toHaveTextContent("Beta");
  });

  it("показывает 'No data', если список пуст", () => {
    render(<Table data={[]} columns={columns} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("скрывает кнопку действий (actions) для не-админов, если это не /cvs", () => {
    (usePathname as jest.Mock).mockReturnValue("/some-other-path");
    render(<Table data={mockData} columns={columns} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});