import LC from '@/element-materials/core'

export default function () {
    return () => {
        const activeNode = LC.getActiveNode()
        activeNode.setStyle('height', '')
    }
}
