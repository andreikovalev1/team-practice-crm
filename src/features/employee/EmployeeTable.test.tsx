import { render, screen, fireEvent } from "@testing-library/react"
import EmployeeTable from "./EmployeeTable"
import { User } from "@/types/user.types"

const employees: User[] = [
  {
    id: "1",
    email: "Val@test.ru",
    created_at: "",
    department_name: "React",
    position_name: "Software Engineer",
    profile: {
      first_name: "Valeria",
      last_name: "Corleone",
      avatar: ""
    }
  },
  {
    id: "2",
    email: "Andr@test.ru",
    created_at: "",
    department_name: "React",
    position_name: "Software Engineer",
    profile: {
      first_name: "Andrey",
      last_name: "Winchester",
      avatar: ""
    }
  }
]

describe("Компонент EmployeeTable", () => {
    
})