import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPass from "./ResetPass";

describe("Feature: ResetPass", () => {
  it("должен отображать кнопку сброса пароля с корректным текстом", () => {
    render(<ResetPass />);
    const button = screen.getByRole("button", { name: /СБРОСИТЬ ПАРОЛЬ/i });
    expect(button).toBeInTheDocument();
  });

  it("должен срабатывать при клике (проверка всплытия события)", async () => {
    const user = userEvent.setup();
    const onResetClick = jest.fn();
    render(
      <div onClick={onResetClick}>
        <ResetPass />
      </div>
    );
    const button = screen.getByRole("button", { name: /СБРОСИТЬ ПАРОЛЬ/i });
    await user.click(button);
    expect(onResetClick).toHaveBeenCalledTimes(1);
  });
});