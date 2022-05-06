<template>
    <div>
        <render-flow v-if="nocodeType === 'flow'" />
        <render-form v-else @change="$emit('change',$event)" />
    </div>
</template>

<script>
    import RenderFlow from './flow'
    import RenderForm from './form'

    export default {
        components: {
            RenderFlow,
            RenderForm
        },
        data () {
            return {
                nocodeType: 'form'
            }
        }

    }
</script>
