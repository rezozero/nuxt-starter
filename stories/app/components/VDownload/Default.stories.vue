<script lang="ts" setup>
import type { RoadizDocument } from '@roadiz/types'

const pdfDocument: RoadizDocument = {
    '@type': 'Document',
    '@id': '/api/documents/1',
    'filename': 'dossier_de_presse_2026.pdf',
    'mimeType': 'application/pdf',
    'name': 'Dossier de presse 2026',
    'alt': 'Dossier de presse 2026',
    'type': 'pdf',
    'relativePath': 'abc123/dossier_de_presse_2026.pdf',
    'processable': false,
    'filesize': 2457600,
} as unknown as RoadizDocument

const imageDocument: RoadizDocument = {
    '@type': 'Document',
    '@id': '/api/documents/2',
    'filename': 'photo_exposition.jpg',
    'mimeType': 'image/jpeg',
    'name': 'Photo exposition',
    'alt': 'Photo exposition',
    'type': 'image',
    'relativePath': 'def456/photo_exposition.jpg',
    'processable': true,
    'filesize': 524288,
} as unknown as RoadizDocument

const noLinkDocument: RoadizDocument = {
    '@type': 'Document',
    '@id': '/api/documents/3',
    'filename': 'fichier_sans_lien.pdf',
    'mimeType': 'application/pdf',
    'name': 'Fichier sans lien disponible',
    'alt': 'Fichier sans lien disponible',
    'type': 'pdf',
    'processable': false,
    'filesize': 102400,
} as unknown as RoadizDocument

const longNameDocument: RoadizDocument = {
    '@type': 'Document',
    '@id': '/api/documents/4',
    'filename': 'document_tres_long_nom.pdf',
    'mimeType': 'application/pdf',
    'name': 'Document avec un nom très long pour tester le comportement du composant avec le line-clamp et le texte tronqué',
    'alt': 'Document long name',
    'type': 'pdf',
    'relativePath': 'ghi789/document_tres_long_nom.pdf',
    'processable': false,
    'filesize': 10485760,
} as unknown as RoadizDocument
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="PDF">
            <VDownload :document="pdfDocument" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Image">
            <VDownload :document="imageDocument" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Custom label">
            <VDownload
                :document="pdfDocument"
                label="Télécharger le dossier de presse"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Long name (line clamp)">
            <VDownload :document="longNameDocument" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="No link (disabled)">
            <VDownload :document="noLinkDocument" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
