<script setup lang="ts">
import audio from '~stories/assets/fixtures/documents/audio-01.json'
import deezer from '~stories/assets/fixtures/documents/deezer-01.json'
import soundcloud from '~stories/assets/fixtures/documents/soundcloud-01.json'
import spotify from '~stories/assets/fixtures/documents/spotify-01.json'
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
