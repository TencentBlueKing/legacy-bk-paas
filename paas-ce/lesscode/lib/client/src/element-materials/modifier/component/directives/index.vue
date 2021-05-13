<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <section v-if="Object.keys(curSelectedComponentData).length" class="directive-home">
        <template v-if="renderDirectives.length">
            <h3 class="directive-tip">编辑函数时，可以使用 lesscode.指令值，必须通过编辑器自动补全功能选择对应属性指令值，来获取或者修改当前页面中配置了指令的组件属性值</h3>
            <bk-form form-type="vertical" :label-width="280">
                <bk-form-item error-display-type="normal"
                    v-for="(directive, index) in renderDirectives"
                    :key="index"
                    class="directive-item"
                    :property="directive.type + directive.prop"
                >
                    <variable-select :value="directive.val"
                        :val-type="directive.valType"
                        :available-types="directive.propTypes"
                        @change="(data) => changeVariable(directive, data)"
                    >
                        <template v-slot:title>
                            <span v-bk-tooltips="{ content: directive.tips && directive.tips(directive), disabled: !directive.tips, width: 290 }"
                                :class="{ 'under-line': directive.tips, 'directive-label': true }"
                            >
                                {{ getLabel(directive) }}
                            </span>
                        </template>
                        <bk-input :value="directive.val" @change="(val) => handleChange(directive, val)" clearable></bk-input>
                    </variable-select>
                </bk-form-item>
            </bk-form>
        </template>
        <div class="no-prop" v-else>
            该组件暂无指令
        </div>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import _ from 'lodash'
    import variableSelect from '@/components/variable/variable-select'

    export default {
        name: 'modifier-directives',

        components: {
            variableSelect
        },

        props: {
            materialConfig: {
                type: Array,
                required: true
            },

            lastDirectives: {
                type: Array,
                default: () => ([])
            },

            componentId: {
                type: String
            },

            componentType: {
                type: String
            }
        },

        data () {
            return {
                optionCommonDirectives: [
                    { type: 'v-if', val: '', valType: 'variable' },
                    { type: 'v-show', val: '', valType: 'variable' }
                ],
                id: (this.componentId || '').replace(/\-(.)/g, x => (x.slice(1)).toUpperCase())
            }
        },

        computed: {
            ...mapGetters('drag', ['targetData', 'curSelectedComponentData']),

            commonDirectives () {
                const id = this.id
                return [
                    {
                        type: 'v-for',
                        val: '',
                        valType: 'variable',
                        tips (dir) {
                            const content = dir.val ? `可以使用 【${id}Item】 为当前组件和子组件的指令赋值，当前组件的 v-if 和 v-show 除外` : '可以使用 v-for 指令， 把一个数组转换为一组元素'
                            return content
                        }
                    }
                ]
            },

            renderDirectives () {
                const lastDirectives = _.cloneDeep(this.lastDirectives || [])
                const materialConfig = _.cloneDeep(this.materialConfig || [])
                const renderDirectives = []
                const allDirectivs = [...materialConfig, ...this.commonDirectives]
                if (!['bk-dialog'].includes(this.componentType)) allDirectivs.push(...this.optionCommonDirectives)

                allDirectivs.forEach((directive) => {
                    const lastDirective = lastDirectives.find((dirVal) => ((dirVal.type + dirVal.prop) === (directive.type + directive.prop))) || {}
                    Object.assign(directive, lastDirective)
                    renderDirectives.push(directive)
                })
                return renderDirectives
            }
        },

        methods: {
            getLabel (directive) {
                const { type, modifiers = [], prop = '' } = directive
                let res = ''
                switch (type) {
                    case 'v-model':
                    case 'v-html':
                        res = type
                        break
                    case 'v-for':
                        const tips = directive.val ? `(${this.id}Item)` : ''
                        res = `${type}${tips}`
                        break
                    default:
                        const modifierStr = (modifiers || []).map((modifier) => `.${modifier}`).join('')
                        res = `${type}${prop ? `:${prop}` : ''}${modifierStr}`
                        break
                }
                return res
            },

            changeVariable (directive, data) {
                directive.val = data.val
                directive.valType = data.valType
                this.triggleUpdate(directive)
            },

            handleChange (directive, value) {
                directive.val = value
                this.triggleUpdate(directive)
            },

            triggleUpdate (directive) {
                const renderDirectives = JSON.parse(JSON.stringify(this.lastDirectives))
                const changedDirective = renderDirectives.find((dirVal) => ((dirVal.type + dirVal.prop) === (directive.type + directive.prop))) || {}
                if (changedDirective.val === undefined) {
                    renderDirectives.push(changedDirective)
                }
                Object.assign(changedDirective, directive)
                this.$emit('on-change', { renderDirectives })
            }
        }
    }
</script>

<style lang='postcss' scoped>
    .directive-home {
        margin: 0 10px;
    }
    .directive-item.bk-form-item {
        margin: 0 !important;
    }
    .directive-tip {
        margin: 10px 0 0;
        padding: 0;
        font-size: 12px;
        font-weight: normal;
    }
    .directive-label {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: calc(100 - 80px);
    }
    .under-line {
        line-height: 20px;
        border-bottom: 1px dashed #979ba5;
        cursor: pointer;
    }
</style>
