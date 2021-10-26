<template>
    <bk-select class="project-version-selector"
        v-model="selected"
        :searchable="searchable"
        :clearable="clearable"
        :popover-options="{
            boundary: 'window'
        }"
        v-bind="$attrs">
        <bk-option
            v-for="(option, index) in options"
            :key="index"
            :id="option.id"
            :name="option.version">
        </bk-option>
    </bk-select>
</template>

<script>
    const defaultOptions = () => ([{ id: 0, version: '草稿' }])

    export default {
        props: {
            value: {
                type: [Array, Number, String],
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            autoSelect: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                options: []
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            },
            searchable () {
                return this.options.length > 7
            },
            selected: {
                get () {
                    if (this.isEmpty(this.value)) {
                        return this.getDefaultValue()
                    }
                    return this.value
                },
                set (value) {
                    let emitValue = value
                    if (value === '') {
                        emitValue = this.multiple ? [] : ''
                    }
                    const selectedOption = this.options.find(op => op.id === emitValue)
                    this.$emit('input', emitValue)
                    this.$emit('selected', emitValue, selectedOption)
                }
            }
        },
        created () {
            this.getOptions()
        },
        methods: {
            isEmpty (value) {
                return ['', undefined, null].includes(value)
            },
            async getOptions () {
                try {
                    const options = await this.$store.dispatch('projectVersion/getOptionList', { projectId: this.projectId })
                    this.options = defaultOptions().concat(options || [])
                } catch (e) {
                    console.error(e)
                    this.options = defaultOptions()
                }
            },
            getDefaultValue () {
                if (this.autoSelect) {
                    const defaultOption = this.options[0]
                    if (!defaultOption) return ''
                    if (this.multiple) return [defaultOption.id]
                    return defaultOption.id
                }
                return this.multiple ? [] : ''
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .project-version-selector {
        width: 320px;
    }
</style>
