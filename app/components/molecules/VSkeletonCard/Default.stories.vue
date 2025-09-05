<script lang="ts" setup>
import image from '~/assets/stories/fixtures/documents/image-01.json'

const skeletonEnabled = ref(true)

const cardProps = {
    overtitle: 'This is an overtitle',
    title: 'Card title',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur esse soluta, doloremque saepe ullam consequuntur quidem, repudiandae recusandae, hic labore eveniet magni sed dolorem. Ipsa, nostrum! Temporibus cumque perspiciatis iure. Ex molestias architecto minus voluptatum est animi velit error cumque?',
    image,
    linkLabel: 'Link label',
    url: '/page-path',
    linkExtended: true,
}
</script>

<template>
    <NuxtStory>
        <template #aside>
            <button @click="skeletonEnabled = !skeletonEnabled">
                Toggle skeleton
            </button>
        </template>
        <NuxtStoryVariant title="Without content">
            <VSkeletonCard
                :class="$style.card"
                :enabled="skeletonEnabled"
                v-bind="cardProps"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="With content">
            <VSkeletonCard
                :class="$style.card"
                :enabled="skeletonEnabled"
                v-bind="cardProps"
            >
                <template #title="{ itemClass }">
                    <div :class="itemClass">
                        My title
                    </div>
                </template>
            </VSkeletonCard>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.card {
    width: 500px;
}
</style>
