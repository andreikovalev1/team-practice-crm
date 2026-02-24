'use client'

import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import SignIn from "@/features/auth/SignIn";
import Register from "@/features/auth/Register";
import ResetPass from "@/features/auth/ResetPass";
import { authContent } from "@/features/auth/config";
import { useAuthModeStore } from "@/store/useAuthModeStore";
import { motion, AnimatePresence } from "framer-motion";
import { LOGIN_QUERY, REGISTER_MUTATION } from "@/features/auth/graphql"
import { useUserStore } from "@/store/useUserStore";

// 1. Описываем структуру ответов от бэкенда для TypeScript
interface LoginData {
  login: {
    access_token: string;
    user: { email: string };
  };
}

interface RegisterData {
  signup: {
    access_token: string;
    user: { email: string };
  };
}

export default function AuthForm() {
    const router = useRouter()
    const { setLogin } = useUserStore()
    const { mode, setMode } = useAuthModeStore()
    const { title, description, feature } = authContent[mode]

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // 2. Добавляем типы <LoginData> и <RegisterData> и убираем неиспользуемые loading
    const [loginQuery] = useLazyQuery<LoginData>(LOGIN_QUERY)
    const [registerMutation] = useMutation<RegisterData>(REGISTER_MUTATION)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMessage("") 

      try {
        if (mode === "login") {
          const { data, error } = await loginQuery({
            variables: { auth: { email, password } },
          })

          if (error) throw error 

          if (data?.login) {
            const { access_token, user } = data.login

            console.log("ТОКЕН ПРИ ЛОГИНЕ:", access_token);
            
            setLogin(user.email)
            document.cookie = `auth_token=${access_token}; path=/; max-age=86400`
            router.push("/") 
          }
        } else if (mode === "register") {
          const { data, error } = await registerMutation({
            variables: { auth: { email, password } },
          })

          if (error) throw error

          if (data?.signup) {
            setPassword("")
            setMode("login")
          }
        }
      } catch (err) { // 3. Убираем any
        console.error("Ошибка формы:", err)

        // Подсказываем TypeScript структуру нашей возможной ошибки
        const error = err as {
          graphQLErrors?: Array<{ message: string }>;
          networkError?: Error;
          message?: string;
        };

        if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
          setErrorMessage(error.graphQLErrors[0].message)
        } 
        else if (error?.networkError) {
          setErrorMessage("Проблема с сетью. Проверьте подключение или бэкенд.")
        } 
        else if (error?.message) {
          setErrorMessage(error.message)
        } 
        else {
          setErrorMessage("Произошла неизвестная ошибка. Попробуйте позже.")
        }
      }
    }

    return (
      <div className="flex items-center justify-center w-full px-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-140">

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >

              <p className="text-4xl mb-7">{title}</p>
              <p className="mb-7">{description}</p>

              {errorMessage && (
                <div className="w-full p-3 mb-5 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {errorMessage}
                </div>
              )}

              <Input 
                placeholder="Почта" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-none border border-gray-300 mb-5" 
              />
              
              {mode !== "reset" && (
                <Input 
                  type="password" 
                  placeholder="Пароль" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border border-gray-300 mb-10" 
                />
              )}
              
              <div className="mb-5">
                {mode === "login" && <SignIn />}
                {mode === "register" && <Register />}
                {mode === "reset" && <ResetPass />}
              </div>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("")
                    setMode(mode === "login" ? "reset" : "login")
                  }}
                  className="text-gray-500 cursor-pointer"
                >
                  {feature}
                </button>

              </motion.div>
            </AnimatePresence>

        </form>
      </div>
    );
}