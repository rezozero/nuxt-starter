import type { RoadizNodesSourcesHead } from '@roadiz/types'

export interface SocialLink {
    name: string
    url: string
    label?: string
    icon?: string
}

export function getSocialLinks(head: RoadizNodesSourcesHead | undefined) {
    if (!head) return []

    const links = [] as SocialLink[]
    const { twitterUrl, instagramUrl, youtubeUrl, linkedinUrl, facebookUrl } = head

    if (twitterUrl) {
        links.push({ url: twitterUrl, name: 'Twitter', icon: 'x' })
    }
    if (instagramUrl) {
        links.push({ url: instagramUrl, name: 'Instagram', icon: 'instagram' })
    }
    if (youtubeUrl) {
        links.push({ url: youtubeUrl, name: 'Youtube', icon: 'youtube' })
    }
    if (linkedinUrl) {
        links.push({ url: linkedinUrl, name: 'LinkedIn', icon: 'linkedin' })
    }
    if (facebookUrl) {
        links.push({ url: facebookUrl, name: 'Facebook', icon: 'facebook' })
    }
    // if (vimeoUrl) {
    //     links.push({ url: vimeoUrl, name: 'Vimeo' })
    // }
    // if (spotifyUrl) {
    //     links.push({ url: spotifyUrl, name: 'Spotify' })
    // }

    return links.map((link) => {
        return {
            ...link,
            label: link.name,
        }
    })
}

export async function useRoadizHeadSocialLinks() {
    const { data } = useCommonContent()

    return ref(getSocialLinks(data.value?.head))
}
