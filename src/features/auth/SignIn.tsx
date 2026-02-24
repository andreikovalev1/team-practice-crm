import { Button } from "@/components/ui/button"

// Логика работы кнопки

export default function SignIn() {
    return (
        <Button type="submit" variant="auth" className="h-11 uppercase">
            Войти
        </Button>
    );
}
