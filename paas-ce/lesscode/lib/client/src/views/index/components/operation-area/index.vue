<template>
    <div
        id="lesscodeOperationArea"
        :class="$style['operation-area']">
        <div :class="$style['wraper']">
            <render v-show="operation === 'edit'" />
            <template v-if="operation !== 'edit'">
                <component
                    :is="com"
                    v-bind="$attrs" />
            </template>
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
        components: {
            Render
        },
        props: {
            /**
             * @value vueCode
             * @value pageFunction
             * @value setting
             * @value jsonSource
             * @value pageVariable
             */
            operation: {
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
                    vueCode: SourceCode,
                    pageFunction: PageFunction,
                    setting: PageSetting,
                    jsonSource: PageJson,
                    pageVariable: PageVariable
                }
                return comMap[this.operation]
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
            height: 100%;
            background: #fff;
            & > * {
                height: 100%;
            }
        }
    }
</style>
