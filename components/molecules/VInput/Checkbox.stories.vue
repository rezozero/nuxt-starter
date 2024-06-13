<script lang="ts" setup>
const route = useRoute()
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Default">
            <VInput :class="$style.item" label="Lorem ipsum" type="checkbox" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Required">
            <form :action="route.path" :class="$style.item">
                <VInput label="Lorem ipsum" required type="checkbox" />
                <button>Submit</button>
            </form>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Long label">
            <VInput
                :class="$style.item"
                label="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi aperiam assumenda autem consectetur cum cumque dolor magni, minus molestiae nemo quam vel veniam. Eaque enim quas quia. Atque exercitationem nihil repellendus rerum sint, velit veritatis? Corporis eaque id libero!"
                required
                type="checkbox"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    input,
    button {
        // Normalize.scss file remove default tooltip required validation
        all: revert;
    }
}

.item {
    width: 100%;
}
</style>
