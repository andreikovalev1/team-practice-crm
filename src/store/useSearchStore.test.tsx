import { useSearchStore } from "./useSearchStore";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.setState({ search: "" });
  });

  it("должен иметь начальное состояние", () => {
    expect(useSearchStore.getState().search).toBe("");
  });

  it("должен изменять поисковый запрос", () => {
    useSearchStore.getState().setSearch("React");
    expect(useSearchStore.getState().search).toBe("React");
  });
});