<script  lang="ts" setup>
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory>
        <VCard
            title="Card title"
            content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur esse soluta, doloremque saepe ullam consequuntur quidem, repudiandae recusandae, hic labore eveniet magni sed dolorem. Ipsa, nostrum! Temporibus cumque perspiciatis iure. Ex molestias architecto minus voluptatum est animi velit error cumque?"
            :image="image"
            link-label="Link label"
            url="/page-path"
            overtitle="My overtitle"
            :link-extended="false"
            :class="$style.card"
            :ui="{
                overtitle: $style.overtitle,
                title: $style.title,
                content: $style.content,
                image: $style.image,
                cta: $style.cta,
            }"
        >
            <template #image="{ itemClass }">
                <VRoadizImage
                    :class="itemClass"
                    :document="image"
                    crop="500x500"
                />
            </template>
        </VCard>
    </NuxtStory>
</template>

<style lang="scss" module>
.card {
    width: clamp(200px, 100%, 700px);
}

.overtitle {
    margin-top: 14px;
}

.title {
    margin-top: 14px;
    font-size: 24px;
    font-weight: bold;
}

.content {
    margin-top: 22px;
    font-size: 16px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

.image {
}

.cta {
    margin-top: 32px;
    gap: 4px;
}
</style>
