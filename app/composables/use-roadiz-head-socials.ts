export interface SocialLink {
    name: string
    url: string
    label?: string
    icon?: string
}

export function getSocialLinks({ key, url }: { key: string, url: string }) {
    const _key = key.toLowerCase()

    if (_key.startsWith('mastodon')) {
        return { url: url, name: 'Mastodon', icon: 'social-mastodon' }
    }
    if (_key.startsWith('pinterest')) {
        return { url: url, name: 'Pinterest', icon: 'social-pinterest' }
    }
    if (_key.startsWith('snapchat')) {
        return { url: url, name: 'Snapchat', icon: 'social-snapchat' }
    }
    if (_key.startsWith('instagram')) {
        return { url: url, name: 'Instagram', icon: 'social-instagram' }
    }
    if (_key.startsWith('youtube')) {
        return { url: url, name: 'Youtube', icon: 'social-youtube' }
    }
    if (_key.startsWith('linkedin')) {
        return { url: url, name: 'LinkedIn', icon: 'social-linkedin' }
    }
    if (_key.startsWith('facebook')) {
        return { url: url, name: 'Facebook', icon: 'social-facebook' }
    }
    if (_key.startsWith('tiktok')) {
        return { url: url, name: 'Tiktok', icon: 'social-tiktok' }
    }
    if (_key.startsWith('spotify')) {
        return { url: url, name: 'Spotify', icon: 'social-spotify' }
    }
    if (_key.startsWith('twitter') || _key.startsWith('x_')) {
        return { url: url, name: 'X', icon: 'social-x' }
    }

    return {
        url: url,
        name: key,
        icon: 'link',
    }
}

export function useRoadizHeadSocialLinks() {
    const { data } = useCommonContent()

    return computed(() => {
        const urlEntriesList = Object.entries(data.value?.urls || {})
            .filter(([_key, value]) => typeof value === 'string') as [string, string][]

        return urlEntriesList.map(([key, url]) => getSocialLinks({ key, url }))
    })
}
