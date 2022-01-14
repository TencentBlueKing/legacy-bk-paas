import { ref, computed } from '@vue/composition-api'
import { list } from './model-list'

export default function () {
    const model = ref('iPhone 11 Pro')
    const modelList = ref(list)

    const activeModelInfo = computed(() => {
        const currentModel = modelList.value.find(item => item.key === model.value)
        return /\((\d+\s?x\s?\d+)\)/.exec(currentModel.text)
    })

    const currentResolution = computed(() => {
        console.log(activeModelInfo, 'activeModelInfo')
        const resolution = (modelList.value.length && activeModelInfo.value[1])
              || ''
        return resolution
    })

    const canvasSize = computed(() => {
        const size = { // 默认为iPhone 12 的尺寸
            width: 375,
            height: 812
        }
        if (activeModelInfo && modelList.value.length) {
            console.log(activeModelInfo, 'activeMOdelInfo')
            size.width = parseInt(activeModelInfo.value[1].split('x')[0])
            size.height = parseInt(activeModelInfo.value[1].split('x')[1])
        }
        return size
    })

    return {
        model,
        currentResolution,
        canvasSize,
        modelList
    }
}
