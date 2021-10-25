import store from '@/store'
import Node from './Node'
   
const rootNode = new Node({
    name: 'targetData',
    type: 'root'
})
rootNode.renderSlots.default = store.getters['drag/targetData']
// rootNode.setRenderSlots(store.getters['drag/targetData'])

export default function () {
    return rootNode
}
