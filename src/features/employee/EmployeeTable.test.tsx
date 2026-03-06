import { render, screen, waitFor } from "@testing-library/react"
import EmployeeTable from "./EmployeeTable"
import { User } from "@/types/user.types"
import { ROUTES } from "@/app/configs/routesConfig"
import userEvent from "@testing-library/user-event"

jest.mock("@/store/useSearchStore", () => ({
  useSearchStore: jest.fn(),
}))

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
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
    position_name: "Software Engineer",
    profile: {
      first_name: "Andrey",
      last_name: "Winchester",
      avatar: ""
    }
  }
]


describe("EmployeeTable", () => {

  const { useSearchStore } = require("@/store/useSearchStore")
  beforeEach(() => {
    jest.clearAllMocks()

    useSearchStore.mockImplementation((selector: any) =>
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
      useSearchStore.mockImplementation((selector: any) =>
        selector({
          search: "Val",
          setSearch: jest.fn(),
        })
      )

      render(<EmployeeTable employees={employees} />)
      expect(screen.getByText("Valeria")).toBeInTheDocument()
      expect(screen.queryByText("Andrey")).not.toBeInTheDocument()
    })

    it("сортирует при клике на department", async () => {
      const user = userEvent.setup()
      render(<EmployeeTable employees={employees} />)
      const departmentHeader = screen.getByText("Department")
      await user.click(departmentHeader)
      await waitFor(() => {
        const rows = screen.getAllByRole("row")
        expect(rows[1]).toHaveTextContent("Andrey")
        expect(rows[2]).toHaveTextContent("Valeria")
      })
    })

    it("имеет ссылку на профиль", () => {
      render(<EmployeeTable employees={employees} />)
      const links = screen.getAllByRole("link")
      expect(links[0]).toHaveAttribute("href", ROUTES.PROFILE(employees[0].id))
    })
})