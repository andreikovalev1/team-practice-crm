import { render, screen, waitFor } from "@testing-library/react"
import EmployeeTable from "./EmployeeTable"
import { User } from "@/types/user.types"
import { ROUTES } from "@/app/configs/routesConfig"
import userEvent from "@testing-library/user-event"
import { useSearchStore } from "@/store/useSearchStore"

jest.mock("@/store/useSearchStore")
const mockedUseSearchStore = useSearchStore as unknown as jest.Mock;

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  )
}))

const employees: User[] = [
  {
    id: "1",
    email: "Val@test.ru",
    created_at: "",
    department_name: "React",
    position_name: "Software Engineer",
    role: "Employee",
    profile: {
      first_name: "Valeria",
      last_name: "Corleone",
      avatar: ""
    }
  },
  {
    id: "2",
    email: "Andr@test.ru",
    created_at: "",
    department_name: "Angular",
    position_name: "Data Analyst",
    role: "Admin",
    profile: {
      first_name: "Andrey",
      last_name: "Winchester",
      avatar: ""
    }
  }
]

describe("EmployeeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    mockedUseSearchStore.mockImplementation((selector) =>
      selector({
        search: "",
        setSearch: jest.fn(),
      })
    )
  })

  it("Рендерит сотрудников", () => {
    render(<EmployeeTable employees={employees} />)
    expect(screen.getByText("Valeria")).toBeInTheDocument()
    expect(screen.getByText("Andrey")).toBeInTheDocument()
  })

  it("фильтрует по search = 'Val'", () => {
    mockedUseSearchStore.mockImplementation((selector) =>
      selector({
        search: "Val",
        setSearch: jest.fn(),
      })
    )

    render(<EmployeeTable employees={employees} />)
    expect(screen.getByText("Valeria")).toBeInTheDocument()
    expect(screen.queryByText("Andrey")).not.toBeInTheDocument()
  })
  describe("Сортировка", () => {
    const sortCases = [
      { label: "First Name", header: "First Name", expectedTop: "Andrey" },
      { label: "Last Name", header: "Last Name", expectedTop: "Valeria" },
      { label: "Email", header: "Email", expectedTop: "Andr@test.ru" },
      { label: "Department", header: "Department", expectedTop: "Angular" },
      { label: "Position", header: "Position", expectedTop: "Data Analyst" },
    ];

    it.each(sortCases)("сортирует по столбцу $label", async ({ header, expectedTop }) => {
      const user = userEvent.setup();
      render(<EmployeeTable employees={employees} />);
      
      const columnHeader = screen.getByText(header);
      await user.click(columnHeader);

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent(expectedTop);
    });
  });

  it("имеет ссылку на профиль", () => {
    render(<EmployeeTable employees={employees} />)
    const links = screen.getAllByRole("link")
    expect(links[0]).toHaveAttribute("href", ROUTES.PROFILE(employees[0].id))
  })
})