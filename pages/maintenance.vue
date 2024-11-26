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
            <a
                :class="$style.link"
                :href="homePageUrl"
            >
                <span :class="$style.link__label">{{ $t('refresh_page') }}</span>
                <SvgIcon
                    :class="$style.link__icon"
                    height="24"
                    name="refresh"
                    width="24"
                />
            </a>
        </main>
    </div>
</template>

 <style lang="scss" module>
 @use 'assets/scss/mixins/v-button' as *;
 @use "assets/scss/functions/rem" as *;
 @use "assets/scss/variables/v-button" as *;
 @use "assets/scss/variables/v-button-emphasis" as *;

 .link {
     @include v-button-css-vars($v-button-high-emphasis);

     display: flex;
     align-items: center;
     gap: rem(6);
 }

 .link__label {
     @include v-button-css-vars($v-button-high-emphasis-label, 'label');
 }

 .link__icon {
     @include v-button-css-vars($v-button-high-emphasis-icon, 'icon');
 }
 </style>
