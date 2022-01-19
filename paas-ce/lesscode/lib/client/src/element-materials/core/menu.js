import Vue from 'vue'
import Menu from './widget/menu'
import getActiveNode from './get-active-node'
let instance = null

export const showMenu = (domEevent) => {
    domEevent.preventDefault()
    clearMenu()
    const activeNode = getActiveNode()
    console.log('from show menu = = = = ', activeNode)
    if (activeNode) {
        instance = new Vue({
            render (h) {
                return (
                    <Menu
                        componentId={activeNode.componentId}
                        left={domEevent.pageX}
                        top={domEevent.pageY} />
                )
            }
        }).$mount()
        document.body.appendChild(instance.$el)
    }
}

export const clearMenu = () => {
    if (instance) {
        document.body.removeChild(instance.$el)
        instance.$destroy()
        instance = null
    }
}
