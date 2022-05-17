import {
    shallowRef,
    onMounted,
    onBeforeUnmount
} from '@vue/composition-api'
import _ from 'lodash'
import LC from '@/element-materials/core'

export default function (callbak) {
    const componentData = shallowRef({})
    let $drawTarget = null

    const activeCallback = (event) => {
        if (event.target.componentId === componentData.value.componentId) {
            return
        }
        componentData.value = event.target
        callbak(event.target)
        hoverResizeObserver.observe($drawTarget)
    }
    
    const updateCallbak = _.throttle(() => {
        if (!componentData.value.componentId) {
            return
        }
        setTimeout(() => {
            callbak(componentData.value)
        })
    }, 100)

    const activeClearCallback = () => {
        if (componentData.value.componentId) {
            componentData.value = {}
            callbak()
            hoverResizeObserver.unobserve($drawTarget)
        }
    }

    const resetCallback = () => {
        callbak()
        hoverResizeObserver.unobserve($drawTarget)
    }

    const componentDragStartCallbak = () => {
        callbak()
    }

    const componentDragEndCallbak = () => {
        callbak(componentData.value)
    }

    LC.addEventListener('active', activeCallback)
    LC.addEventListener('update', updateCallbak)
    LC.addEventListener('activeClear', activeClearCallback)
    LC.addEventListener('reset', resetCallback)
    LC.addEventListener('componentDragStart', componentDragStartCallbak)
    LC.addEventListener('componentDragEnd', componentDragEndCallbak)
    
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
        LC.removeEventListener('componentDragStart', componentDragStartCallbak)
        LC.removeEventListener('componentDragEnd', componentDragEndCallbak)
    })

    return {
        activeComponentData: componentData
    }
}
