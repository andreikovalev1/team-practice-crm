export interface ColumnType<T> {
    key: keyof T | string        // <- теперь можно любые строки, не только ключи объекта
    label: string
    sortable?: boolean
    nestedItem?: (item: T) => React.ReactNode
}

export interface TableProps<T extends { id: string }> {
    data: T[]
    columns: ColumnType<T>[]
}