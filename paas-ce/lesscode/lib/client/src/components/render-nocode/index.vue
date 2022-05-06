<template>
    <div>
        <render-flow v-if="nocodeType === 'flow'" />
        <render-data-manage v-else-if="nocodeType === 'dataManage'"></render-data-manage>
        <render-form v-else />
<!--        <render-form v-else @change="$emit('change',$event)" />-->
    </div>
</template>

<script>
    import RenderFlow from './flow'
    import RenderForm from './form'
    import RenderDataManage from './data-manage'

    export default {
        components: {
            RenderFlow,
            RenderForm,
            RenderDataManage
        },
        data () {
            return {
                nocodeType: 'form'
            }
        }

    }
</script>
