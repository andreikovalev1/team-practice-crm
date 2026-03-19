"use client";

import { GET_GLOBAL_POSITION_QUERY } from "@/features/positions/graphql";
import { GetGlobalPositionsResponse, GlobalPosition } from "@/features/positions/types";
import { useQuery } from "@apollo/client/react";
import Table from "@/components/table/Table";
import { ColumnType } from "@/components/table/types";
import { useSearchStore } from "@/store/useSearchStore";
import ActionMenu from "@/components/table/ActionMenu";
import { useMemo } from "react";
import useDebounce from "@/components/search/useDebounce";
import UpdatePositionModal from "@/features/positions/UpdatePositionModal";
import DeletePositionModal from "@/features/positions/DeletePositionsModal";

const GLOBAL_POSITION: GlobalPosition[] = [];

export default function PositionsPage() {
  const search = useSearchStore((state) => state.search);
  const debouncedSearch = useDebounce(search, 400);
  const { data: globalPositionsData, loading } = useQuery<GetGlobalPositionsResponse>(GET_GLOBAL_POSITION_QUERY);
  const positions = globalPositionsData?.positions|| GLOBAL_POSITION;


  const displayedPositions = useMemo(() => {
    const searchValue = debouncedSearch.toLowerCase();
    return positions.filter(position => {
      const name = position?.name.toLowerCase() || '';
      return name.includes(searchValue)
    });
  }, [positions, debouncedSearch]);

  const columns = useMemo<ColumnType<GlobalPosition>[]>(() => [
    { key: "name", label: "Name", sortable: true },
    {
      key: "actions",
      label: "",
      nestedItem: (position: GlobalPosition) => (
        <ActionMenu
          row={position}
          entityName="Position"
          renderModal={(row, close, action) => {
            if (action === "update") {
              return (
                <UpdatePositionModal
                  isOpen={true}
                  onClose={close}
                  position={row}
                />
              );
            }

            if (action === "delete") {
              return (
                <DeletePositionModal
                  isOpen={true}
                  onClose={close}
                  position={row}
                />
              );
            }
          }}
        />
      ),
    },
  ], []);

  return loading ?           
    <div className="text-center py-26 text-gray-500 font-medium">
      Loading Positions...
    </div> :
    <Table<GlobalPosition> data={displayedPositions} columns={columns} />
}