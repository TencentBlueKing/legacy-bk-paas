<template>
    <div class="input">
        <bk-input v-model="val" :disabled="disabled" @change="change"></bk-input>
    </div>
</template>
<script>
    export default {
        name: 'Input',
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
