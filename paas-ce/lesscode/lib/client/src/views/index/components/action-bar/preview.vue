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
                    icon: 'bk-drag-icon bk-drag-play',
                    text: '预览',
                    func: this.handlePreview
                }
            }
        },
        methods: {
            handlePreview () {
                alert(235)
                console.log(this.item.text)
            }
        }
    }
</script>
