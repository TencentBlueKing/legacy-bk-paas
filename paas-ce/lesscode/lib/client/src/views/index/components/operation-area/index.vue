<template>
    <div
        ref="root"
        id="lesscodeOperationArea"
        :class="$style['operation-area']">
        <div :class="$style['operation-wraper']">
            <render v-show="operation === 'edit'" />
            <component
                v-if="operation !== 'edit'"
                :is="com"
                v-bind="$attrs"
                :style="oprationItemStyles" />
        </div>
    </div>
</template>
<script>
    import { getOffset } from '@/common/util'
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
            return {
                oprationItemStyles: {
                    height: '200px'
                }
            }
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
        },
        mounted () {
            const {
                top
            } = getOffset(this.$refs.root)
            this.oprationItemStyles = {
                'height': `calc(100vh - ${top}px - 20px)`
            }
        }
    }
</script>
<style lang="postcss" module>
    @import "@/css/mixins/scroller";

    .operation-area{
        height: calc(100% - 40px);
        padding: 0 20px;
        margin: 20px 0;
        overflow: auto;
        @mixin scroller;
        .operation-wraper{
            background: #fff;
            min-width: min-content;
        }
    }
</style>
