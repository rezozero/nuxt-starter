<script lang="ts" setup>
import type { NSMenuLink } from '~/types/roadiz'

defineProps<{
    open?: boolean
}>()

const { mainMenuWalker } = await useCommonContent()

// close on route change
const route = useRoute()

// watch(
//     () => route.fullPath,
//     () => {
//         closeSubNav()
//         closeMenuMobile()
//     },
// )
</script>

<template>
    <!--    <VModal :open="open"> -->
    <nav>
        <ul v-if="mainMenuWalker?.children">
            <li
                v-for="child in mainMenuWalker.children"
                :key="child.item?.['@id']"
            >
                <VRoadizLink
                    v-if="(child.item as NSMenuLink)?.linkExternalUrl || (child.item as NSMenuLink)?.linkInternalReference"
                    :url="(child.item as NSMenuLink)?.linkExternalUrl"
                    :reference="(child.item as NSMenuLink)?.linkInternalReference"
                >
                    {{ child.item?.title }}
                </VRoadizLink>
                <span v-else>{{ child.item?.title }}</span>
                <ul v-if="child.children">
                    <li
                        v-for="subChild in child.children"
                        :key="subChild.item?.['@id']"
                    >
                        <VRoadizLink
                            :url="(subChild.item as NSMenuLink)?.linkExternalUrl"
                            :reference="(subChild.item as NSMenuLink)?.linkInternalReference"
                        >
                            {{ subChild.item?.title }}
                        </VRoadizLink>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
<!--    </VModal> -->
</template>

<style lang="scss" module>
</style>
