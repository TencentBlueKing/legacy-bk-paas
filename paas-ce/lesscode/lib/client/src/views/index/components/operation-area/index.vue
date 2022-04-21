<template>
    <div
        ref="root"
        id="lesscodeDrawHorizontalWrapper"
        :class="$style['horizontal-wrapper']">
        <div
            id="lesscodeDrawVerticalWrapper"
            :class="$style['vertical-wrapper']">
            <render
                v-show="operation === 'edit'"
                :style="renderStyles" />
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
             * @value render
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
                renderStyles: {},
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

            this.renderStyles = {
                'min-height': `calc(100vh - ${top}px - 20px)`
            }
            this.oprationItemStyles = {
                'height': `calc(100vh - ${top}px - 20px)`
            }
        }
    }
</script>
<style lang="postcss" module>
    @import "@/css/mixins/scroller";

    .horizontal-wrapper{
        height: 100%;
        padding: 0 20px;
        overflow-y: auto;
        @mixin scroller;
    }
    .vertical-wrapper{
        background: #fff;
        overflow-x: auto;
        @mixin scroller;
    }
</style>
