<template>
    <div
        v-show="componentData.interactiveShow"
        :class="$style['interactive']"
        :style="interactiveLayout"
        role="interactive-root"
        data-render-drag="disabled">
        <resolve-component
            :key="componentData.renderKey"
            :component-data="componentData"
            :interactive-layout="interactiveLayout" />
    </div>
</template>
<script>
    import ResolveComponent from './resolve-component'

    export default {
        name: 'resolve-interactive-component',
        components: {
            ResolveComponent
        },
        provide () {
            /** slot下的子元素，不需要provide offset */
            return {
                layoutOffset: this.interactiveLayout,
                attachToInteractiveComponent: true
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
            this.canvas = document.getElementsByClassName('main-content')[0]
            this.resizeObserver = new ResizeObserver(this.resizeInteractiveWrapper)
            this.resizeObserver.observe(this.canvas)
            setTimeout(() => {
                this.componentData.toggleInteractive()
                this.componentData.toggleInteractive()
            }, 2000)
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
<style lang="postcss" module>
    .interactive {
        transform: translate(0, 0);
        
    }
</style>
