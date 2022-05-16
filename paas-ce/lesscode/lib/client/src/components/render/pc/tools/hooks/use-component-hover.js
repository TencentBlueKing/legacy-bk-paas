import {
    shallowRef,
    onMounted,
    onBeforeUnmount
} from '@vue/composition-api'
import _ from 'lodash'
import LC from '@/element-materials/core'

export default function (callbak) {
    const componentData = shallowRef({})

    const componentHoverCallback = _.throttle((event) => {
        if (event.target.componentId === componentData.value.componentId) {
            return
        }
        componentData.value = event.target
        callbak(event.target)
    }, 100)

    const updateCallbak = _.throttle(() => {
        setTimeout(() => {
            callbak(componentData.value)
        })
    }, 100)

    const componentMouserleaveCallback = () => {
        if (componentData.value.componentId) {
            componentData.value = {}
            callbak()
        }
    }

    const resetCallback = () => {
        callbak()
    }

    LC.addEventListener('componentHover', componentHoverCallback)
    LC.addEventListener('update', updateCallbak)
    LC.addEventListener('componentMouserleave', componentMouserleaveCallback)
    LC.addEventListener('reset', resetCallback)

    let $drawTarget = null
    const activeResizeObserver = new ResizeObserver(updateCallbak)
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
