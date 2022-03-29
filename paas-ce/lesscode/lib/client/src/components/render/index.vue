<template>
    <div class="canvas-wrapper">
        <component :is="canvas"></component>
    </div>
</template>

<script>
    import PC from './pc/index.vue'
    import Mobile from './mobile/index.vue'
    import LC from '@/element-materials/core'
    export default {
        components: {
            PC,
            Mobile
        },
        computed: {
            canvas () {
                return LC.platform === 'MOBILE' ? Mobile : PC
            }
        }
    }
</script>
.<style lang="postcss" scoped>
.canvas-wrapper {
    height: calc(100vh - 160px);
    min-width: 920px;
}
</style>
