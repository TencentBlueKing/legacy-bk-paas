<template>
    <component :is="canvas" />
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
