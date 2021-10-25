<template>
    <div
        v-show="componentData.interactiveShow"
        class="interactive-component"
        :style="interactiveLayout">
        <resolve-component
            :key="componentData.renderKey"
            :component-data="componentData"
            :interactive-layout="interactiveLayout" />
    </div>
</template>
<script>
    import ResolveComponent from './resolve-component'

    export default {
        name: '',
        components: {
            ResolveComponent
        },
        provide () {
            /** slot下的子元素，不需要provide offset */
            return {
                layoutOffset: this.interactiveLayout
            }
        },
        props: {
            componentData: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                interactiveLayout: {
                    height: 0,
                    width: 0,
                    left: 0,
                    top: 0,
                    position: 'fixed',
                    zIndex: 101,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }
            }
        },
        mounted () {
            console.log('from interactive compnet =', this)
            this.canvas = document.getElementsByClassName('main-content')[0]
            this.resizeObserver = new ResizeObserver(this.resizeInteractiveWrapper)
            this.resizeObserver.observe(this.canvas)
        },
        beforeDestroy () {
            this.resizeObserver && this.resizeObserver.unobserve(this.canvas)
        },
        methods: {
            resizeInteractiveWrapper () {
                const { height, width, left, top } = this.canvas.getBoundingClientRect()
                this.interactiveLayout.height = height + 'px'
                this.interactiveLayout.width = width + 'px'
                this.interactiveLayout.left = left + 'px'
                this.interactiveLayout.top = top + 'px'
            }
        }
    }
</script>
<style lang="postcss">
</style>
