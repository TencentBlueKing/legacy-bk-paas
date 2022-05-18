<template>
    <div class="input-select">
        <bk-select v-model="val" :searchable="true" :disabled="disabled" :loading="sourceDataLoading" @change="change">
            <bk-option v-for="option in sourceData" :key="option.key" :id="option.key" :name="option.name"> </bk-option>
        </bk-select>
    </div>
</template>
<script>
    import dataSourceMixins from '../dataSourceMixins.js'

    export default {
        name: 'InputSelect',
        mixins: [dataSourceMixins],
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
