export interface Violation {
    code: string
    message: string
    propertyPath: string
}

export interface FormElementProps<T = string> {
    // Input attributes
    pattern?: string
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
    modelValue?: T
    parents?: string[]
    errors?: Violation[] | undefined
}
