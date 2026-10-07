export interface SocialLink {
    name: string
    url: string
    label?: string
    icon?: string
}

// useRoadizHeadSocialLinks will sort the social links based on the order defined in SOCIAL_NETWORKS
// and will use a default icon for unknown networks
const SOCIAL_NETWORKS = [
    { prefixes: ['instagram'], name: 'Instagram', icon: 'social-instagram' },
    { prefixes: ['facebook'], name: 'Facebook', icon: 'social-facebook' },
    { prefixes: ['tiktok'], name: 'Tiktok', icon: 'social-tiktok' },
    { prefixes: ['linkedin'], name: 'LinkedIn', icon: 'social-linkedin' },
    { prefixes: ['mastodon'], name: 'Mastodon', icon: 'social-mastodon' },
    { prefixes: ['pinterest'], name: 'Pinterest', icon: 'social-pinterest' },
    { prefixes: ['snapchat'], name: 'Snapchat', icon: 'social-snapchat' },
    { prefixes: ['youtube'], name: 'Youtube', icon: 'social-youtube' },
    { prefixes: ['spotify'], name: 'Spotify', icon: 'social-spotify' },
    { prefixes: ['twitter', 'x'], name: 'X', icon: 'social-x' },
] as const

// Api keys in commonContent.urls can be in snake_case or camelCase,
// so we need to normalize them to match the prefixes in SOCIAL_NETWORKS
function normalizeKey(key: string): string {
    return key.replace(/_url$/i, '').replace(/Url$/, '').toLowerCase()
}

export function getSocialLinks(key: string, url: string): SocialLink {
    const normalized = normalizeKey(key)
    const network = SOCIAL_NETWORKS.find(({ prefixes }) => prefixes.some(p => normalized === p))

    if (network) {
        return {
            url,
            name: network.name,
            icon: network.icon,
        }
    }

    return {
        url,
        name: normalized,
        icon: 'link',
    }
}

export function useRoadizHeadSocialLinks() {
    const { data } = useCommonContent()

    return computed(() =>
        Object.entries(data.value?.urls || {})
            .filter(([, value]) => typeof value === 'string')
            .map(([key, url]) => getSocialLinks(key, url as string))
            .sort((a, b) => {
                const ai = SOCIAL_NETWORKS.findIndex(({ name }) => name === a.name)
                const bi = SOCIAL_NETWORKS.findIndex(({ name }) => name === b.name)
                return (ai === -1 ? SOCIAL_NETWORKS.length : ai) - (bi === -1 ? SOCIAL_NETWORKS.length : bi)
            }))
}
