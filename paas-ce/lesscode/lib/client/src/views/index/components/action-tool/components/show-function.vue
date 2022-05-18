<template>
    <menu-item :item="item">
        <edit-function-dialog :show.sync="isShowFun" />
    </menu-item>
</template>
<script>
    import MenuItem from './menu-item'
    import EditFunctionDialog from '@/components/methods/edit-function-dialog/index.vue'
    
    export default {
        components: {
            MenuItem,
            EditFunctionDialog
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-hanshuku',
                    text: '函数库',
                    func: this.showFunManage
                },
                isShowFun: false
            }
        },
        methods: {
            showFunManage () {
                this.isShowFun = true
            }
        }
    }
</script>
