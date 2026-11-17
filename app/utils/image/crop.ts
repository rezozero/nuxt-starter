export interface CropRatio {
    width: number
    height: number
}

// Intervention Request reads `crop` (`344x220`) as an aspect ratio, never as a pixel box.
export function parseCrop(crop?: unknown): CropRatio | undefined {
    if (typeof crop !== 'string') return

    const [width, height] = crop.split('x').map(value => parseInt(value, 10))

    return width && height ? { width, height } : undefined
}

/**
 * The largest box of the crop ratio that fits in `width` × `height`: what Intervention Request
 * delivers for that crop, since it never upscales.
 */
export function fitCrop(crop: CropRatio, width?: number, height?: number): [number, number] | undefined {
    const ratio = crop.width / crop.height

    if (width && height) {
        return width / height > ratio
            ? [Math.round(height * ratio), height]
            : [width, Math.round(width / ratio)]
    }

    if (width) return [width, Math.round(width / ratio)]
    if (height) return [Math.round(height * ratio), height]
}
