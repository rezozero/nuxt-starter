import { describe, expect, it } from 'vitest'
import { pick } from '../app/utils/object/pick'

describe('pick', () => {
    it('copies only the given keys', () => {
        expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })

    it('keeps a key whose value is undefined', () => {
        const result = pick({ a: undefined, b: 2 }, ['a'])

        expect(result).toEqual({ a: undefined })
        expect('a' in result).toBe(true)
    })

    it('skips a key the object does not have', () => {
        expect('b' in pick({ a: 1 } as { a: number, b?: number }, ['b'])).toBe(false)
    })

    it('copies inherited keys, as lodash does', () => {
        const object = Object.create({ inherited: 1 }) as { inherited: number }

        expect(pick(object, ['inherited'])).toEqual({ inherited: 1 })
    })

    it('reads through a proxy, as Vue props are', () => {
        const props = new Proxy({ src: 'image.jpg', alt: undefined as string | undefined, loading: 'lazy' }, {})

        expect(pick(props, Object.keys({ src: null, alt: null }))).toEqual({ src: 'image.jpg', alt: undefined })
    })
})
