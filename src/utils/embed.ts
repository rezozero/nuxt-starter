import { encodeUrlParams } from '~/utils/url'

export function getEmbedSrc(id: string, platform: string, params: Record<string, string> = {}): string | undefined {
    if (platform === 'vimeo') return getVimeoEmbedSrc(id, params)
    if (platform === 'youtube') return getYouTubeEmbedSrc(id, params)
}

export function getVimeoEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getVideoEmbedUrl(`https://player.vimeo.com/video/${id}`, params)
}

export function getYouTubeEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getVideoEmbedUrl(`https://www.youtube.com/embed/${id}`, params)
}

export function getVideoEmbedUrl(url: string, params: Record<string, string> = {}) {
    const encodedParams = encodeUrlParams(params)

    if (encodedParams.length) url += '?' + encodedParams

    return url
}
