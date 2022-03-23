<template>
    <div class="area-wrapper">
        <div class="title">
            <span class="title-text">效果预览</span>
        </div>
        <div class="simulator-wrapper" :style="{ width: width + 'px', height: height + 'px' }">
            <div class="device-phone-frame">
                <div class="device-phone"></div>
            </div>
            <div class="simulator-preview" :style="{ width: width + 'px', height: height + 'px' }">
                <iframe width="100%"
                    height="100%"
                    style="border: none"
                    :src="source"
                >
                </iframe>
            </div>
        </div>
    </div>
</template>

<script>
    import getModelInfo from './common/model'
    import emitter from 'tiny-emitter/instance'
    import { ref } from '@vue/composition-api'
    import { useStore } from '@/store'
    import { useRoute } from '@/router'

    export default {
        setup () {
            const store = useStore()
            const route = useRoute()
            const { canvasSize } = getModelInfo()
            const width = ref(canvasSize.value.width)
            const height = ref(canvasSize.value.height)

            const projectId = route.params.projectId
            const pagePath = `${store.getters['page/pageRoute'].layoutPath}${store.getters['page/pageRoute'].layoutPath.endsWith('/') ? '' : '/'}${store.getters['page/pageRoute'].path}`
            const versionId = store.getters['projectVersion/currentVersionId']

            let queryStr = '?platform=MOBILE'
            queryStr += `${versionId ? `&v=${versionId}` : ''}`

            emitter.on('update-canvas-size', val => {
                width.value = val.value.width
                height.value = val.value.height
            })

            return {
                width,
                height,
                source: `${location.origin}/preview/project/${projectId}${pagePath}${queryStr}`
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import './area.scss';
</style>
