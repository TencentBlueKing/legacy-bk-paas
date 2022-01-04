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
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
            })
        },
        mounted () {
            this.componentData.active()
            this.componentData.toggleInteractive(true)
        }
    }
</script>
<style lang="postcss" module>
    .interactive {
        position: fixed;
        z-index: 1000000000000;
        background: rgba(0,0,0,0.5);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
</style>
