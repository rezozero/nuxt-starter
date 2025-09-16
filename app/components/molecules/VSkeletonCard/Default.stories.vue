<script lang="ts" setup>
import image from '~/assets/stories/fixtures/documents/image-01.json'

const skeletonEnabled = ref(true)
const $style = useCssModule()
const cardProps = {
    overtitle: 'This is an overtitle',
    title: 'Card title',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur esse soluta, doloremque saepe ullam consequuntur quidem, repudiandae recusandae, hic labore eveniet magni sed dolorem. Ipsa, nostrum! Temporibus cumque perspiciatis iure. Ex molestias architecto minus voluptatum est animi velit error cumque?',
    image: image,
    linkLabel: 'Link label',
    url: '/page-path',
    linkExtended: false,
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
                :card-props="cardProps"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="With slot content">
            <VSkeletonCard
                :class="[$style.card]"
                :enabled="skeletonEnabled"
                :card-props="skeletonEnabled ? undefined : cardProps"
                :style="{ '--v-skeleton-card-image-aspect-ratio': 500 / 200 }"
            >
                <template
                    v-if="!skeletonEnabled"
                    #title="{ itemClass }"
                >
                    <div :class="itemClass">
                        {{ cardProps.title }}
                    </div>
                </template>
                <template
                    v-if="!skeletonEnabled"
                    #image="{ itemClass }"
                >
                    <VRoadizImage
                        :class="itemClass"
                        :document="cardProps.image"
                        crop="500x200"
                    />
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
