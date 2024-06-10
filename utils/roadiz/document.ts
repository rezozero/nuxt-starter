import type { RoadizDocument } from '@roadiz/types'

export function isMp4(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'video/mp4'
}

export function isSvg(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'image/svg+xml'
}

export function isEmbed(document: RoadizDocument | undefined): boolean {
    return typeof document?.embedId !== 'undefined'
}

export function isVideoEmbed(document: RoadizDocument | undefined): boolean {
    const videoPlatforms = ['vimeo', 'youtube', 'dailymotion', 'ted', 'twitch']
    const platform = document?.embedPlatform?.toLowerCase()
    return isEmbed(document) && !!platform && videoPlatforms.includes(platform)
}

export function isVideo(document: RoadizDocument | undefined): boolean {
    return isVideoEmbed(document) || isMp4(document)
}

export function isImage(document: RoadizDocument | undefined): boolean {
    return document?.processable === true || isSvg(document)
}

export function isPDF(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'application/pdf'
}

export function isAudio(document: RoadizDocument | undefined): boolean {
    const platform = document?.embedPlatform?.toLowerCase()
    return (
        document?.mimeType === 'audio/mpeg' ||
        document?.mimeType === 'audio/mp3' ||
        (isEmbed(document) && !!platform && ['deezer', 'spotify', 'soundcloud'].includes(platform))
    )
}

export function isDocument(document: RoadizDocument | undefined): boolean {
    return !isAudio(document) && !isImage(document) && isEmbed(document) && !isVideo(document)
}
