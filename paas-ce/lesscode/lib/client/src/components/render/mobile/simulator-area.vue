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
            const pageCode = store.getters['page/pageDetail'].pageCode
            const versionId = store.getters['projectVersion/currentVersionId']

            const versionQuery = `${versionId ? `&v=${versionId}` : ''}`

            emitter.on('update-canvas-size', val => {
                width.value = val.value.width
                height.value = val.value.height
            })

            return {
                width,
                height,
                source: `/preview/project/${projectId}/preveiew?pageCode=${pageCode}${versionQuery}`
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import './area.scss';

    .simulator-wrapper {
        position: relative;
        .device-phone-frame {
            z-index: 1;
            pointer-events: none;
            position: absolute;
            height: 100%;
            width: 100%;
            padding: 5% 6.5% 5.6%;
            box-sizing: content-box;

        }
        .device-phone {
            pointer-events: none;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-image: url(../../../images/phone.png);
            background-size: 100% 100%;
        }
        .simulator-preview {
            height: 100%;
            width: 100%;
            box-sizing: content-box;
            padding: 5% 6.5% 5.6%;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
</style>
