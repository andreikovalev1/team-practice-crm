import { renderHook, waitFor, act } from "@testing-library/react";
import { MockLink } from "@apollo/client/testing";
import { MockedProvider } from "@apollo/client/testing/react";
import toast from "react-hot-toast";
import { useLanguagesLogic } from "../useLanguagesLogic";
import {
  GET_PROFILE_LANGUAGES_QUERY,
  GET_GLOBAL_LANGUAGES_QUERY,
  ADD_PROFILE_LANGUAGE_MUTATION,
  UPDATE_PROFILE_LANGUAGE_MUTATION,
  DELETE_PROFILE_LANGUAGE_MUTATION,
} from "../graphql";

jest.mock("react-hot-toast", () => ({
  loading: jest.fn(() => "loading-toast-id"),
  success: jest.fn(),
  error: jest.fn(),
}));

const userId = "user-123";
const mockProfileData = {
  profile: {
    id: userId,
    languages: [{ name: "English", proficiency: "B2" }],
  },
};

const mockGlobalData = {
  languages: [
    { id: "1", name: "English", iso2: "en" },
    { id: "2", name: "Spanish", iso2: "es" },
    { id: "3", name: "French", iso2: "fr" },
  ],
};

const mocks: MockLink.MockedResponse[] = [
  {
    request: { query: GET_PROFILE_LANGUAGES_QUERY, variables: { userId } },
    result: { data: mockProfileData },
  },
  {
    request: { query: GET_GLOBAL_LANGUAGES_QUERY },
    result: { data: mockGlobalData },
  },
  {
    request: {
      query: ADD_PROFILE_LANGUAGE_MUTATION,
      variables: { language: { userId, name: "Spanish", proficiency: "A1" } },
    },
    result: {
      data: {
        addProfileLanguage: {
          id: userId,
          languages: [
            { name: "English", proficiency: "B2" },
            { name: "Spanish", proficiency: "A1" },
          ],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_PROFILE_LANGUAGE_MUTATION,
      variables: { language: { userId, name: "English", proficiency: "C1" } },
    },
    result: {
      data: {
        updateProfileLanguage: {
          id: userId,
          languages: [{ name: "English", proficiency: "C1" }],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_PROFILE_LANGUAGE_MUTATION,
      variables: { language: { userId, name: ["English"] } },
    },
    result: {
      data: {
        deleteProfileLanguage: {
          id: userId,
          languages: [],
        },
      },
    },
  },
  {
    request: {
      query: ADD_PROFILE_LANGUAGE_MUTATION,
      variables: { language: { userId, name: "French", proficiency: "A1" } },
    },
    error: new Error("Network error"),
  },
];

describe("Хук useLanguagesLogic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mocks}>
      {children}
    </MockedProvider>
  );

  it("возвращает начальное состояние загрузки", () => {
    const { result } = renderHook(() => useLanguagesLogic(userId), { wrapper });
    expect(result.current.loading).toBe(true);
  });

  it("успешно загружает данные и вычисляет availableLanguages", async () => {
    const { result } = renderHook(() => useLanguagesLogic(userId), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userLanguagesCount).toBe(1);
    expect(result.current.userLanguages[0].name).toBe("English");
    expect(result.current.availableLanguages).toHaveLength(2);
    expect(result.current.availableLanguages.find(l => l.name === "English")).toBeUndefined();
    expect(result.current.availableLanguages.find(l => l.name === "Spanish")).toBeDefined();
  });

  it("успешно добавляет язык и вызывает тосты", async () => {
    const { result } = renderHook(() => useLanguagesLogic(userId), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addLanguage("Spanish", "A1");
    });

    expect(toast.loading).toHaveBeenCalledWith("Adding language...");
    expect(toast.success).toHaveBeenCalledWith("Language added successfully!", {
      id: "loading-toast-id",
    });
  });

  it("обрабатывает ошибку при добавлении языка", async () => {
    const { result } = renderHook(() => useLanguagesLogic(userId), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      try {
        await result.current.addLanguage("French", "A1");
      } catch {
      }
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to add language", {
      id: "loading-toast-id",
    });
  });

  it("успешно обновляет язык", async () => {
    const { result } = renderHook(() => useLanguagesLogic(userId), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.updateLanguage("English", "C1");
    });

    expect(toast.loading).toHaveBeenCalledWith("Updating language...");
    expect(toast.success).toHaveBeenCalledWith("Language updated!", {
      id: "loading-toast-id",
    });
  });

  it("успешно удаляет языки", async () => {
    const { result } = renderHook(() => useLanguagesLogic(userId), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.removeLanguages(["English"]);
    });

    expect(toast.loading).toHaveBeenCalledWith("Removing language...");
    expect(toast.success).toHaveBeenCalledWith("Language removed!", {
      id: "loading-toast-id",
    });
  });

  it("не выполняет мутации, если userId отсутствует", async () => {
    const { result } = renderHook(() => useLanguagesLogic(undefined), { wrapper });

    await act(async () => {
      await result.current.addLanguage("Spanish", "A1");
      await result.current.updateLanguage("English", "C1");
      await result.current.removeLanguages(["English"]);
    });

    expect(toast.loading).not.toHaveBeenCalled();
  });
});