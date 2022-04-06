import { ref, reactive, computed } from '@vue/composition-api'
import { list } from './model-list'

export default function () {
    const model = ref('iPhone 11 Pro')
    const modelList = reactive(list)

    // 当前机型的信息
    const activeModelInfo = computed(() => {
        const currentModel = modelList.find(item => item.key === model.value)
        return /\((\d+\s?x\s?\d+)\)/.exec(currentModel.text)
    })

    // 当前机型的分辨率 例: 375 x 812
    const currentResolution = computed(() => {
        const resolution = (modelList.length && activeModelInfo.value[1])
              || ''
        return resolution
    })

    // 画布尺寸<T> { width: xx, height:xx }
    const canvasSize = computed(() => {
        const size = { // 默认为iPhone 12 的尺寸
            width: 375,
            height: 812
        }
        if (activeModelInfo && modelList.length) {
            size.width = parseInt(activeModelInfo.value[1].split('x')[0])
            size.height = parseInt(activeModelInfo.value[1].split('x')[1])

            // 满屏幕为20rem，以此设置root的字体大小，移动端响应式
            document.documentElement.style.fontSize = `${size.width / 20}px`
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
