<template>
    <div class="field-edit">
        <bk-form form-type="vertical">
            <bk-form-item label="字段名称">
                <bk-input v-model.trim="fieldData.name" @change="change" @blur="onNameBlur"></bk-input>
            </bk-form-item>
        </bk-form>
    </div>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    export default {
        name: 'formEdit',
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: Object,
                default: () => ({})
            },
            list: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                fieldData: cloneDeep(this.value)
            }
        },
        methods: {
            onNameBlur () {
                if (this.fieldData.name === '') {
                    this.fieldData.name = '字段名称'
                    this.change()
                }
            },
            change () {
                this.$emit('change', this.fieldData)
            }
        }
    }
</script>

<style scoped>

</style>
