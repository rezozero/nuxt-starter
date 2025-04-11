<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'

const { error } = defineProps<{
    error: NuxtError
}>()

// Home page
const route = useRoute()
const { homePagePath } = useHomePage()
const isHomePage = computed(() => homePagePath.value === route.path)

// Error page data from API
const { data } = useCommonContent()
const errorPage = computed(() => data.value?.errorPage)

// No current page
useCurrentPage().value = {}

const isServerError = computed(() => String(error.statusCode)?.startsWith('5')) // 50x errors

// Content
const { t } = useI18n()
const title = computed(() => {
    if (error.statusCode === 404) {
        const pageTitle = errorPage.value?.item?.title

        if (pageTitle) return pageTitle

        return t('error_page.not_found_title')
    }

    if (error.statusCode === 401) return t('error_page.unauthenticated_user_error_title')

    if (error.statusCode === 403) return t('error_page.unauthorized_access_error_title')

    if (isServerError.value) return t('error_page.server_error_title')

    return t('error_page.fallback_title')
})

const blocks = computed(() => {
    return errorPage.value?.children || []
})

useHead({
    title: title.value,
})

function reloadPage() {
    window.location.reload()
}
</script>

<template>
    <NuxtLayout>
        <div>
            <h1 v-if="title">
                {{ title }}
            </h1>
            <VButton
                v-if="!isHomePage"
                :href="homePagePath"
                :label="t('error_page.back_home')"
            />
            <VButton
                v-else
                :label="t('error_page.refresh_page')"
                @click="reloadPage"
            />
            <LazyVRoadizBlockFactory
                v-if="blocks?.length"
                :blocks="blocks"
            />
        </div>
    </NuxtLayout>
</template>

<!-- <style lang="scss" module></style> -->
