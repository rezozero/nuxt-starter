import { describe, expect, it } from 'vitest'
import { getErrorStatus, isIgnoredAppError } from '../app/utils/sentry/error-status'

describe('getErrorStatus', () => {
    it('reads `status` or `statusCode` on any object', () => {
        expect(getErrorStatus({ status: 404 })).toBe(404)
        expect(getErrorStatus({ statusCode: 500 })).toBe(500)
        expect(getErrorStatus(Object.assign(new Error('x'), { statusCode: 422 }))).toBe(422)
    })

    it('prefers `status` over `statusCode`', () => {
        expect(getErrorStatus({ status: 404, statusCode: 500 })).toBe(404)
    })

    it('returns undefined without a numeric status', () => {
        expect(getErrorStatus(null)).toBeUndefined()
        expect(getErrorStatus('404')).toBeUndefined()
        expect(getErrorStatus({ status: '404' })).toBeUndefined()
        expect(getErrorStatus(new Error('x'))).toBeUndefined()
    })
})

describe('isIgnoredAppError', () => {
    it('ignores redirects and client errors', () => {
        expect(isIgnoredAppError({ statusCode: 301 })).toBe(true)
        expect(isIgnoredAppError({ statusCode: 404 })).toBe(true)
        expect(isIgnoredAppError({ status: 499 })).toBe(true)
    })

    it('keeps server errors and errors without status', () => {
        expect(isIgnoredAppError({ statusCode: 200 })).toBe(false)
        expect(isIgnoredAppError({ statusCode: 500 })).toBe(false)
        expect(isIgnoredAppError(new Error('x'))).toBe(false)
        expect(isIgnoredAppError(undefined)).toBe(false)
    })
})
