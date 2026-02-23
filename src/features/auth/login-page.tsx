'use client'; // Если нужны формы и клики

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LoginPage = () => {
  const handleLogin = () => {
    // Твоя логика авторизации
    console.log("Входим...");
  };

  return (
    <section className="p-10">
      <h1>Вход в систему</h1>
      <Input placeholder="Email" />
      <Button onClick={handleLogin}>Войти</Button>
    </section>
  );
};