import type { Slots, VNode, VNodeNormalizedChildren } from 'vue'
import type { VNodeChild } from '@vue/runtime-core'

function getChildNodeText(childNode: VNodeNormalizedChildren): string | string[] | undefined {
    if (!childNode) return
    else if (typeof childNode === 'string') return childNode
    else if (Array.isArray(childNode)) return childNode.filter(n => !!n).map(vNodeArrayChildren => getNode(vNodeArrayChildren)).join(' ')
}

function getNode(node: VNodeChild): string | string[] | undefined {
    if (!node) return
    else if (typeof node === 'string') return node
    else if (typeof node === 'object' && 'children' in node && node.children?.length) return getChildNodeText(node.children)
    return
}

function getNodeInnerText(node: VNode | Slots) {
    const innerSlotsChildren = isSlots(node.children) && getNamedSlots(node.children)

    if (!node) return
    else if (innerSlotsChildren) return getChildNodeText(innerSlotsChildren)
    else if (node.children?.length) return getChildNodeText(node.children as VNodeNormalizedChildren)
}

function isSlots(item: unknown): item is Slots {
    return !!(!!item && typeof item === 'object' && ((item as { default: () => void })?.['default']?.()))
}

function getNamedSlots(slots: Slots, name = 'default') {
    const slot = slots[name]?.()

    if (!slot || !slot.length) return

    return slot
}

export function getSlotsInnerText(slots: Slots, name = 'default') {
    const slot = getNamedSlots(slots, name)
    if (!slot) return ''

    return slot.map((slot) => {
        return getNodeInnerText(slot)
    }).join(' ')
}
