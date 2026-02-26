import { render, screen } from "@testing-library/react";
import OvalButton from "./OvalButton";

describe("Компонент OvalButton", () => {
    it("должен рендерить кнопку с правильным текстом", () => {
        render(<OvalButton text="Тестовая кнопка" />);
        const button = screen.getByRole("button", { name: /тестовая кнопка/i });
        expect(button).toBeInTheDocument();
    });

    it("должег иметь тип submit для корректной работы в формах", () => {
        render(<OvalButton text="Отправить" />);
        const button = screen.getByRole("button", { name: /отправить/i });
        expect(button).toHaveAttribute("type", "submit");
    });
})