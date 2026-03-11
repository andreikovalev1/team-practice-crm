import { render, screen } from "@testing-library/react"
import Breadcrumbs from "./Breadcrumbs"

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))

jest.mock("@/features/profile/useIsOwnProfile", () => ({
  useIsOwnProfile: jest.fn(),
}))

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
}))


describe("Breadcrumbs", () => {
  const { usePathname } = require("next/navigation")
  const { useIsOwnProfile } = require("@/features/profile/useIsOwnProfile")
  const { useQuery } = require("@apollo/client/react")

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("рендерит Employees по умолчанию", () => {
    usePathname.mockReturnValue("/")
    useIsOwnProfile.mockReturnValue({
      user: null,
      profileUserId: null,
      isOwnProfile: false,
    })
    useQuery.mockReturnValue({
      data: null,
    })

    render(<Breadcrumbs />)
    expect(screen.getByText("Employees")).toBeInTheDocument()
  })

  it("добавляет имя профиля если это профиль пользователя", () => {
    usePathname.mockReturnValue("/users/1/profile")
    useIsOwnProfile.mockReturnValue({
      user: null,
      profileUserId: "1",
      isOwnProfile: false,
    })
    useQuery.mockReturnValue({
      data: {
        user: {
          profile: {
            first_name: "Valeria",
            last_name: "Kovalenko",
          },
        },
      },
    })

    render(<Breadcrumbs />)
    expect(screen.getByText("Employees")).toBeInTheDocument()
    expect(screen.getByText("Valeria Kovalenko")).toBeInTheDocument()
  })

  it("рендерит skills вместо Employess", () => {
    usePathname.mockReturnValue("/users/1/skills")

    useIsOwnProfile.mockReturnValue({
      user: {
        profile: {
          first_name: "Valeria",
          last_name: "Kovalenko",
        },
      },
      profileUserId: "1",
      isOwnProfile: true,
    })

    useQuery.mockReturnValue({
      data: null,
    })

    render(<Breadcrumbs />)
    expect(screen.getByText("Skills")).toBeInTheDocument()
    expect(screen.queryByText("Employees")).not.toBeInTheDocument()
    expect(screen.queryByText("Valeria Kovalenko")).not.toBeInTheDocument()
  })

  it("рендерит Languages вместо Employess", () => {
    usePathname.mockReturnValue("/users/1/languages")

    useIsOwnProfile.mockReturnValue({
      user: {
        profile: {
          first_name: "Valeria",
          last_name: "Kovalenko",
        },
      },
      profileUserId: "1",
      isOwnProfile: true,
    })

    useQuery.mockReturnValue({
      data: null,
    })

    render(<Breadcrumbs />)
    expect(screen.getByText("Languages")).toBeInTheDocument()
    expect(screen.queryByText("Employees")).not.toBeInTheDocument()
    expect(screen.queryByText("Valeria Kovalenko")).not.toBeInTheDocument()
  })

  it("рендерит CVs вместо Employess", () => {
    usePathname.mockReturnValue("/cvs")

    useIsOwnProfile.mockReturnValue({
      user: {
        profile: {
          first_name: "Valeria",
          last_name: "Kovalenko",
        },
      },
      profileUserId: "1",
      isOwnProfile: true,
    })

    useQuery.mockReturnValue({
      data: null,
    })

    render(<Breadcrumbs />)
    expect(screen.getByText("CVs")).toBeInTheDocument()
    expect(screen.queryByText("Employees")).not.toBeInTheDocument()
    expect(screen.queryByText("Valeria Kovalenko")).not.toBeInTheDocument()
  })
})