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
                    icon: 'bk-drag-icon bk-drag-save',
                    text: '保存',
                    func: this.handleSave
                }
            }
        },
        methods: {
            handleSave () {
                console.log(this.item.text)
            }
        }
    }
</script>
