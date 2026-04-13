export interface SocialLink {
    name: string
    url: string
    label?: string
    icon?: string
}

export function getSocialLinks(key: string, url: string) {
    if (key.startsWith('mastodon')) {
        return { url: url, name: 'Mastodon', icon: 'social-mastodon' }
    }
    if (key.startsWith('pinterest')) {
        return { url: url, name: 'Pinterest', icon: 'social-pinterest' }
    }
    if (key.startsWith('snapchat')) {
        return { url: url, name: 'Snapchat', icon: 'social-snapchat' }
    }
    if (key.startsWith('instagram')) {
        return { url: url, name: 'Instagram', icon: 'social-instagram' }
    }
    if (key.startsWith('youtube')) {
        return { url: url, name: 'Youtube', icon: 'social-youtube' }
    }
    if (key.startsWith('linkedin')) {
        return { url: url, name: 'LinkedIn', icon: 'social-linkedin' }
    }
    if (key.startsWith('facebook')) {
        return { url: url, name: 'Facebook', icon: 'social-facebook' }
    }
    if (key.startsWith('tiktok')) {
        return { url: url, name: 'Tiktok', icon: 'social-tiktok' }
    }
    if (key.startsWith('spotify')) {
        return { url: url, name: 'Spotify', icon: 'social-spotify' }
    }
    if (key.startsWith('twitter') || key.startsWith('x_')) {
        return { url: url, name: 'X', icon: 'social-x' }
    }
    return
}

export function useRoadizHeadSocialLinks() {
    const { data } = useCommonContent()

    return computed(() => {
        const urlEntriesList = Object.entries(data.value?.urls || {}).filter(([_key, value]) => typeof value === 'string') as [string, string][]

        return urlEntriesList.reduce((acc, [urlKey, url]) => {
            const link = getSocialLinks(urlKey, url)
            if (link) acc.push(link)

            return acc
        }, [] as SocialLink[])
    })
}
