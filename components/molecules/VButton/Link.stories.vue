<script lang="ts" setup>
const router = useRouter()
const firstRoute = router.options.routes[0]
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VButton label="Relative link" to="/path" outlined icon-name="arrow-line-right" />
            <VButton
                label="RouteLocationPathRaw link"
                :to="{ path: '/static-page-name' }"
                outlined
                icon-name="arrow-line-right"
            />
            <VButton label="external link" to="https://google.com" icon-name="arrow-line-right" outlined />
            <VButton :label="`Route ${firstRoute.name?.toString()}`" :to="firstRoute" outlined />
            <VButton label="Undefined named route" :to="{ name: 'unknown route' }" outlined />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
