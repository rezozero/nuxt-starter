<script  lang="ts" setup>
import image from '~/assets/stories/fixtures/documents/image-01.json'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default (elements wrapped by link)">
            <VCard
                title="Card title"
                content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur esse soluta, doloremque saepe ullam consequuntur quidem, repudiandae recusandae, hic labore eveniet magni sed dolorem. Ipsa, nostrum! Temporibus cumque perspiciatis iure. Ex molestias architecto minus voluptatum est animi velit error cumque?"
                :image="image"
                link-label="Link label"
                url="/page-path"
                :link-extended="false"
                :class="$style.card"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Link extended (link wrapper above card)">
            <VCard
                title="Card title"
                content="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas eius dolorem quibusdam adipisci temporibus id hic culpa rerum fugiat. Molestiae voluptas sit aliquid qui architecto, ea eius optio porro aperiam."
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
    width: clamp(200px, 100%, 700px);
}
</style>
