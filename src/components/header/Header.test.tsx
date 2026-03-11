import { render, screen } from "@testing-library/react"
import Header from "./Header"
import userEvent from "@testing-library/user-event"

jest.mock("@/store/useSearchStore", () => ({
  useSearchStore: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))

jest.mock("@/components/breadcrumbs/Breadcrumbs", () => () => (
  <div data-testid="breadcrumbs">Breadcrumbs</div>
))

jest.mock("@/components/search/SearchInput", () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

describe("Header", () => {
  const { usePathname } = require("next/navigation")
  const { useSearchStore } = require("@/store/useSearchStore")
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("рендерит всегда Breadcrumbs", () => {
    usePathname.mockReturnValue("/")
    useSearchStore.mockImplementation((selector: any) =>
      selector({
        search: "",
        setSearch: jest.fn(),
      })
    )

    render(<Header />)
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument()
  })

  it("показывает SearchInput если pathname = '/'", () => {
    usePathname.mockReturnValue("/")
    const setSearchMock = jest.fn()
    useSearchStore.mockImplementation((selector: any) =>
      selector({
        search: "test",
        setSearch: setSearchMock,
      })
    )

    render(<Header />)
    expect(screen.getByTestId("search-input")).toBeInTheDocument()
  })

  it("показывает SearchInput если pathname содержит cvs", () => {
    usePathname.mockReturnValue("/employees/cvs")
    useSearchStore.mockImplementation((selector: any) =>
      selector({
        search: "",
        setSearch: jest.fn(),
      })
    )

    render(<Header />)
    expect(screen.getByTestId("search-input")).toBeInTheDocument()
  })

  it("НЕ показывает SearchInput если условие false", () => {
    usePathname.mockReturnValue("/employees")
    useSearchStore.mockImplementation((selector: any) =>
      selector({
        search: "",
        setSearch: jest.fn(),
      })
    )

    render(<Header />)
    expect(screen.queryByTestId("search-input")).not.toBeInTheDocument()
  })

  it("вызывает setSearch при вводе", async () => {
    usePathname.mockReturnValue("/")
    const setSearchMock = jest.fn()
    useSearchStore.mockImplementation((selector: any) =>
      selector({
        search: "",
        setSearch: setSearchMock,
      })
    )

    render(<Header />)
    const input = screen.getByTestId("search-input")
    await userEvent.type(input, "hello")
    expect(setSearchMock).toHaveBeenCalled()
  })
})