import { useUserStore } from "./useUserStore";
import { User } from "@/types/user.types";

const mockUser: User = {
  id: "1",
  email: "test@test.ru",
  profile: { first_name: "Val", last_name: "Cor", avatar: "" },
  role: "Employee",
};

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null, isLoggedIn: false });
  });

  it("должен инициализироваться с пустым состоянием", () => {
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });

  it("должен логинить пользователя", () => {
    useUserStore.getState().setLogin(mockUser);
    
    const state = useUserStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
  });

  it("должен разлогинивать пользователя", () => {
    useUserStore.getState().setLogin(mockUser);
    useUserStore.getState().logout();
    
    const state = useUserStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });
});