<script lang="ts" setup>
import type { HydraCollection } from '@roadiz/types'
import DataObserver from '~/utils/data-observer'
import type { NSAlert } from '~~/types/roadiz'

const id = useId()
const ALERT_LIST_STORAGE_ID = `${id}-alert-list`

const roadizFetch = useRoadizFetchFactory()
let dataObserver: DataObserver | null = null

const alertList = ref<NSAlert[]>([])

async function fetchAlerts(): Promise<void> {
    const response = await roadizFetch<HydraCollection<NSAlert>>('/alerts', {
        params: {
            'publishedAt[before]': 'now',
            'unpublishedAt[after]': 'now',
            'order[publishedAt]': 'asc',
            'node.visible': 1,
        },
    })
    const newAlertList = response?.['hydra:member']

    if (!alertList.value.length && !newAlertList?.length) return

    const storedAlertList = window.localStorage.getItem(ALERT_LIST_STORAGE_ID)
    const closedAlertList = storedAlertList && JSON.parse(storedAlertList)

    alertList.value = closedAlertList
        ? (newAlertList as NSAlert[])?.filter((alert: NSAlert) => !closedAlertList.includes(alert['@id']))
        : newAlertList || []
}

onMounted(() => {
    dataObserver = new DataObserver(fetchAlerts, {
        interval: 60000,
        startDelay: 0,
        backgroundInterval: 600000,
    })

    dataObserver.observe()
})

onUnmounted(() => {
    dataObserver?.disconnect()
    dataObserver = null
})

function close(alert: NSAlert) {
    const storedAlertList = window.localStorage.getItem(ALERT_LIST_STORAGE_ID)
    const alertListToStore = storedAlertList ? JSON.parse(storedAlertList) : []

    if (!alertListToStore.includes(alert['@id'])) {
        alertListToStore.push(alert['@id'])
    }

    alertList.value = alertList.value.filter(alert => !alertListToStore.includes(alert['@id']))

    window.localStorage.setItem(ALERT_LIST_STORAGE_ID, JSON.stringify(alertListToStore))
}
</script>

<template>
    <div
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions removals"
    >
        <template v-if="alertList.length">
            <LazyVRoadizAlert
                v-for="alert in alertList"
                :key="alert['@id']"
                :alert="alert"
                @close="close"
            />
        </template>
    </div>
</template>
