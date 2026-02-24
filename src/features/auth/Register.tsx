import { Button } from "@/components/ui/button"

// Логика работы кнопки

export default function Register() {
    return (
        <Button type="submit" variant="auth" className="h-11 uppercase">
            Создать аккаунт
        </Button>
    );
}
