<script  lang="ts" setup>
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Link extended (title wrapper link above card)">
            <VCard
                title="Card title"
                content="Card content"
                :image="image"
                link-label="Link label"
                url="/page-path"
                link-extended
                :class="$style.card"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.card {
    --v-card-grid-template-areas:
        'image .'
        'image title'
        'image content'
        'image cta'
        'image .';

    min-width: 600px;
    column-gap: 30px;
    grid-template-columns: 1fr 1fr;
}
</style>
