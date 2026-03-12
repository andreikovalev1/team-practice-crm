export interface ColumnType<T> {
    key: keyof T
    label: string
    sortable?: boolean
}

export interface TableProps<T extends { id: string }> {
    data: T[]
    columns: ColumnType<T>[]
}