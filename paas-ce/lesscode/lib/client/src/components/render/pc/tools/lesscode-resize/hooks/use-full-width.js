import LC from '@/element-materials/core'

export default function () {
    return () => {
        const activeNode = LC.getActiveNode()
        if (activeNode.parentNode.type === 'free-layout') {
            activeNode.setStyle({
                right: '0',
                left: '0',
                width: ''
            })
        } else {
            activeNode.setStyle('width', '100%')
        }
    }
}
