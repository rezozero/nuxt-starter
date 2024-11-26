<script  lang="ts" setup>
// // To use app components, ensure that they are not ignored in nuxt.config during pre-rendering build

definePageMeta({
    layout: false,
})

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
            <VButton
                :label="$t('refresh_page')"
                emphasis="primary"
                icon-name="refresh"
                onclick="window.location.reload()"
            />
        </main>
    </div>
</template>

<!-- <style lang="scss" module></style> -->
