import { Input } from "@/components/ui/input"

export default function AuthForm({ type = 'login' }) {
    return (
      <>
        <form>
            <h2>Привет</h2>
            <p>Текст</p>
            <Input></Input>
            <Input></Input>
        </form>
      </>
    );
}
