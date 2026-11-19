// The visible label first (WCAG 2.5.3, label in name), then its context
export const LINK_CONTEXT_SEPARATOR = ', '

// For an `aria-label`
export function getLinkLabelWithContext(label: string, context?: string): string {
    return context ? `${label}${LINK_CONTEXT_SEPARATOR}${context}` : label
}
