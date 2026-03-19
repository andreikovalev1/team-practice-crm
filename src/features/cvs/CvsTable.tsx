import { GoArrowUp } from "react-icons/go"
import { Plus } from "lucide-react";
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
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onCreateClick?: () => void;
  userId?: string;
  onUpdateClick: (cv: CvForTable) => void;
}

export function CvsTable(props: CvsTableProps) {
  const pathname = usePathname();

  const columns = [
    {
      header: (
      <div className="flex items-center gap-2">
        Name
        <span className={`${props.sortDirection === 'desc' ? 'text-black' : 'text-gray-400'}`}>
          <GoArrowUp />
        </span>
      </div>
      ),
      className: "cursor-pointer hover:text-gray-600 transition-colors group w-[35%] min-w-[280px]",
      onSort: props.onSortToggle,
    },
    { header: "Education", className: "hidden md:table-cell w-[30%] min-w-[180px]" }, // Убрали hidden! Теперь она видна через скролл
    { header: "Employee", className: "w-[30%] min-w-[200px]" },
    { header: "", className: "w-[5%] min-w-[50px]" },
  ];

  return (
    <div className="w-full">
      {pathname === ROUTES.USERCVS(props.userId || '') && (
        <div className="flex flex-row gap-4 items-center w-full mb-6">
          <div className="flex-1">
            <SearchInput
              value={props.searchTerm || ''}
              onChange={props.onSearchChange ||(() => {})}
            />
          </div>

          {props.onCreateClick && (
            <button
              onClick={props.onCreateClick}
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-sm uppercase"
            >
              <Plus size={20} className="md:hidden" />
              <span className="hidden md:flex items-center gap-2">
                <span className="text-xl leading-none mb-1">+</span>
                Create CV
              </span>
            </button>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="w-full">
          <BaseTable columns={columns} isEmpty={props.cvs.length === 0} emptyText="No CVs found.">
            {props.cvs.map(cv => (
              <CvTableRow
                key={cv.id}
                cv={cv}
                userId={cv.userId || ""}
                userEmail={cv.userEmail || ""}
                isReadOnly={props.isReadOnly}
                onDeleteClick={props.onDeleteClick}
                onUpdateClick={props.onUpdateClick}
              />
            ))}
          </BaseTable>
        </div>
      </div>
    </div>
  );
}