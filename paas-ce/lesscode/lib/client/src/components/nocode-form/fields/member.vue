<template>
    <div class="member">
        <member-select v-model="val" :disabled="disabled" :multiple="false" @change="change"></member-select>
    </div>
</template>
<script>
    import MemberSelect from '../components/memberSelect.vue'

    export default {
        name: 'Member',
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
