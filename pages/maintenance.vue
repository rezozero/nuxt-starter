<script  lang="ts" setup>
// // To use app components, ensure that they are not ignored in nuxt.config during pre-rendering build
import { joinURL } from 'ufo'

definePageMeta({
    layout: false,
})

const { homePagePath } = await useHomePage()
const runtimeConfig = useRuntimeConfig()
const homePageUrl = joinURL(runtimeConfig.public.site.url, homePagePath.value)

defineI18nRoute(false)
</script>

<template>
    <div>
        <header>
            <h1>{{ $t('maintenance_page.title') }}</h1>
        </header>
        <main>
            <p>{{ $t('maintenance_page.body') }}</p>
            <hr>
            <VRoadizLinkButton
                :label="$t('refresh_page')"
                :url="homePageUrl"
                emphasis="primary"
            />
        </main>
    </div>
</template>

<!-- <style lang="scss" module></style> -->
