<template>
    <menu-item :item="item">
        <methods :show.sync="isShowFun" />
    </menu-item>
</template>
<script>
    import MenuItem from './menu-item'
    import Methods from '@/components/methods'
    
    export default {
        components: {
            MenuItem,
            Methods
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
