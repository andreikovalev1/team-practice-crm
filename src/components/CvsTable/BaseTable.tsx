"use client";

interface Column {
  header: React.ReactNode;
  className?: string;
  onSort?: () => void;
}

interface BaseTableProps {
  columns: Column[];
  children: React.ReactNode;
  isEmpty: boolean;
  emptyText?: string;
}

export function BaseTable({ columns, children, isEmpty, emptyText = "No data found" }: BaseTableProps) {
  if (isEmpty) {
    return (
      <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg">
        {emptyText}
      </div>
    );
  }

  return (
    <table className="w-full text-left text-base border-collapse table-fixed">
      <thead>
        <tr className="border-b border-gray-200 [&>th]:py-4 [&>th]:px-4 text-gray-900 dark:text-[#ECECED] dark:hover:bg-[#454545]">
          {columns.map((col, idx) => (
            <th 
              key={idx} 
              className={`${col.className ?? ""} text-sm md:text-base`}
              onClick={col.onSort}
              style={{ cursor: col.onSort ? 'pointer' : 'default' }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      {children}
    </table>
  );
}