<template>
    <div id="lesscodeOperationArea" :class="$style['operation-area']">
        <div :class="$style['wraper']">
            <component :is="com" v-bind="$attrs" />
        </div>
    </div>
</template>
<script>
    import Render from '@/components/render/index'
    import SourceCode from './components/source-code.vue'
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
                    vueCode: SourceCode,
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
<style lang="postcss" module>
    @import "@/css/mixins/scroller";

    .operation-area{
        height: 100%;
        padding: 0 20px;
        overflow: auto;
        @mixin scroller;
        .wraper{
            /* border: 1px solid #DCDEE5; */
            background: #fff;
            & > * {
                height: 100%;
            }
        }
    }
</style>
