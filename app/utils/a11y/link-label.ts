// A generic label ("Learn more") says nothing out of its card, to screen reader users browsing a links list as to
// search engines, which is why Lighthouse fails it: https://developer.chrome.com/docs/lighthouse/seo/link-text/
// So the card title follows it: the visible label first (WCAG 2.5.3), then its context (RGAA 6.1).
export const LINK_CONTEXT_SEPARATOR = ', '

// For an `aria-label`; VLinkLabel renders the same with the context as visually hidden text
export function getLinkLabelWithContext(label: string, context?: string): string {
    return context ? `${label}${LINK_CONTEXT_SEPARATOR}${context}` : label
}
