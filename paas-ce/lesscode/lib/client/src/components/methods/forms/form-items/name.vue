<template>
    <bk-form :label-width="110" :model="form" ref="funcForm" :form-type="formType">
        <bk-form-item
            label="函数名称"
            property="funcName"
            error-display-type="normal"
            :required="true"
            :rules="[requireRule('函数名称'), nameRepeatRule, groupNameRule]">
            <bk-input
                placeholder="由大小写英文字母、数字组成，开头和结尾还可以是下划线，且必须符合驼峰命名规范"
                :disabled="disabled"
                :value="form.funcName"
                @input="(funcName) => updateValue({ funcName })"
            >
            </bk-input>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import mixins from './form-item-mixins'

    export default {
        mixins: [mixins],

        props: {
            functionList: {
                type: Array,
                default: () => ([])
            }
        },

        data () {
            return {
                nameRepeatRule: {
                    validator: (val) => {
                        return !this.functionList.find((func) => (func.funcName === val && func.id !== this.form.id))
                    },
                    message: '函数名称在当前应用下重复，请修改后重试',
                    trigger: 'blur'
                },
                groupNameRule: {
                    validator: val => /^[A-Za-z_][A-Za-z]*[A-Za-z_]?$/.test(val),
                    message: '由大小写英文字母组成，开头和结尾还可以是下划线，且必须符合驼峰命名规范',
                    trigger: 'blur'
                }
            }
        }
    }
</script>
