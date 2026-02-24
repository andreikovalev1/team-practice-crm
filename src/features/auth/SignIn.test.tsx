import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignIn from "./SignIn";

describe("Feature: SignIn", () => {
  it("должен корректно отображать кнопку входа", () => {
    render(<SignIn />);
    const button = screen.getByRole("button", { name: /ВОЙТИ/i });
    expect(button).toBeInTheDocument();
  });

  it("должен быть активным для нажатия", async () => {
    const user = userEvent.setup();
    render(<SignIn />);
    const button = screen.getByRole("button", { name: /ВОЙТИ/i });
    expect(button).not.toBeDisabled();
    await user.click(button);
  });
});