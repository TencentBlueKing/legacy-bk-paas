<template>
    <bk-select :class="['project-version-selector', { borderless: !bordered }]"
        v-model="selected"
        placeholder="--"
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
        <div slot="extension" @click="handleCreate" style="cursor: pointer;">
            <i class="bk-icon icon-plus-circle"></i> 新建版本
        </div>
    </bk-select>
</template>

<script>
    const defaultOptions = () => ([{ id: 0, version: '默认' }])

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
            },
            bordered: {
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
                    } else if (!this.multiple && !this.options.find(op => op.id === this.value)) {
                        // 使用默认数据替换无效数据
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
                    this.$emit('change', emitValue, selectedOption)
                }
            }
        },
        watch: {
            projectId () {
                this.getOptions()
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
                    this.$store.commit('projectVersion/setVersionList', this.options)
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
            },
            handleCreate () {
                this.$router.push({
                    name: 'versions'
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .project-version-selector {
        &.borderless {
            min-width: 54px;
            max-width: 320px;
            border: none;
            ::v-deep {
                .bk-select-name {
                    padding-right: 24px;
                }
                .bk-select-name,
                .bk-select-angle {
                    color: #3A84FF;
                }
            }
            &.is-focus {
                box-shadow: none;
            }
        }
    }
</style>
