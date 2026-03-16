import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ActionMenu from "./ActionMenu"
import { usePathname } from "next/navigation"

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}))

describe("ActionMenu", () => {
  const mockRenderModal = jest.fn()

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/cvs")
  })

  it("показывает пункт Перейти на CV если путь содержит cvs", async () => {
    render(<ActionMenu row={{ id: "1" }} renderModal={mockRenderModal} />)

    await userEvent.click(screen.getByRole("button"))

    expect(await screen.findByText("Перейти на CV")).toBeInTheDocument()
  })

  it("открывает update modal", async () => {
    render(<ActionMenu row={{ id: "1" }} renderModal={mockRenderModal} />)

    await userEvent.click(screen.getByRole("button"))

    const updateButton = await screen.findByText(/update/i)
    await userEvent.click(updateButton)

    expect(mockRenderModal).toHaveBeenCalled()
  })
})