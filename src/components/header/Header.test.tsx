import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import { useAdmin } from "@/lib/useAdmin";
import { ROUTES } from "@/app/configs/routesConfig";

jest.mock("@/store/useSearchStore");
jest.mock("next/navigation");
jest.mock("@/lib/useAdmin");
jest.mock("@/components/breadcrumbs/Breadcrumbs", () => {
  return function MockBreadcrumbs() {
    return <div data-testid="breadcrumbs">Breadcrumbs</div>;
  };
});
jest.mock("@/features/employee/CreateUserModal", () => {
  return function MockCreateUserModal() {
    return <div data-testid="modal-user" />;
  };
});
jest.mock("@/features/languages/CreateLanguageModal", () => {
  return function MockCreateLanguageModal() {
    return <div data-testid="modal-lang" />;
  };
});
jest.mock("@/features/skills/CreateSkillModal", () => {
  return function MockCreateSkillModal() {
    return <div data-testid="modal-skill" />;
  };
});

const mockedUsePathname = jest.mocked(usePathname);
const mockedUseSearchStore = jest.mocked(useSearchStore);
const mockedUseAdmin = jest.mocked(useAdmin);

describe("Header", () => {
  const setSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAdmin.mockReturnValue(false);
    mockedUsePathname.mockReturnValue(ROUTES.HOME);
    mockedUseSearchStore.mockImplementation((selector) =>
      selector({ search: "", setSearch })
    );
  });

  it("рендерит всегда Breadcrumbs", () => {
    render(<Header />);
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
  });

  it("вызывает setSearch при вводе в поиск", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, "hello");
    expect(setSearch).toHaveBeenCalled();
  });
});

describe("Отображение поиска (SearchInput)", () => {
  it.each([
    [ROUTES.HOME],
    [ROUTES.CVS],
    [ROUTES.SKILLS],
    [ROUTES.LANGUAGES],
  ])("показывает поиск на странице %s", (path) => {
    mockedUsePathname.mockReturnValue(path);
    render(<Header />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("скрывает поиск на других страницах", () => {
    mockedUsePathname.mockReturnValue("/users/625/skills");
    render(<Header />);
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
  });
});

describe("Кнопка создания (Create Button)", () => {
  beforeEach(() => {
    mockedUseAdmin.mockReturnValue(true);
  });

  it("открывает модалку при клике", async () => {
    const user = userEvent.setup();
    mockedUsePathname.mockReturnValue(ROUTES.HOME);
    render(<Header />);
    const btn = screen.getByRole("button", { name: /\+ create user/i });
    await user.click(btn);
    expect(screen.getByTestId("modal-user")).toBeInTheDocument();
  });
});