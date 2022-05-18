<template>
    <div class="members">
        <member-select :value="val" :disabled="disabled" @change="change"></member-select>
    </div>
</template>
<script>
    import MemberSelect from '../components/memberSelect.vue'

    export default {
        name: 'Members',
        components: {
            MemberSelect
        },
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: Array,
                default: () => []
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                val: [...this.value]
            }
        },
        watch: {
            value (val) {
                this.val = [...val]
            }
        },
        methods: {
            change (val) {
                this.$emit('change', val)
            }
        }
    }
</script>
