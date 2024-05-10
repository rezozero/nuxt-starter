<script setup lang="ts">
import audio from '~/assets/stories/fixtures/documents/audio-01.json'
import deezer from '~/assets/stories/fixtures/documents/deezer-01.json'
import soundcloud from '~/assets/stories/fixtures/documents/soundcloud-01.json'
import spotify from '~/assets/stories/fixtures/documents/spotify-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Native">
            <VAudio :document="audio" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Deezer">
            <VAudio :document="deezer" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Soundcloud">
            <VAudio :document="soundcloud" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Spotify">
            <VAudio :document="spotify" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
