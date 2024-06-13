<script setup lang="ts">
</script>

<template>
    <NuxtStory>
        <div :class="$style.root">
            <VVideoPlayer
                src="/stories/videos/01.mp4"
                width="640"
                height="264"
                background
                fit="cover"
                :class="$style.video"
            />
        </div>
    </NuxtStory>
</template>

<style module lang="scss">
.root {
    --v-player-width: 100%;
    --v-player-height: 100%;

    --v-player-height: 100%;
    --v-player-video-width: 100%;
    --v-player-video-height: 100%;

    width: 300px;
    height: 300px;
    border: 1px solid #000;
}

.video {

}
</style>
