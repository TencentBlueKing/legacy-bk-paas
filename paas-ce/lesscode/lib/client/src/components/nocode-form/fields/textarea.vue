<template>
    <div class="textarea">
        <bk-input v-model="val" type="textarea" :disabled="disabled" @change="change"></bk-input>
    </div>
</template>
<script>
    export default {
        name: 'Textarea',
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
