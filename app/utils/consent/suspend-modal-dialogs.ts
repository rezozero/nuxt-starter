// close() fires a `close` event even when the dialog is reopened right after: its owner
// would take it for a dismissal (and unmount it, for instance)
function reopen(dialog: HTMLDialogElement, modal: boolean) {
    dialog.addEventListener('close', event => event.stopImmediatePropagation(), { capture: true, once: true })
    dialog.close()

    if (modal) dialog.showModal()
    else dialog.show()
}

// A CMP popup is a plain fixed-position element appended to <body>. A native <dialog> opened
// with showModal() renders in the browser's top layer, above any z-index, and would hide the
// popup (a video asking for consent inside the media viewer). Open dialogs are taken out of
// modal mode until the returned function puts them back.
export function suspendModalDialogs(): () => void {
    const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>('dialog[open]'))
        .filter(dialog => dialog.matches(':modal'))

    dialogs.forEach(dialog => reopen(dialog, false))

    // A dialog closed by the visitor meanwhile stays closed
    return () => dialogs
        .filter(dialog => dialog.isConnected && dialog.open)
        .forEach(dialog => reopen(dialog, true))
}
