export interface Violation {
    code: string
    message: string
    propertyPath: string
}

export interface FormElementProps<T = string> {
    // Input attributes
    id?: string
    required?: boolean
    name?: string
    disabled?: boolean
    autocomplete?: string
    placeholder?: string
    // Form field data
    description?: string
    label?: string
    // Form context data
    modelValue?: T | unknown
    parents?: string[]
    errors?: Violation[] | undefined
}
