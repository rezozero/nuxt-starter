export function getEmbedSrc(id: string, platform: string, params: Record<string, string> = {}): string | undefined {
    platform = platform.toLowerCase()
    if (platform === 'vimeo') return getVimeoEmbedSrc(id, params)
    if (platform === 'youtube') return getYouTubeEmbedSrc(id, params)
    if (platform === 'deezer') return getDeezerEmbedSrc(id, params)
    if (platform === 'spotify') return getSpotifyEmbedSrc(id, params)
    if (platform === 'soundcloud') return getSoundcloudEmbedSrc(id, params)
    if (platform === 'dailymotion') return getDailymotionEmbedSrc(id, params)
    if (platform === 'ted') return getTedEmbedSrc(id, params)
    if (platform === 'twitch') return getTwitchEmbedSrc(id, params)
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
    return getEmbedUrl(`https://w.soundcloud.com/player/`, {
        ...params,
        url: id,
    })
}

export function getDailymotionEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://geo.dailymotion.com/player.html`, {
        ...params,
        video: id,
    })
}

export function getTedEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://embed.ted.com/talks/${id}`, params)
}

export function getTwitchEmbedSrc(id: string, params: Record<string, string> = {}): string {
    return getEmbedUrl(`https://player.twitch.tv/`, {
        ...params,
        video: id,
        branding: '0',
    })
}

export function getEmbedUrl(url: string, params: Record<string, string> = {}) {
    const encodedParams = encodeUrlParams(params)

    if (encodedParams.length) url += '?' + encodedParams

    return url
}
