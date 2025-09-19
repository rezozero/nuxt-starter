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
            extend-link
            :class="$style.card"
        >
            <template #image>
                <div :class="$style['image-wrapper']">
                    <div :class="$style.tags">
                        <VTag
                            label="Mon tag 1"
                            :class="$style.tag"
                        />
                        <VTag
                            label="Mon tag 2"
                            :class="$style.tag"
                        />
                    </div>
                    <VRoadizImage
                        :class="$style.image"
                        :document="image"
                        crop="500x250"
                    />
                </div>
            </template>
        </VCard>
    </NuxtStory>
</template>

<style lang="scss" module>
.card {
    width: clamp(200px, 100%, 700px);
}

.image-wrapper {
    position: relative;
    width: 100%;
}

.tags {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    gap: 8px;
}

.image {
    display: block;
    width: 100%;
}
</style>
