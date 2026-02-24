import { Input } from "@/components/ui/input"
import SignIn from "@/features/auth/SignIn";
import Register from "@/features/auth/Register";
import ResetPass from "@/features/auth/ResetPass";
import { authContent } from "@/features/auth/config";
import { useAuthModeStore } from "@/store/useAuthModeStore"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthForm() {
    const { mode, setMode } = useAuthModeStore()
    const { title, description, feature } = authContent[mode]

    return (
      <div className="flex items-center justify-center w-full px-4">
        <form className="flex flex-col items-center w-full max-w-140">

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center"
            >

              <p className="text-4xl mb-7">{title}</p>
              <p className="mb-7">{description}</p>

              <Input placeholder="Почта" type='text' className="rounded-none border border-gray-300 mb-5"></Input>
              {mode !== "reset" && <Input type='password' placeholder="Пароль" className="rounded-none border border-gray-300 mb-10"></Input>}
              
              <div className="mb-5">
                {mode === "login" && <SignIn />}
                {mode === "register" && <Register />}
                {mode === "reset" && <ResetPass />}
              </div>

                <button
                  type="button"
                  onClick={() =>
                    mode === "login" ? setMode("reset") : setMode("login")
                  }
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
