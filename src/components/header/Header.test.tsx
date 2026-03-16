import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import { useAdmin } from "@/lib/useAdmin";
import { ROUTES } from "@/app/configs/routesConfig"

jest.mock("@/store/useSearchStore");
jest.mock("next/navigation");
jest.mock("@/lib/useAdmin");
jest.mock("@/components/breadcrumbs/Breadcrumbs", () => {
  return function MockBreadcrumbs() {
    return <div data-testid="breadcrumbs">Breadcrumbs</div>;
  };
});
jest.mock("@/components/search/SearchInput", () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockedUsePathname = jest.mocked(usePathname);
const mockedUseSearchStore = jest.mocked(useSearchStore);
const mockedUseAdmin = jest.mocked(useAdmin);

describe("Header", () => {
  const setSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAdmin.mockReturnValue(false);
    mockedUsePathname.mockReturnValue("/");
    mockedUseSearchStore.mockImplementation((selector) =>
      selector({ search: "", setSearch })
    );
  });

  it("рендерит всегда Breadcrumbs", () => {
    render(<Header />);
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
  });

  it("вызывает setSearch при вводе", async () => {
    render(<Header />);
    const input = screen.getByTestId("search-input");
    await userEvent.type(input, "hello");
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
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    it("скрывает поиск на других страницах", () => {
      mockedUsePathname.mockReturnValue("/users/625/skills");
      render(<Header />);
      expect(screen.queryByTestId("search-input")).not.toBeInTheDocument();
    });

    it("не показывает кнопку создания, если пользователь не админ", () => {
      mockedUseAdmin.mockReturnValue(false);
      mockedUsePathname.mockReturnValue(ROUTES.HOME);
      render(<Header />);
      expect(screen.queryByRole("button", { name: /create/i })).not.toBeInTheDocument();
    });
  });

  describe("Кнопка создания (Create Button)", () => {
    beforeEach(() => {
      mockedUseAdmin.mockReturnValue(true);
    });

    it.each([
      [ROUTES.HOME, /create user/i],
      [ROUTES.CVS, /create cv/i],
      [ROUTES.SKILLS, /create skill/i],
      [ROUTES.LANGUAGES, /create language/i],
    ])("на странице %s кнопка имеет текст %s", (path, buttonText) => {
      mockedUsePathname.mockReturnValue(path);
      render(<Header />);
      expect(screen.getByRole("button", { name: buttonText })).toBeInTheDocument();
    });
  });