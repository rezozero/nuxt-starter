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
                outlined
                icon-name="arrow-line-right"
            />
            <VButton
                label="Relative link"
                to="/path"
                outlined
                icon-name="arrow-line-right"
            />
            <VButton
                label="absolute link with same siteUrl"
                :to="joinURL(siteUrl, '/path')"
                outlined
                icon-name="arrow-line-right"
            />
            <VButton
                label="RouteLocationPathRaw link"
                :to="{ path: '/static-page-name' }"
                outlined
                icon-name="arrow-line-right"
            />
            <VButton
                label="external link"
                to="https://google.com"
                icon-name="arrow-line-right"
                outlined
            />
            <VButton
                :label="`Route ${firstRoute.name?.toString()}`"
                :to="firstRoute"
                outlined
            />
            <VButton
                label="Undefined named route"
                :to="{ name: 'unknown route' }"
                outlined
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
