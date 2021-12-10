<template>
    <div class="main-content">
        <component :is="com" v-bind="$attrs" />
    </div>
</template>
<script>
    import Render from '@/components/render/index'
    import VueCode from '@/components/vue-code'
    import PageSetting from './components/page-setting'
    import PageJson from './components/page-json'
    import PageVariable from './components/page-variable'
    import PageFunction from './components/page-function'

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
                    edit: Render,
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
