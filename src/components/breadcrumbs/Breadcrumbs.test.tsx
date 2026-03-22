import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import Breadcrumbs from "./Breadcrumbs";
import { useIsOwnProfile } from "@/features/profile/useIsOwnProfile";
import { useQuery } from "@apollo/client/react";

jest.mock("next/navigation");
jest.mock("@/features/profile/useIsOwnProfile");
jest.mock("@apollo/client/react");

const mockedUsePathname = jest.mocked(usePathname);
const mockedUseIsOwnProfile = jest.mocked(useIsOwnProfile);
const mockedUseQuery = jest.mocked(useQuery);

describe("Breadcrumbs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [ROUTES.SKILLS, "Skills"],
    [ROUTES.LANGUAGES, "Languages"],
    [ROUTES.CVS, "CVs"],
  ])("на пути %s рендерит только %s", (path, expectedLabel) => {
    mockedUsePathname.mockReturnValue(path);
    mockedUseIsOwnProfile.mockReturnValue({
      user: null,
      profileUserId: "1",
      isOwnProfile: true,
    });
    
    mockedUseQuery.mockReturnValue({ 
      data: undefined, 
      loading: false 
    } as unknown as ReturnType<typeof useQuery>);

    render(<Breadcrumbs />);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });

  it("рендерит цепочку для профиля пользователя", () => {
    mockedUsePathname.mockReturnValue("/users/1/profile");
    mockedUseIsOwnProfile.mockReturnValue({
      user: { id: "1", email: "mail@.ru", role: "Employee", profile: { first_name: "Valeria", last_name: "Kovalenko" } },
      profileUserId: "1",
      isOwnProfile: true,
    });
    
    mockedUseQuery.mockReturnValue({ 
      data: undefined, 
      loading: false 
    } as unknown as ReturnType<typeof useQuery>);

    render(<Breadcrumbs />);

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Valeria Kovalenko")).toBeInTheDocument();
  });

  it("рендерит вложенный путь: Employees > Name > Skills", () => {
    mockedUsePathname.mockReturnValue("/users/1/skills");
    mockedUseIsOwnProfile.mockReturnValue({
      user: { id: "1", email: "mail@.ru", role: "Employee", profile: { first_name: "Valeria", last_name: "Kovalenko" } },
      profileUserId: "1",
      isOwnProfile: true,
    });
    
    mockedUseQuery.mockReturnValue({ 
      data: undefined, 
      loading: false 
    } as unknown as ReturnType<typeof useQuery>);

    render(<Breadcrumbs />);

    expect(screen.getByText("Employees")).toBeInTheDocument();
    expect(screen.getByText("Valeria Kovalenko")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
  });
});