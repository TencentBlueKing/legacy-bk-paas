<template>
    <bk-form :label-width="110" :model="copyForm" ref="funcForm" :form-type="formType" class="func-form-item">
        <bk-form-item
            label="函数标识"
            :required="true"
            :rules="[requireRule('函数标识'), codeRepeatRule, codeRule, keyWordRule]"
            property="funcCode"
            error-display-type="normal">
            <bk-input
                v-model="copyForm.funcCode"
                @input="(val) => updateValue('funcCode', val)"
                :disabled="disabled"
                placeholder="由大小写英文字母、下划线、数字组成">
            </bk-input>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import mixins from './form-item-mixins'
    import { mapGetters } from 'vuex'
    import { isJsKeyWord } from '@/common/util'

    export default {
        mixins: [mixins],

        data () {
            return {
                codeRepeatRule: {
                    validator: (val) => {
                        return !this.funcGroups.some((group) => {
                            const functionList = group.functionList || []
                            return functionList.some((func) => (func.funcCode === val && func.id !== this.form.id))
                        })
                    },
                    message: `函数标识在当前项目下重复，请修改后重试`,
                    trigger: 'blur'
                },
                codeRule: {
                    validator: (val) => /^[A-Za-z_0-9]*$/.test(val),
                    message: '由大小写英文字母、下划线、数字组成',
                    trigger: 'blur'
                },
                keyWordRule: {
                    validator: (val) => !isJsKeyWord(val),
                    message: '函数标识不能是 JavaScript 保留字',
                    trigger: 'blur'
                }
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups'])
        }
    }
</script>
