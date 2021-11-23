<template>
    <section>
        <menu-item :item="item"></menu-item>
        <Methods :show.sync="isShowFun" />
    </section>
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
