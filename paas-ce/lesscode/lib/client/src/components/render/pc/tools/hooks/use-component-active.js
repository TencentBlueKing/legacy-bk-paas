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

    const activeResizeObserver = new ResizeObserver(resizeObserverCallback)

    const activeCallback = (event) => {
        if (event.target.componentId === componentData.value.componentId) {
            return
        }
        componentData.value = event.target
        activeResizeObserver.observe(event.target.$elm)
        callbak(event.target)
    }
    
    const activeClearCallback = () => {
        if (componentData.value.componentId) {
            activeResizeObserver.unobserve(componentData.value.$elm)
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

    LC.addEventListener('active', activeCallback)
    LC.addEventListener('activeClear', activeClearCallback)
    LC.addEventListener('removeChild', removeChildCallbak)
    LC.addEventListener('reset', resetCallback)
    
    onBeforeUnmount(() => {
        LC.removeEventListener('active', activeCallback)
        LC.removeEventListener('activeClear', activeClearCallback)
        LC.removeEventListener('removeChild', removeChildCallbak)
        LC.removeEventListener('reset', resetCallback)
    })

    return {
        activeComponentData: componentData
    }
}
