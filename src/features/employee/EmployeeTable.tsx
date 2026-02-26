import { MdArrowForwardIos } from "react-icons/md";

interface Employee {
  id: string;
  email: string;
  department_name?: string;
  position_name?: string;
  profile?: {
    avatar?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Место для поиска</h2>

      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th></th>
              <th className="px-4 py-3 font-normal">First Name</th>
              <th className="px-4 py-3 font-normal">Last Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Department</th>
              <th className="px-4 py-3 font-normal">Position</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-t border-zinc-200 hover:bg-zinc-50 transition"
              >
                <td className="px-4 py-4">
                  {employee.profile?.avatar ? (
                    <img
                      src={employee.profile.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                      {employee.profile?.first_name
                        ? employee.profile.first_name.charAt(0).toUpperCase()
                        : employee.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>

                <td className="px-4 py-4">{employee.profile?.first_name}</td>
                <td className="px-4 py-4">{employee.profile?.last_name}</td>
                <td className="px-4 py-4">{employee.email}</td>
                <td className="px-4 py-4">{employee.department_name}</td>
                <td className="px-4 py-4">{employee.position_name}</td>
                <td className="px-4 py-4"><MdArrowForwardIos size={14} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}