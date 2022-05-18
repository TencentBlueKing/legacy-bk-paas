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
        if (!document.body.querySelector('#drawTarget')) {
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
            if (!document.body.querySelector('#drawTarget')) {
                return
            }
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

    const componentDragStartCallbak = () => {
        callbak()
    }

    const componentDragEndCallbak = () => {
        callbak(componentData.value)
    }

    const activeResizeObserver = new ResizeObserver(updateCallbak)

    LC.addEventListener('componentHover', componentHoverCallback)
    LC.addEventListener('update', updateCallbak)
    LC.addEventListener('componentMouserleave', componentMouserleaveCallback)
    LC.addEventListener('reset', resetCallback)
    LC.addEventListener('componentDragStart', componentDragStartCallbak)
    LC.addEventListener('componentDragEnd', componentDragEndCallbak)
    
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
        LC.removeEventListener('componentDragStart', componentDragStartCallbak)
        LC.removeEventListener('componentDragEnd', componentDragEndCallbak)
    })

    return {
        hoverComponentData: componentData
    }
}
