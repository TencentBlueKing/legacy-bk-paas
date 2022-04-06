<template>
    <div class="render-drag-icon-item inline">
        <bk-icon
            v-if="data.type === 'bk-icon'"
            :type="data.icon" />
        <i
            v-else
            :class="data.icon" />
    </div>
</template>
<script>
    export default {
        name: '',
        props: {
            data: Object
        }
    }
</script>
