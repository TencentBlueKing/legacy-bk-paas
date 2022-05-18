<template>
    <div class="checkbox">
        <bk-checkbox-group v-model="val" @change="change">
            <bk-checkbox
                v-for="option in sourceData"
                :value="option.key"
                :disabled="getDisableStatus(option.key)"
                :key="option.key">
                {{ option.name }}
            </bk-checkbox>
        </bk-checkbox-group>
    </div>
</template>
<script>
    import dataSourceMixins from '../dataSourceMixins.js'

    export default {
        name: 'Checkbox',
        mixins: [dataSourceMixins],
        props: {
            field: {
                type: Object,
                default: () => ({})
            },
            value: {
                type: [Array, String]
                // default: () => [],
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                val: Array.isArray(this.value) ? [...this.value] : [this.value]
            }
        },
        watch: {
            value (val) {
                this.val = Array.isArray(val) ? [...val] : [val]
            }
        },
        methods: {
            getDisableStatus (key) {
                if (this.disabled) {
                    return true
                }
                if (
                    'num_range' in this.field
                    && typeof this.field.num_range[1] === 'number'
                    && Array.isArray(this.value)
                    && this.value.length >= this.field.num_range[1]
                    && !this.value.includes(key)
                ) {
                    return true
                }
                return false
            },
            change (val) {
                this.$emit('change', val)
            }
        }
    }
</script>
<style lang="postcss" scoped>
.bk-form-checkbox {
  margin-right: 24px;
}
</style>
