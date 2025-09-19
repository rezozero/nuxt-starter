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
            :element-class="{
                overtitle: $style.overtitle,
                title: $style.title,
                content: $style.content,
                image: $style['image-wrapper'],
                cta: $style.cta,
                link: $style.link,
            }"
        >
            <template #image="{ itemClass }">
                <div :class="itemClass">
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

.overtitle {
    margin-top: 14px;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin-block: 14px 0;
}

.link {
    color: currentcolor;
    text-decoration: none;
}

.content {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 22px;
    -webkit-box-orient: vertical;
    font-size: 16px;
    -webkit-line-clamp: 3;
    line-height: 1.4;
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

.cta {
    margin-top: 32px;
    gap: 4px;
    width: fit-content;
}
</style>
