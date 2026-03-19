"use client";

import { GET_GLOBAL_DEPARTMENT_QUERY } from "@/features/departments/graphql";
import { GetGlobalDepartmentsResponse, GlobalDepartment } from "@/features/departments/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table";
import { ColumnType } from "@/components/table/types";
import { useSearchStore } from "@/store/useSearchStore";
import ActionMenu from "@/components/table/ActionMenu";
import { useMemo } from "react";
import useDebounce from "@/components/search/useDebounce";
import UpdateDepartmentModal from "@/features/departments/UpdateDepatmentModal";
import DeleteDepartmentModal from "@/features/departments/DeleteDepatmentModal";

const GLOBAL_DEPARTMENT: GlobalDepartment[] = [];

export default function PositionsPage() {
  const search = useSearchStore((state) => state.search);
  const debouncedSearch = useDebounce(search, 400);
  const { data: globalDepartmentsData, loading } = useQuery<GetGlobalDepartmentsResponse>(GET_GLOBAL_DEPARTMENT_QUERY);
  const departments = globalDepartmentsData?.departments || GLOBAL_DEPARTMENT;


  const displayeddDpartments = useMemo(() => {
    const searchValue = debouncedSearch.toLowerCase();
    return departments.filter(department => {
      const name = department?.name.toLowerCase() || '';
      return name.includes(searchValue)
    });
  }, [departments, debouncedSearch]);

  const columns = useMemo<ColumnType<GlobalDepartment>[]>(() => [
    { key: "name", label: "Name", sortable: true },
    {
      key: "actions",
      label: "",
      nestedItem: (department: GlobalDepartment) => (
        <div className="flex justify-end">
          <ActionMenu
            row={department}
            entityName="Department"
            renderModal={(row, close, action) => {
              if (action === "update") {
                return (
                  <UpdateDepartmentModal
                    isOpen={true}
                    onClose={close}
                    department={row}
                  />
                );
              }
              if (action === "delete") {
                return (
                  <DeleteDepartmentModal
                    isOpen={true}
                    onClose={close}
                    department={row}
                  />
                );
              }
            }}
          />
        </div>
      ),
    },
  ], []);

  return loading ?         
    <div className="text-center py-26 text-gray-500 font-medium">
      Loading Departments...
    </div> :
    <Table<GlobalDepartment> data={displayeddDpartments} columns={columns} />
}