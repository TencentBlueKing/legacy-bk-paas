<template>
    <menu-item :item="item"></menu-item>
</template>

<script>

    import MenuItem from './menu-item'
    
    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-hanshuku',
                    text: '函数库',
                    func: this.showFunManage
                }
            }
        },
        methods: {
            showFunManage () {
                console.log(this.item.text)
            }
        }
    }
</script>
