<script setup lang="ts">
const { token, reset: resetPreview } = useRoadizPreview()

const jwt = computed(() => {
    let decodedBase64

    if (!token.value) {
        return null
    }

    const base64Url = token.value.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    if (typeof window !== 'undefined' && typeof window.atob !== 'undefined') {
        decodedBase64 = window.atob(base64)
    } else {
        decodedBase64 = Buffer.from(base64, 'base64').toString()
    }

    const jsonPayload = decodeURIComponent(
        decodedBase64
            .split('')
            .map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join(''),
    )

    return JSON.parse(jsonPayload)
})

const remainingTime = computed(() => {
    return new Date((jwt.value?.exp || 0) * 1000)
})

const router = useRouter()
const route = useRoute()
function stopPreview() {
    resetPreview()

    router.push({ path: route.path, query: { ...route.query, _preview: undefined, token: undefined } })
}
</script>

<template>
    <div v-if="jwt" :class="$style.root">
        <div :class="$style.user">Previewing as: {{ jwt.username }}</div>
        <div>Expire at: {{ remainingTime }}</div>
        <button :class="$style.button" @click.prevent="stopPreview">Stop previewing</button>
    </div>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 9999;
    right: 0;
    bottom: 0;
    display: block;
    max-width: 48ch;
    padding: 1em 1.5em 0.75em;
    border-radius: 3px 3px 0 0;
    background: #ffa600;
    font-size: 10px;
    line-height: 16px;
    opacity: 0.4;
}

.user {
    font-weight: bold;
}

.button {
    font-weight: bold;
}
</style>
