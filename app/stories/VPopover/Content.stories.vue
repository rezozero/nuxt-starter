<template>
    <NuxtStory>
        <VPopoverContent
            label="Label"
            open
            class="$style.root"
        >
            <div class="$style.item">
                Content
            </div>
        </VPopoverContent>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    margin: 0 auto;
}

.item {
    min-width: 300px;
    padding-bottom: 40px;
}
</style>
