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
                    icon: 'bk-drag-icon bk-drag-delete',
                    text: '清空',
                    func: this.handleClearAll
                }
            }
        },
        methods: {
            handleClearAll () {
                console.log(this.item.text)
            }
        }
    }
</script>
