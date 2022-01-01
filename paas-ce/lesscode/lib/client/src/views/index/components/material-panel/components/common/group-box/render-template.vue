<template>
    <div class="render-drag-item">
        <div class="component-icon">
            <i class="bk-drag-icon" :class="data.icon" />
        </div>
        <div class="component-name">{{ data.displayName }}</div>
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
