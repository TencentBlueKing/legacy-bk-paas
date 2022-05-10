import {
    shallowRef,
    onBeforeUnmount
} from '@vue/composition-api'
import _ from 'lodash'
import LC from '@/element-materials/core'

export default function (callbak) {
    const componentData = shallowRef({})
    
    const resizeObserverCallback = _.throttle(() => {
        callbak(componentData.value)
    }, 100)
    const hoverResizeObserver = new ResizeObserver(resizeObserverCallback)

    const componentHoverCallback = _.throttle((event) => {
        if (event.target.componentId === componentData.value.componentId) {
            return
        }
        componentData.value = event.target
        hoverResizeObserver.observe(event.target.$elm)
        callbak(event.target)
    }, 100)

    const componentMouserleaveCallback = () => {
        if (componentData.value.componentId) {
            hoverResizeObserver.unobserve(componentData.value.$elm)
            componentData.value = {}
            callbak()
        }
    }

    const removeChildCallbak = (event) => {
        if (event.child === componentData.value) {
            callbak()
        }
    }

    const resetCallback = () => {
        callbak()
    }

    LC.addEventListener('componentHover', componentHoverCallback)
    LC.addEventListener('componentMouserleave', componentMouserleaveCallback)
    LC.addEventListener('removeChild', removeChildCallbak)
    LC.addEventListener('reset', resetCallback)
    
    onBeforeUnmount(() => {
        LC.removeEventListener('componentHover', componentHoverCallback)
        LC.removeEventListener('componentMouserleave', componentMouserleaveCallback)
        LC.removeEventListener('removeChild', removeChildCallbak)
        LC.removeEventListener('reset', removeChildCallbak)
    })

    return {
        hoverComponentData: componentData
    }
}
