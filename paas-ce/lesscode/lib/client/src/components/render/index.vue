<template>
    <component :is="canvas" />
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
