# Team Practice CRM 🚀

Современная CRM-система, построенная на базе Next.js. Проект разрабатывается с упором на производительность, типизацию и автоматизацию тестирования.

## 🛠 Технологический стек

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
