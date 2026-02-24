import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "./Register";

describe("Feature: Register", () => {
  it("должен отображать кнопку создания аккаунта с правильным текстом", () => {
    render(<Register />);
    const button = screen.getByRole("button", { name: /СОЗДАТЬ АККАУНТ/i });
    expect(button).toBeInTheDocument();
  });

  it("имитирует клик по кнопке регистрации", async () => {
    const user = userEvent.setup();
    const handleRegister = jest.fn(); 
    render(<div onClick={handleRegister}><Register /></div>); // Оборачиваем Register в div, чтобы проверить всплывает ли событие к родителю(здесь к div)
    const button = screen.getByRole("button", { name: /СОЗДАТЬ АККАУНТ/i });
    await user.click(button);
    expect(handleRegister).toHaveBeenCalledTimes(1);
  });
});