export interface SocialLink {
    name: string
    url: string
    label?: string
    icon?: string
}

export function getSocialLinks({ key, url }: { key: string, url: string }) {
    // Remove trailing "url" and convert to lowercase for better matching
    // For example, "twitterUrl" becomes "twitter", "linkedin_url" becomes "linkedin"
    const formattedKey = key.toLowerCase().replace(/_?url$/, '')

    if (formattedKey.startsWith('mastodon')) {
        return { url: url, name: 'Mastodon', icon: 'social-mastodon' }
    }
    if (formattedKey.startsWith('pinterest')) {
        return { url: url, name: 'Pinterest', icon: 'social-pinterest' }
    }
    if (formattedKey.startsWith('snapchat')) {
        return { url: url, name: 'Snapchat', icon: 'social-snapchat' }
    }
    if (formattedKey.startsWith('instagram')) {
        return { url: url, name: 'Instagram', icon: 'social-instagram' }
    }
    if (formattedKey.startsWith('youtube')) {
        return { url: url, name: 'Youtube', icon: 'social-youtube' }
    }
    if (formattedKey.startsWith('linkedin')) {
        return { url: url, name: 'LinkedIn', icon: 'social-linkedin' }
    }
    if (formattedKey.startsWith('facebook')) {
        return { url: url, name: 'Facebook', icon: 'social-facebook' }
    }
    if (formattedKey.startsWith('tiktok')) {
        return { url: url, name: 'Tiktok', icon: 'social-tiktok' }
    }
    if (formattedKey.startsWith('spotify')) {
        return { url: url, name: 'Spotify', icon: 'social-spotify' }
    }
    if (formattedKey.startsWith('twitter') || formattedKey === 'x') {
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
