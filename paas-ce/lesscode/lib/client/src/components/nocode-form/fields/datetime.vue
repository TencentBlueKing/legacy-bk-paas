<template>
    <div class="datetime">
        <bk-date-picker v-model="val" type="datetime" :disabled="disabled" @change="change"></bk-date-picker>
    </div>
</template>
<script>
    export default {
        name: 'Datetime',
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
        },
        data () {
            return {
                val: this.value
            }
        },
        watch: {
            value (val) {
                this.val = val
            }
        },
        methods: {
            change (val) {
                this.$emit('change', val)
            }
        }
    }
</script>
<style lang="postcss" scoped>
.bk-date-picker {
  width: 100%;
}
</style>
