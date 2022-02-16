<template>
    <div class="canvas-wrapper">
        <component :is="canvas"></component>
    </div>
</template>

<script>
    import PC from './pc/index.vue'
    import Mobile from './mobile/index.vue'
    export default {
        components: {
            PC,
            Mobile
        },
        props: {
            platform: {
                type: String,
                default: 'pc'
            }
        },
        computed: {
            canvas () {
                return this.platform === 'pc' ? PC : Mobile
            }
        }
    }
</script>
.<style lang="postcss" scoped>
.canvas-wrapper {
    height: 100%;
}
</style>
