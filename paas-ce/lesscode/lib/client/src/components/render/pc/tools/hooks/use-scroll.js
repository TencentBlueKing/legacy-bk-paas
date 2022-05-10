import _ from 'lodash'
import {
    getCurrentInstance,
    onMounted
} from '@vue/composition-api'

export default function (callback) {
    const currentInstance = getCurrentInstance()
    onMounted(() => {
        const scrollCallback = _.throttle(callback, 20)
        const $horizontalWrapper = document.querySelector('#lesscodeDrawHorizontalWrapper')
        $horizontalWrapper.addEventListener('scroll', scrollCallback)
        currentInstance.proxy.$once('hook:beforeDestroy', () => {
            $horizontalWrapper.removeEventListener('scroll', scrollCallback)
        })
        const $verticalWrapper = document.querySelector('#lesscodeDrawVerticalWrapper')
        $verticalWrapper.addEventListener('scroll', scrollCallback)
        currentInstance.proxy.$once('hook:beforeDestroy', () => {
            $verticalWrapper.removeEventListener('scroll', scrollCallback)
        })
        const $templateContainerEl = $horizontalWrapper.querySelector('.container-content')
        if ($templateContainerEl) {
            $templateContainerEl.addEventListener('scroll', scrollCallback)
            currentInstance.proxy.$once('hook:beforeDestroy', () => {
                $templateContainerEl.removeEventListener('scroll', scrollCallback)
            })
        }
        const $mobileDrawEl = $horizontalWrapper.querySelector('#lesscodeMobileDraw')
        if ($mobileDrawEl) {
            $mobileDrawEl.addEventListener('scroll', scrollCallback)
            currentInstance.proxy.$once('hook:beforeDestroy', () => {
                $mobileDrawEl.removeEventListener('scroll', scrollCallback)
            })
        }
    })
}
