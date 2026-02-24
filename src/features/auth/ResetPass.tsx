import { Button } from "@/components/ui/button"

// Логика работы кнопки

export default function ResetPass() {
    return (
        <Button variant="auth" className="h-11 uppercase">
            Сбросить пароль
        </Button>
    );
}
