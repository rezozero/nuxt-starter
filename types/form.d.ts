export interface Violation {
    code: string
    message: string
    propertyPath: string
}

export interface FormElementProps<T = string> {
    id?: string
    required?: boolean
    errors?: Violation[] | undefined
    label?: string
    name?: string
    disabled?: boolean
    hideSeparator?: boolean
    description?: string
    autocomplete?: string
    placeholder?: string
    parents?: string[]
    modelValue?: T
}
