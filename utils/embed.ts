import { encodeUrlParams } from '~/utils/url'

export function getEmbedSrc(id: string, platform: string, params: Record<string, string> = {}): string | undefined {
    if (platform === 'vimeo') return getVimeoEmbedSrc(id, params)
    if (platform === 'youtube') return getYouTubeEmbedSrc(id, params)
    if (platform === 'deezer') return getDeezerEmbedSrc(id, params)
    if (platform === 'spotify') return getSpotifyEmbedSrc(id, params)
    if (platform === 'soundcloud') return getSoundcloudEmbedSrc(id, params)
}

export function getVimeoEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://player.vimeo.com/video/${id}`, params)
}

export function getYouTubeEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://www.youtube-nocookie.com/embed/${id}`, params)
}

export function getDeezerEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://widget.deezer.com/widget/light/${id}`, params)
}

export function getSpotifyEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://open.spotify.com/embed/${id}`, params)
}

export function getSoundcloudEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://w.soundcloud.com/player/?url=${id}`, params)
}

export function getEmbedUrl(url: string, params: Record<string, string> = {}) {
    const encodedParams = encodeUrlParams(params)

    if (encodedParams.length) url += '?' + encodedParams

    return url
}
