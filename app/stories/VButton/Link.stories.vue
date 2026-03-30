<script lang="ts" setup>
import { joinURL } from 'ufo'

const siteUrl = useRuntimeConfig().public?.site.url
const router = useRouter()
const firstRoute = router.options.routes[0]

// Cons to use useLink in VButton:
// - Can't extract RouterLink.props type easily (and prop 'to' is required)
// - When external link passed, route object isn't correct
// - throw error when 'to' prop is nullish and when route name used isn't defined
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VButton
                label="Home"
                to="/"
                icon-name="arrow-right"
            />
            <VButton
                label="Relative link"
                to="/path"
                icon-name="arrow-right"
            />
            <VButton
                label="absolute link with same siteUrl"
                :to="joinURL(siteUrl, '/path')"
                icon-name="arrow-right"
            />
            <VButton
                label="RouteLocationPathRaw link"
                :to="{ path: '/static-page-name' }"
                icon-name="arrow-right"
            />
            <VButton
                label="external link"
                to="https://google.com"
                icon-name="arrow-right"
            />
            <VButton
                :label="`Route ${firstRoute.name?.toString()}`"
                :to="firstRoute"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
