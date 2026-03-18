import { ArrowUp, ArrowDown } from "lucide-react";
import { CvForTable } from "./types";
import { CvTableRow } from "./CvTableRow";
import { BaseTable } from "@/components/CvsTable/BaseTable";
import SearchInput from "@/components/search/SearchInput";
import { ROUTES } from "@/app/configs/routesConfig";
import { usePathname } from "next/navigation";

interface CvsTableProps {
  cvs: CvForTable[];
  isReadOnly: boolean;
  onDeleteClick: (cv: CvForTable) => void;
  sortDirection: "asc" | "desc";
  onSortToggle: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick?: () => void;
  userId?: string;
}


export function CvsTable(props: CvsTableProps) {
  const pathname = usePathname()

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2">
          Name
          <span className="text-gray-400 group-hover:text-gray-600">
            {props.sortDirection === "asc" ? <ArrowUp size={16}/> : <ArrowDown size={16}/>}
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
    <div className="w-full">

      { pathname === ROUTES.USERCVS(props.userId || '') &&  
          <div className="flex justify-between items-center w-full mb-6">
        <SearchInput
          value={props.searchTerm}
          onChange={props.onSearchChange}
        />

        {props.onCreateClick && (
          <button
            onClick={props.onCreateClick}
            className="flex items-center gap-2 px-5 py-2 text-[#c53030] rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm uppercase"
          >
            <span className="text-xl leading-none mb-1">+</span>
            Create CV
          </button>
        )}
      </div>
      }

      <div className="w-full overflow-x-auto">
        <BaseTable columns={columns} isEmpty={props.cvs.length === 0} emptyText="No CVs found.">
          {props.cvs.map(cv => (
            <CvTableRow
              key={cv.id}
              cv={cv}
              userId={cv.userId || ""}
              userEmail={cv.userEmail || ""}
              isReadOnly={props.isReadOnly}
              onDeleteClick={props.onDeleteClick}
            />
          ))}
        </BaseTable>
      </div>
    </div>
  );
}