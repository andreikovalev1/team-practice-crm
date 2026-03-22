# Team Practice CRM

Современная CRM-система для управления резюме, проектами и сотрудниками, построенная на базе Next.js с использованием TypeScript и GraphQL.

## Краткая функциональность

**Team Practice CRM** — это полнофункциональная система управления отношениями с клиентами, разработанная для:

- **Управление резюме (CV)**: создание, редактирование, удаление и просмотр резюме с проектами и навыками
- **Управление проектами**: ведение портфолио проектов, привязка к резюме
- **Управление сотрудниками**: администрирование пользователей, ролей и прав доступа
- **Управление справочниками**: ведение списков должностей, отделов, языков и навыков
- **Аутентификация**: система регистрации и входа с восстановлением пароля
- **Интегрированный поиск**: быстрый поиск по всем сущностям
- **Адаптивный интерфейс**: удобная работа на устройствах всех размеров

## Технологический стек

### Core

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/)

### State Management & Data Fetching

- **Global State:** [Zustand](https://docs.pmnd.rs/zustand/) (Client-side state)
- **API Client:** [Apollo Client](https://www.apollographql.com/docs/react/)
- **API Layer:** [GraphQL](https://graphql.org/)

### Infrastructure & Database

- **Containerization:** [Docker Desktop](https://www.docker.com/) (изоляция окружения бэкенда и БД)
- **Database:** [PostgreSQL 16](https://www.postgresql.org/) (хранение данных сущностей: CV, Users, Projects)
- **Database Management:** [pgAdmin 4](https://www.pgadmin.org/) (администрирование и визуализация данных БД)
- **Caching:** [Apollo InMemoryCache](https://www.apollographql.com/docs/react/caching/cache-configuration/) (клиентское кэширование) + **PostgreSQL Shared Buffers** (буферизация данных на уровне БД)

### Quality Assurance

- **Unit Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) (автозапуск тестов при Pull Request)

---

## Список зависимостей

### Основные зависимости

| Пакет                    | Версия   | Назначение                                           |
| ------------------------ | -------- | ---------------------------------------------------- |
| next                     | 16.1.6   | React фреймворк с Server Components                  |
| react                    | 19.2.3   | Библиотека для создания пользовательских интерфейсов |
| react-dom                | 19.2.3   | Привязка React к DOM                                 |
| typescript               | ^5       | Язык программирования с типизацией                   |
| @apollo/client           | ^4.1.6   | GraphQL клиент для управления данными                |
| graphql                  | ^16.13.0 | Язык запросов                                        |
| zustand                  | ^5.0.11  | Управление глобальным состоянием                     |
| tailwindcss              | ^4       | Утилит-ориентированный CSS фреймворк                 |
| shadcn                   | ^3.8.5   | Компоненты пользовательского интерфейса              |
| radix-ui                 | ^1.4.3   | Примитивы для доступного UI                          |
| framer-motion            | ^12.35.2 | Библиотека для анимаций                              |
| react-hot-toast          | ^2.6.0   | Уведомления (toast)                                  |
| react-icons              | ^5.5.0   | Набор иконок                                         |
| lucide-react             | ^0.575.0 | SVG иконки                                           |
| clsx                     | ^2.1.1   | Утилита для объединения CSS классов                  |
| tailwind-merge           | ^3.5.0   | Утилита для слияния Tailwind классов                 |
| class-variance-authority | ^0.7.1   | Создание вариативных компонентов                     |

### Dev зависимости (основные)

- **jest**: ^30.2.0 — фреймворк для модульного тестирования
- **@testing-library/react**: ^16.3.2 — утилиты для тестирования React компонентов
- **@testing-library/jest-dom**: ^6.9.1 — пользовательские Jest матчеры
- **@testing-library/user-event**: ^14.6.1 — имитация пользовательских событий
- **eslint**: ^9 — линтер для проверки качества кода
- **@types/jest**, **@types/node**, **@types/react**, **@types/react-dom** — TypeScript типы

---

## Инструкция по запуску

### Требования

- Node.js версия 18.x или выше
- npm или yarn

### Установка и запуск

1. **Установите зависимости:**

```bash
npm install
```

2. **Создайте файл `.env.local` с переменными окружения:**

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Запустите приложение в режиме разработки:**

```bash
npm run dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

### Другие команды

- `npm run build` — сборка для production
- `npm start` — запуск собранного приложения
- `npm run lint` — проверка кода с помощью ESLint

---

## Инструкция по запуску unit-тестов

### Запуск всех тестов

```bash
npm test
```

### Дополнительные опции

| Команда                        | Описание                                       |
| ------------------------------ | ---------------------------------------------- |
| `npm test -- --watch`          | Запуск тестов в режиме наблюдения (watch mode) |
| `npm test -- --coverage`       | Отчет о покрытии кода тестами                  |
| `npm test -- CreateSkillModal` | Запуск только тестов конкретного файла         |
| `npm test -- --bail`           | Остановка при первой ошибке                    |
| `npm test -- --onlyChanged`    | Запуск только измененных тестов                |

**Пример:**

```bash
npm test -- --watch

npm test -- --coverage
```

Конфигурация Jest находится в `jest.config.ts` и использует:

- **testEnvironment**: jsdom (браузерное окружение)
- **setupFilesAfterEnv**: jest.setup.ts (инициализация)
