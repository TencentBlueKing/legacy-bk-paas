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
    import _ from 'lodash'
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
                    height: `calc(100vh - ${top}px - 20px)`
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
            this.calcOperationItemStyles()
            this.calcRenderStyles()
            const resizeObserverCallback = _.throttle(() => {
                this.calcRenderStyles()
            }, 100)

            const activeResizeObserver = new ResizeObserver(resizeObserverCallback)
            activeResizeObserver.observe(this.$refs.root)
            this.$once('hook:beforeDestroy', () => {
                activeResizeObserver.unobserve(this.$refs.root)
            })
        },
        methods: {
            calcRenderStyles () {
                const {
                    top
                } = getOffset(this.$refs.root)
                
                const {
                    width
                } = this.$refs.root.getBoundingClientRect()
                
                this.renderStyles = {
                    width: `${width - 40}px`,
                    'min-height': `calc(100vh - ${top + 20}px)`
                }
            },
            calcOperationItemStyles () {
                const {
                    top
                } = getOffset(this.$refs.root)
                
                this.oprationItemStyles = {
                    'height': `calc(100vh - ${top + 20}px)`
                }
            }
        }
    }
</script>
<style lang="postcss" module>
    @import "@/css/mixins/scroller";

    .horizontal-wrapper{
        position: relative;
        padding: 0px 20px;
        height: 100%;
        overflow: auto;
    }
    .vertical-wrapper{
        background: #fff;
        
    }
</style>
