<template>
    <div class="tree">
        <bk-tree></bk-tree>
    </div>
</template>
<script>
    export default {
        name: 'Tree',
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: String,
                default: ''
            }
        }
    }
</script>
