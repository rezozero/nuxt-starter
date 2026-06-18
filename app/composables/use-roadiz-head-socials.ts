export interface SocialLink {
    name: string
    url: string
    label?: string
    icon?: string
    order?: number
}

const SOCIAL_NETWORKS = [
    { prefixes: ['instagram'], name: 'Instagram', icon: 'social-instagram', order: 1 },
    { prefixes: ['facebook'], name: 'Facebook', icon: 'social-facebook', order: 2 },
    { prefixes: ['tiktok'], name: 'Tiktok', icon: 'social-tiktok', order: 3 },
    { prefixes: ['linkedin'], name: 'LinkedIn', icon: 'social-linkedin', order: 4 },
    { prefixes: ['mastodon'], name: 'Mastodon', icon: 'social-mastodon', order: 5 },
    { prefixes: ['pinterest'], name: 'Pinterest', icon: 'social-pinterest', order: 6 },
    { prefixes: ['snapchat'], name: 'Snapchat', icon: 'social-snapchat', order: 7 },
    { prefixes: ['youtube'], name: 'Youtube', icon: 'social-youtube', order: 8 },
    { prefixes: ['spotify'], name: 'Spotify', icon: 'social-spotify', order: 9 },
    { prefixes: ['twitter', 'x'], name: 'X', icon: 'social-x', order: 10 },
] as const

function normalizeKey(key: string): string {
    return key.replace(/_url$/i, '').replace(/Url$/, '').toLowerCase()
}

export function getSocialLinks(key: string, url: string): SocialLink {
    const normalized = normalizeKey(key)
    const network = SOCIAL_NETWORKS.find(({ prefixes }) => prefixes.some((p) => normalized === p))

    if (network) {
        return {
            url,
            name: network.name,
            icon: network.icon,
            order: network.order
        }
    }

    return {
        url,
        name: key,
        icon: 'link'
    }
}

export function useRoadizHeadSocialLinks() {
    const { data } = useCommonContent()

    return computed(() =>
        Object.entries(data.value?.urls || {})
            .filter(([, value]) => typeof value === 'string')
            .map(([key, url]) => getSocialLinks(key, url as string))
            .sort((a, b) => (a.order ?? SOCIAL_NETWORKS.length) - (b.order ?? SOCIAL_NETWORKS.length)),
    )
}
