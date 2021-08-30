<template>
    <bk-form :label-width="110" :model="copyForm" ref="funcForm" :form-type="formType" class="func-form-item" v-if="copyForm.funcType === 1">
        <bk-form-item
            label="Api Data"
            property="funcApiData"
            error-display-type="normal"
            :rules="[objRule]"
            :desc="{ width: 350, content: 'HTTP 请求（例如 POST）的请求体数据包。如果是GET请求，请在 Api Url 中填写请求头参数' }">
            <bk-input
                type="textarea"
                v-model="copyForm.funcApiData"
                :rows="3"
                :maxlength="500"
                :disabled="disabled"
                :placeholder="`请输入请求体数据包，例如：{ name: {{name}}, age: 17 }`"
                @input="(val) => updateValue('funcApiData', val)">
            </bk-input>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import mixins from './form-item-mixins'

    export default {
        mixins: [mixins],

        data () {
            return {
                objRule: {
                    validator: (val) => {
                        try {
                            const Fn = Function
                            const replaceVal = val.replace(/\{\{([^\}]+)\}\}/g, (all, code) => `this.${code}`)
                            const relVal = new Fn(`return ${replaceVal}`)()
                            const type = Object.prototype.toString.call(relVal)
                            return type === '[object Object]' || val === '' || this.form.funcType === 0
                        } catch (error) {
                            return false
                        }
                    },
                    message: 'apiData需要是json格式的数据',
                    trigger: 'blur'
                }
            }
        }
    }
</script>
