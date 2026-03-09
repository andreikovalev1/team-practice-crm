import { renderHook, waitFor, act } from "@testing-library/react";
import { MockedProvider as BaseMockedProvider } from "@apollo/client/testing/react";
import { ReactNode, FC } from "react";
import toast from "react-hot-toast";
import { useSkillsLogic } from "../useSkillsLogic";
import { 
  GET_PROFILE_SKILLS_QUERY, 
  GET_GLOBAL_SKILLS_QUERY, 
  GET_SKILL_CATEGORIES_QUERY,
  ADD_PROFILE_SKILL_MUTATION
} from "../graphql";

interface MockedProviderProps {
  mocks?: ReadonlyArray<unknown>;
  addTypename?: boolean;
  children: ReactNode;
}
const MockedProvider = BaseMockedProvider as unknown as FC<MockedProviderProps>;

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

const mockUserId = "user-1";
const profileSkillsMock = {
  request: { query: GET_PROFILE_SKILLS_QUERY, variables: { userId: mockUserId } },
  result: {
    data: {
      profile: {
        skills: [
          { name: "React", mastery: "Expert", categoryId: null }, 
        ]
      }
    }
  }
};

const globalSkillsMock = {
  request: { query: GET_GLOBAL_SKILLS_QUERY },
  result: {
    data: {
      skills: [
        { id: "g1", name: "React", category_name: "Frontend" },
        { id: "g2", name: "Node.js", category_name: "Backend" },
      ]
    }
  }
};

const categoriesMock = {
  request: { query: GET_SKILL_CATEGORIES_QUERY },
  result: {
    data: {
      skillCategories: [
        { id: "cat-1", name: "Frontend" },
        { id: "cat-2", name: "Backend" },
      ]
    }
  }
};

const addSkillMock = {
  request: { 
    query: ADD_PROFILE_SKILL_MUTATION, 
    variables: { skill: { userId: mockUserId, name: "Node.js", categoryId: "cat-2", mastery: "Novice" } } 
  },
  result: {
    data: {
      addProfileSkill: true
    }
  }
};

describe("Хук useSkillsLogic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен загрузить данные, сгруппировать скиллы и починить categoryId", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[profileSkillsMock, globalSkillsMock, categoriesMock]} addTypename={false}>
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(() => useSkillsLogic(mockUserId), { wrapper });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.groupedSkills).toHaveProperty("Frontend");
    expect(result.current.groupedSkills["Frontend"][0].name).toBe("React");
    expect(result.current.groupedSkills["Frontend"][0].categoryId).toBe("cat-1");
    expect(result.current.availableSkills.length).toBe(1);
    expect(result.current.availableSkills[0].name).toBe("Node.js");
  });

  it("должен успешно вызывать функцию добавления скилла (addSkill) и показывать toast", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={[profileSkillsMock, globalSkillsMock, categoriesMock, addSkillMock]} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useSkillsLogic(mockUserId), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addSkill("Node.js", "Backend", "Novice");
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Skill added successfully!", expect.any(Object));
    });
  });
});