<script lang="ts" setup>
const wrapperEl = ref<HTMLElement>()
const { items } = useLoadMore({ url: '/events', element: wrapperEl })
console.log(items)
</script>

<template>
    <NuxtStory>
        <div ref="wrapperEl" :class="$style.root">
            <div v-for="(item, i) in items" :key="i">{{ i }} || item</div>
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
}
</style>
