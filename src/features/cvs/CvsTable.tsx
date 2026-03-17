"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { Cv } from "./types";
import { CvTableRow } from "./CvTableRow";
import { TableLayout } from "@/components/CvsTable/TableLayout";
import { BaseTable } from "@/components/CvsTable/BaseTable";

interface CvsTableProps {
  cvs: Cv[];
  userId: string;
  userEmail: string;
  isReadOnly: boolean;
  onDeleteClick: (cv: Cv) => void;
  sortDirection: "asc" | "desc";
  onSortToggle: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick?: () => void;
}

export function CvsTable(props: CvsTableProps) {
  const columns = [
    {
      header: (
        <div className="flex items-center gap-2">
          Name
          <span className="text-gray-400 group-hover:text-gray-600">
            {props.sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </span>
        </div>
      ),
      className: "cursor-pointer hover:text-gray-600 transition-colors group w-1/3",
      onSort: props.onSortToggle,
    },
    { header: "Education", className: "w-1/4" },
    { header: "Employee", className: "w-1/4" },
    { header: "", className: "w-[50px]" },
  ];

  return (
    <TableLayout
      searchTerm={props.searchTerm}
      onSearchChange={props.onSearchChange}
      onCreateClick={props.onCreateClick}
      createButtonText="Create CV"
    >
      <BaseTable 
        columns={columns} 
        isEmpty={props.cvs.length === 0} 
        emptyText="No CVs found."
      >
        {props.cvs.map((cv) => (
          <CvTableRow
            key={cv.id}
            cv={cv}
            userId={props.userId}
            userEmail={props.userEmail}
            isReadOnly={props.isReadOnly}
            onDeleteClick={props.onDeleteClick}
          />
        ))}
      </BaseTable>
    </TableLayout>
  );
}