interface Modes {
  title: string
  description: string
  feature?: string
  btnText: string
}

export type AuthMode = "login" | "register" | "reset" | "new_password"

type AuthContent = Record<AuthMode, Modes>

export const authContent: AuthContent = {
  login: {
    title: "Welcome back",
    description: "Hello again! Log in to continue",
    feature: "Forgot password",
    btnText: "Log in",
  },
  register: {
    title: "Register now",
    description: "Welcome! Sign up to continue",
    feature: "I have an account",
    btnText: "Create account",
  },
  reset: {
    title: "Forgot password",
    description: "We will sent you an email with further instructions",
    feature: "Cancel",
    btnText: "Reset password",
  },
  new_password: {
    title: "New password",
    description: "Enter and remember your new password",
    btnText: "Save",
  }
}