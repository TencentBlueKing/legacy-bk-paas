<template>
    <div
        v-show="componentData.interactiveShow"
        :class="$style['interactive']"
        role="interactive-root"
        data-render-drag="disabled">
        <resolve-component
            :key="componentData.renderKey"
            :component-data="componentData" />
    </div>
</template>
<script>
    import LC from '@/element-materials/core'
    import ResolveComponent from './resolve-component'

    export default {
        name: 'resolve-interactive-component',
        components: {
            ResolveComponent
        },
        provide () {
            return {
                attachToInteractiveComponent: true
            }
        },
        props: {
            componentData: {
                type: Object,
                required: true
            }
        },
        created () {
            const updateCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                }
            }
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('toggleInteractive', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('toggleInteractive', updateCallback)
            })
            
            // 新拖入的交互式组件默认要显示出来
            if (!this.componentData._isMounted) {
                this.componentData.toggleInteractive(true)
                this.$once('hook:mounted', () => {
                    this.componentData.active()
                })
            }
        }
    }
</script>
<style lang="postcss" module>
    .interactive {
        position: fixed;
        z-index: 99999999;
        background: rgba(0,0,0,0.5);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: auto !important;
    }
</style>
