<template>
    <div class="render-content">
        <render-flow v-if="nocodeType === 'FLOW'" />
        <!--        <render-form v-else-if="nocodeType === 'FORM'" @update="$emit('update', $event)" />-->
        <render-data-manage v-else-if="nocodeType"></render-data-manage>
        <render-form v-else />
        <!--        <div>empty</div>-->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
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
            }
        },
        computed: {
            ...mapGetters('page', ['pageDetail']),
            nocodeType () {
                return this.pageDetail.nocodeType || ''
            }
        },
        created () {
            console.log(this.pageDetail, 255)
        }

    }
</script>
