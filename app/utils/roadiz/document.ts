import type { RoadizDocument } from '@roadiz/types'

export function isMp4(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'video/mp4'
}

export function isSvg(document: RoadizDocument | undefined): boolean {
    return document?.mimeType === 'image/svg+xml'
}

// Formats that commonly carry an alpha channel: an average color placeholder would show through.
// WebP and AVIF are deliberately left out: they are mostly used for opaque photos, where the placeholder is useful.
const TRANSPARENT_MIME_TYPES = ['image/png', 'image/svg+xml', 'image/gif']

export function supportsTransparency(document: RoadizDocument | undefined): boolean {
    return !!document?.mimeType && TRANSPARENT_MIME_TYPES.includes(document.mimeType)
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
        document?.mimeType === 'audio/mpeg'
        || document?.mimeType === 'audio/mp3'
        || (isEmbed(document) && !!platform && ['deezer', 'spotify', 'soundcloud'].includes(platform))
    )
}

export function isDocument(document: RoadizDocument | undefined): boolean {
    return !isAudio(document) && !isImage(document) && isEmbed(document) && !isVideo(document)
}
