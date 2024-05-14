<script setup lang="ts">
import audio from '~/assets/stories/fixtures/documents/audio-01.json'
import deezer from '~/assets/stories/fixtures/documents/deezer-01.json'
import soundcloud from '~/assets/stories/fixtures/documents/soundcloud-01.json'
import spotify from '~/assets/stories/fixtures/documents/spotify-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Native">
            <VRoadizAudio :document="audio" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Deezer">
            <VRoadizAudio :document="deezer" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Soundcloud">
            <VRoadizAudio :document="soundcloud" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Spotify">
            <VRoadizAudio :document="spotify" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
