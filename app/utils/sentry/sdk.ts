// Named re-exports keep the lazy chunk small: `import('@sentry/nuxt')` would pull
// the whole SDK (Replay, feedback widget…).
export { captureException, init } from '@sentry/nuxt'
