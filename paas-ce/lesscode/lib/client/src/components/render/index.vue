<template>
    <div class="canvas-wrapper">
        <component :is="canvas"></component>
    </div>
</template>

<script>
    import PC from './pc/index.vue'
    import Mobile from './mobile/index.vue'
    import { mapGetters } from 'vuex'
    export default {
        components: {
            PC,
            Mobile
        },
        computed: {
            ...mapGetters('page', ['platform']),
            canvas () {
                return this.platform === 'MOBILE' ? Mobile : PC
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
