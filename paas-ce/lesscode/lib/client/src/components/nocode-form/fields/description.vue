<template>
    <div class="desc">
        <div class="content">{{ value }}</div>
    </div>
</template>
<script>
    export default {
        name: 'Description',
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style lang="postcss" scoped>
.desc {
  .content {
    padding: 8px;
    font-size: 14px;
    color: #63656e;
    background: #f5f7fa;
    white-space: pre-line;
  }
}
</style>
