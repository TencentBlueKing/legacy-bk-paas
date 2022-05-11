import {
    shallowRef,
    onMounted,
    onBeforeUnmount
} from '@vue/composition-api'
import _ from 'lodash'
import LC from '@/element-materials/core'

export default function (callbak) {
    const componentData = shallowRef({})

    const activeCallback = (event) => {
        if (event.target.componentId === componentData.value.componentId) {
            return
        }
        componentData.value = event.target
        callbak(event.target)
    }
    
    const updateCallbak = _.throttle(() => {
        setTimeout(() => {
            callbak(componentData.value)
        })
    }, 100)

    const activeClearCallback = () => {
        if (componentData.value.componentId) {
            componentData.value = {}
            callbak()
        }
    }

    const resetCallback = () => {
        callbak()
    }

    LC.addEventListener('active', activeCallback)
    LC.addEventListener('update', updateCallbak)
    LC.addEventListener('activeClear', activeClearCallback)
    LC.addEventListener('reset', resetCallback)
    
    let $drawTarget = null
    const hoverResizeObserver = new ResizeObserver(updateCallbak)
    onMounted(() => {
        $drawTarget = document.body.querySelector('#drawTarget')
        hoverResizeObserver.observe($drawTarget)
    })
    onBeforeUnmount(() => {
        hoverResizeObserver.unobserve($drawTarget)
        LC.removeEventListener('active', activeCallback)
        LC.removeEventListener('update', updateCallbak)
        LC.removeEventListener('activeClear', activeClearCallback)
        LC.removeEventListener('reset', resetCallback)
    })

    return {
        activeComponentData: componentData
    }
}
