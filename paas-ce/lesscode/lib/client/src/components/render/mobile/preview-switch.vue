<template>
    <div class="mobile-preview-switcher">
        <span>预览</span>
        <bk-switcher v-model="syncValue" size="small" theme="primary"></bk-switcher>
    </div>
</template>
<script>
    export default {
        props: {
            value: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            syncValue: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('update:value', val)
                }
            }
        },
        mounted () {
            document.querySelector('.page-name').appendChild(this.$el)
        },
        destroyed () {
            document.querySelector('.page-name').removeChild(this.$el)
        }
    }
</script>
<style lang="postcss" scoped>
.mobile-preview-switcher {
    display: flex;
    align-items: center;
    justify-self: flex-start;
    margin-left: 20px;
    span {
        margin-right: 8px;
    }
}
</style>
