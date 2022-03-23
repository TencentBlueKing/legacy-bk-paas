<template>
    <div class="area-wrapper">
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
    import { useStore } from '@/store'
    import { useRoute } from '@/router'

    export default {
        setup () {
            const store = useStore()
            const route = useRoute()
            const width = '375'
            const height = '812'

            const projectId = route.params.projectId
            const pagePath = route.query.pagePath || '/'
            // const pagePath = `${store.getters['page/pageRoute'].layoutPath}${store.getters['page/pageRoute'].layoutPath.endsWith('/') ? '' : '/'}${store.getters['page/pageRoute'].path}`
            const versionId = store.getters['projectVersion/currentVersionId']

            let queryStr = '?platform=MOBILE'
            queryStr += `${versionId ? `&v=${versionId}` : ''}`

            return {
                width,
                height,
                source: `${location.origin}/preview/project/${projectId}${pagePath}${queryStr}`
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import './../../components/render/mobile/area.scss';

    .area-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
</style>
