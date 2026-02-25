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
    title: "С возвращением",
    description: "Рады вас видеть! Войдите, чтобы продолжить",
    feature: "Забыли пароль",
    btnText: "Войти",
  },
  register: {
    title: "Зарегистрируйтесь",
    description: "Добро пожаловать! Создайте аккаунт, чтобы продолжить",
    feature: "У меня есть аккаунт",
    btnText: "Создать аккаунт",
  },
  reset: {
    title: "Забыли пароль",
    description: "Мы отправим вам письмо с инструкцией",
    feature: "Отмена",
    btnText: "Сбросить пароль",
  },
  new_password: {
    title: "Новый пароль",
    description: "Введите и запомните ваш новый пароль",
    btnText: "Сохранить",
  }
}