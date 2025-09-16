<script  lang="ts" setup>
import image from '~/assets/stories/fixtures/documents/image-01.json'

const cardProps = {
    overtitle: 'Overtitle example',
    title: 'Card title',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur esse soluta, doloremque saepe ullam consequuntur quidem, repudiandae recusandae, hic labore eveniet magni sed dolorem. Ipsa, nostrum! Temporibus cumque perspiciatis iure. Ex molestias architecto minus voluptatum est animi velit error cumque?',
    image,
    linkLabel: 'Link label',
    url: '/page-path',
    linkExtended: 'false',
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default (elements wrapped by link)">
            <VCard
                v-bind="cardProps"
                :link-extended="false"
                :class="$style.card"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Link extended (link wrapper above card)">
            <VCard
                v-bind="cardProps"
                link-extended
                :class="$style.card"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.card {
    width: clamp(200px, 100%, 700px);
}
</style>
