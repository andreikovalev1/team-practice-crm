'use client'

import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { authContent } from "@/features/auth/config";
import { motion, AnimatePresence } from "framer-motion";
import { LOGIN_QUERY, REGISTER_MUTATION, FORGOT_PASSWORD_MUTATION, RESET_PASSWORD_MUTATION } from "@/features/auth/graphql"
import { useUserStore } from "@/store/useUserStore";
import { ROUTES } from "@/app/configs/routesConfig"
import toast from "react-hot-toast";
import OvalButton from "@/components/button/OvalButton";

interface AuthProp {
  mode: "login" | "register" | "reset" | "new_password"
}

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

export default function AuthForm({ mode }: AuthProp) {
    const router = useRouter()
    const searchParams = useSearchParams();
    const token = searchParams.get("token")
    const { setLogin } = useUserStore()
    const { title, description, feature, btnText } = authContent[mode]

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [loginQuery] = useLazyQuery<LoginData>(LOGIN_QUERY)
    const [registerMutation] = useMutation<RegisterData>(REGISTER_MUTATION)
    const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD_MUTATION)
    const [resetPasswordMutation] = useMutation(RESET_PASSWORD_MUTATION)

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
            toast.success("Регистрация прошла успешно! Теперь вы можете войти.", {
              duration: 2000,
              className: "animate-in fade-in zoom-in duration-500 all 0.4s ease",
            });
            router.push(ROUTES.LOGIN)
          }
        } else if (mode === "reset") {
          const { error } = await forgotPasswordMutation({
            variables: { auth: { email } },
          })

          if(error) throw error
          setErrorMessage("")
          setEmail("")
          router.push(ROUTES.LOGIN)
        } else if (mode === "new_password") {
          if (!token) {
            setErrorMessage("Токен восстановления не найден. Пожалуйста, перейдите по ссылке из письма.");
            return;
          }

          const { error } = await resetPasswordMutation({
            variables: { auth: { newPassword: password } },
            context: {
              headers: { Authorization: `Bearer ${token}` }
            }
          });

          if (error) throw error;
          toast.success("Пароль успешно изменен! Вы можете войти с новым паролем.");
          router.push(ROUTES.LOGIN);
        }

      } catch (err) {

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
              
              {mode !== "new_password" && (
                <Input 
                  placeholder="Почта" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-none border border-gray-300 mb-5" 
                />
              )}
              
              {mode !== "reset" && (
                <Input 
                  type="password" 
                  placeholder={mode === "new_password" ? "Новый пароль" : "Пароль"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-none border border-gray-300 mb-10" 
                />
              )}
              
              <div className="mb-5">
                <OvalButton text={btnText} />
              </div>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("")
                    router.push(
                      mode === "login"
                        ? ROUTES.RESET
                        : ROUTES.LOGIN
                    )
                  }}
                  className="text-gray-500 cursor-pointer uppercase hover:text-gray-700"
                >
                  {feature}
                </button>

              </motion.div>
            </AnimatePresence>

        </form>
      </div>
    );
}