<template>
    <div class="main-content">
        <component :is="com" v-bind="$attrs" />
    </div>
</template>
<script>
    import RenderIndex from '@/components/render/index'
    import VueCode from '@/components/vue-code'
    import PageSetting from '@/views/project/page-setting'
    import PageJson from '@/views/project/page-json'
    import PageVariable from '@/views/project/page-variable'
    import PageFunction from '@/views/project/page-function'

    export default {
        name: '',
        props: {
            /**
             * @value edit
             * @value vueCode
             * @value pageFunction
             * @value setting
             * @value jsonSource
             * @value pageVariable
             */
            operaion: {
                type: String,
                required: true
            }
        },
        data () {
            return {}
        },
        computed: {
            com () {
                const comMap = {
                    edit: RenderIndex,
                    vueCode: VueCode,
                    pageFunction: PageFunction,
                    setting: PageSetting,
                    jsonSource: PageJson,
                    pageVariable: PageVariable
                }
                return comMap[this.operaion]
            }
        }
    }
</script>
<style lang="postcss">
</style>
