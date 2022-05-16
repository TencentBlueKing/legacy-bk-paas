import {
    shallowRef,
    onMounted,
    onBeforeUnmount
} from '@vue/composition-api'
import _ from 'lodash'
import LC from '@/element-materials/core'

export default function (callbak) {
    let $drawTarget = null

    const componentData = shallowRef({})

    const componentHoverCallback = _.throttle((event) => {
        if (event.target.componentId === componentData.value.componentId) {
            return
        }
        componentData.value = event.target
        callbak(event.target)
        activeResizeObserver.observe($drawTarget)
    }, 100)

    const updateCallbak = _.throttle(() => {
        if (!componentData.value.componentId) {
            return
        }
        setTimeout(() => {
            callbak(componentData.value)
        })
    }, 100)

    const componentMouserleaveCallback = () => {
        if (componentData.value.componentId) {
            componentData.value = {}
            callbak()
            activeResizeObserver.unobserve($drawTarget)
        }
    }

    const resetCallback = () => {
        callbak()
        activeResizeObserver.unobserve($drawTarget)
    }

    const activeResizeObserver = new ResizeObserver(updateCallbak)

    LC.addEventListener('componentHover', componentHoverCallback)
    LC.addEventListener('update', updateCallbak)
    LC.addEventListener('componentMouserleave', componentMouserleaveCallback)
    LC.addEventListener('reset', resetCallback)
    
    onMounted(() => {
        $drawTarget = document.body.querySelector('#drawTarget')
        activeResizeObserver.observe($drawTarget)
    })
    
    onBeforeUnmount(() => {
        activeResizeObserver.unobserve($drawTarget)
        LC.removeEventListener('componentHover', componentHoverCallback)
        LC.removeEventListener('update', updateCallbak)
        LC.removeEventListener('componentMouserleave', componentMouserleaveCallback)
        LC.removeEventListener('reset', resetCallback)
    })

    return {
        hoverComponentData: componentData
    }
}
