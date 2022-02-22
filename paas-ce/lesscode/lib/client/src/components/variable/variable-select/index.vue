<template>
    <section class="select-variable">
        <section class="header">
            <slot name="title"></slot>
            <bk-select
                v-if="show"
                class="format-list"
                :value="formData.format"
                :clearable="false"
                :disabled="readonly"
                style="width: 68px;"
                behavior="simplicity"
                ext-popover-cls="select-popover-variable"
                @change="handleFormatChange">
                <bk-option
                    v-for="(val, key) in renderFormatMap"
                    :key="key"
                    :id="key"
                    :name="val">
                </bk-option>
            </bk-select>
        </section>
        <div
            v-if="readonly"
            class="readonly-text">
            {{ formData.code }}
        </div>
        <div v-else style="width: 100%">
            <slot v-if="formData.format === 'value'" />
            <render-variable
                v-if="formData.format === 'variable'"
                :options="options"
                :form-data="formData"
                :remote-config="remoteConfig"
                @on-change="handleChange" />
            <render-expression
                v-if="formData.format === 'expression'"
                :options="options"
                :form-data="formData"
                @on-change="handleChange"
            />
        </div>
        
    </section>
</template>
<script>
    import _ from 'lodash'
    import RenderVariable from './components/variable'
    import RenderExpression from './components/expression'

    const genFormData = ({
        format = 'value',
        code = '',
        valueType = [],
        renderValue
    }) => ({
        // 类型（value、variable、expression）
        format,
        // 对应 format 的值
        code,
        // 最终值的类型
        valueType,
        // 编辑器渲染值
        renderValue
    })

    const formatTypeMap = {
        value: '值',
        variable: '变量',
        expression: '表达式'
    }

    export default {
        components: {
            RenderVariable,
            RenderExpression
        },
        props: {
            show: {
                type: Boolean,
                default: true
            },
            /**
             * @desc 配置数据
             *
             * {
             *      type: '',
             *      prop: '',
             *      format: '',
             *      formatInclude: [] | undefined, // undefined 表示支持所有 format
             *      code: '',
             *      valueTypeInclude: [] | undefined // undefined 表示支持所有值类型
             * }
             */
            options: {
                type: Object,
                required: true
            },
            /**
             * @desc 值数据
             *
             * {
             *      format: '',
             *      code: '',
             *      valueType: '',
             *      renderValue: ''
             * }
             */
            value: Object,
            // 只读
            readonly: {
                type: Boolean,
                default: false
            },
            remoteConfig: {
                type: Object,
                default: () => ({
                    show: false,
                    value: '',
                    name: ''
                })
            }
        },

        data () {
            return {
                formData: genFormData(this.value)
            }
        },

        computed: {
            renderFormatMap () {
                if (!this.options.formatInclude) {
                    return {
                        ...formatTypeMap
                    }
                }
                return this.options.formatInclude.reduce((result, format) => {
                    if (formatTypeMap[format]) {
                        result[format] = formatTypeMap[format]
                    }
                    return result
                }, {})
            }
        },
        methods: {
            triggerChange () {
                this.$emit('change', {
                    ...this.formData
                })
            },
            /**
             * @desc 格式改变
             * @param { String } format
             *
             * format 改变时需要重置 code 的值
             */
            handleFormatChange (format) {
                this.formData.format = format
                this.formData.code = ''
                this.triggerChange()
            },
            /**
             * @desc 选中变量、更新表单式
             * @param { Object } payload
             */
            handleChange: _.throttle(function (payload) {
                this.formData = {
                    ...this.formData,
                    ...payload
                }
                this.triggerChange()
            }, 60)
        }
    }
</script>
<style lang="postcss" scoped>
    .select-variable {
        margin-top: 10px;
        .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            font-size: 14px;
            color: #63656E;
            word-break: keep-all;
            width: 100%;
        }
        .format-list {
            border: none;
            /deep/ .bk-select-angle {
                font-size: 16px;
                top: 7px;
                color: #b1b4bc;
            }
            /deep/ .bk-select-name {
                padding: 0 20px 0 0;
                text-align: right;
                font-size: 12px;
                color: #b1b4bc;
                transform: scale(0.9);
                line-height: 32px;
            }
        }
        .readonly-text {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 32px;
            padding: 0 2px 0 10px;
            border: 1px solid #c4c6cc;
            cursor: pointer;
            border-radius: 2px;
            font-size: 12px;
            .select-variable-placeholder {
                color: #c3cdd7;
                pointer-events: none;
            }
            &.is-focus {
                border-color: #3a84ff;
                box-shadow: 0 0 4px rgb(58 132 255 / 40%);
            }
            .bk-icon {
                font-size: 20px;
                display: inline-block;
                &.icon-angle-down {
                    color: #979ba5;
                }
                &.icon-flip {
                    transform: rotate(-180deg);
                }
                &.icon-close-circle-shape {
                    color: #c4c6cc;
                    cursor: pointer;
                    font-size: 14px;
                    display: none;
                }
            }
            &:hover {
                .has-val.icon-close-circle-shape {
                    display: inline-block;
                    margin-right: 4px;
                }
                .has-val.icon-angle-down {
                    display: none;
                }
            }
        }
    }
</style>
