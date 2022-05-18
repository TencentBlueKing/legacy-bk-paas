<template>
    <div class="int">
        <bk-input v-model="val" type="number" :disabled="disabled" @change="change"></bk-input>
    </div>
</template>
<script>
    export default {
        name: 'Int',
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: [Number, String],
                default: 0
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
