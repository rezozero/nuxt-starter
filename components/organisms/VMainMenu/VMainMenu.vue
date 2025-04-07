<script lang="ts" setup>
import type { NSMenuLink } from '~/types/roadiz'

const isOpen = defineModel<boolean>('open')

const commonContent = useCommonContent()
const mainMenuWalker = computed(() => commonContent.value?.menus?.mainMenuWalker)
const route = useRoute()

watch(
    () => route.fullPath,
    () => {
        isOpen.value = false
    },
)
</script>

<template>
    <VModal
        v-model="isOpen"
        align="right"
    >
        <nav>
            <ul v-if="mainMenuWalker?.children">
                <li
                    v-for="child in mainMenuWalker.children"
                    :key="child.item?.['@id']"
                >
                    <VRoadizLink
                        v-if="
                            (child.item as NSMenuLink)?.linkExternalUrl
                                || (child.item as NSMenuLink)?.linkInternalReference
                        "
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
    </VModal>
</template>

<!-- <style lang="scss" module> -->
<!-- </style> -->
