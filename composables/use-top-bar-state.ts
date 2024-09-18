export function useTopBarState() {
    const isHidden = useState('topBarIsHidden', () => false)
    const isOnPageTop = useState('topBarIsOnPageTop', () => false)

    return { isHidden, isOnPageTop }
}
