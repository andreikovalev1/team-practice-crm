import { render, screen } from "@testing-library/react";
import OvalButton from "./OvalButton";

describe("Компонент OvalButton", () => {
    it("должен рендерить кнопку с правильным текстом", () => {
        render(<OvalButton text="Testing button" />);
        const button = screen.getByRole("button", { name: /testing button/i });
        expect(button).toBeInTheDocument();
    });

    it("должег иметь тип submit для корректной работы в формах", () => {
        render(<OvalButton text="Submit" />);
        const button = screen.getByRole("button", { name: /submit/i });
        expect(button).toHaveAttribute("type", "submit");
    });
})