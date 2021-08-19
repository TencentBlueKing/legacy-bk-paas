<template>
    <bk-form :label-width="84" :model="copyForm" ref="funcForm" :form-type="formType" class="func-form-item">
        <bk-form-item label="函数类型" property="funcType">
            <span v-for="temp in tempList"
                :key="temp.id"
                @click="changeTemType(temp.id)"
                :class="['func-temp', { select: copyForm.funcType === temp.id }]"
            >{{ temp.name }}
                <i class="bk-icon icon-info" v-if="temp.info" v-bk-tooltips="{ content: `<pre class='component-method-tip'>${temp.info}</pre>` }"></i>
            </span>
        </bk-form-item>
        <bk-form-item
            label="参数"
            property="funcParams"
            error-display-type="normal"
            :rules="[nameRule]"
            :desc="{ width: 350, content: '调用该函数传入的参数列表，如果函数用于组件事件，则这里是组件事件回调的参数，组件事件回调参数具体可见组件文档。输入后按回车添加参数' }">
            <bk-tag-input
                placeholder="请输入参数名称，由大小写英文字母、下划线、数字组成"
                v-model="copyForm.funcParams"
                :list="[]"
                :allow-create="true"
                :has-delete-icon="true"
                @change="(val) => updateValue('funcParams', val)">
            </bk-tag-input>
        </bk-form-item>
        <template v-if="copyForm.funcType === 1">
            <bk-form-item
                label="远程参数"
                property="remoteParams"
                error-display-type="normal"
                desc="接口回调函数的参数列表，输入后按回车添加参数"
                :rules="[nameRule]">
                <bk-tag-input
                    placeholder="请输入参数名称，由大小写英文字母、下划线、数字组成"
                    v-model="copyForm.remoteParams"
                    :list="[]"
                    :allow-create="true"
                    :has-delete-icon="true"
                    @change="(val) => updateValue('remoteParams', val)">
                </bk-tag-input>
            </bk-form-item>
            <bk-form-item
                label="Api Url"
                property="funcApiUrl"
                error-display-type="normal"
                :required="true"
                :rules="[requireRule('Api Url')]"
                :desc="`请输入接口 URL，例如：{{domain}}/api/data/getMockData`">
                <bk-input v-model="copyForm.funcApiUrl" @input="(val) => updateValue('funcApiUrl', val)"></bk-input>
            </bk-form-item>
            <bk-form-item
                label="Method"
                property="funcMethod"
                error-display-type="normal"
                :required="true"
                :rules="[requireRule('Method')]">
                <bk-select v-model="copyForm.funcMethod" @selected="(val) => updateValue('funcMethod', val)" :clearable="false" :popover-options="{ appendTo: 'parent' }">
                    <bk-option v-for="option in methodList"
                        :key="option.id"
                        :id="option.id"
                        :name="option.name">
                    </bk-option>
                </bk-select>
            </bk-form-item>
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
                    :placeholder="`请输入请求体数据包，例如：{ name: {{name}}, age: 17 }`"
                    @input="(val) => updateValue('funcApiData', val)"
                ></bk-input>
            </bk-form-item>
        </template>
        <bk-form-item label="函数简介" property="funcSummary">
            <bk-input
                type="textarea"
                v-model="copyForm.funcSummary"
                :rows="3"
                :maxlength="100"
                @input="(val) => updateValue('funcSummary', val)"
            ></bk-input>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import mixins from './form-item-mixins'

    export default {
        mixins: [mixins],

        data () {
            return {
                monacoHeight: 200,
                monacoWidth: 200,
                tempList: [
                    { id: 0, name: '空白函数' },
                    { id: 1, name: '远程函数', info: '建议以下几种情况使用 "远程函数":\n1、远程API需要携带用户登录态认证\n2、远程API无法跨域或纯前端访问' }
                ],
                methodList: [
                    { name: 'GET', id: 'get' },
                    { name: 'POST', id: 'post' },
                    { name: 'PUT', id: 'put' },
                    { name: 'DELETE', id: 'delete' },
                    { name: 'HEAD', id: 'head' },
                    { name: 'OPTIONS', id: 'options' },
                    { name: 'TRACE', id: 'trace' },
                    { name: 'CONNECT', id: 'connect' },
                    { name: 'PATCH', id: 'patch' }
                ],
                nameRule: {
                    validator: (val) => (val.length <= 0 || val.every(x => /^[A-Za-z_0-9]+$/.test(x))),
                    message: '由大小写英文字母、下划线、数字组成',
                    trigger: 'blur'
                },
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
        },

        methods: {
            changeTemType (id) {
                this.copyForm.funcType = id
                this.updateValue('funcType', id)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .func-temp {
        display: inline-block;
        width: 140px;
        max-width: calc(50% - 5px);
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #ffffff;
        border: 1px solid #c4c6cc;
        border-radius: 2px 0px 0px 2px;
        color: #63656e;
        box-sizing: content-box;
        cursor: pointer;
        &:first-child {
            border-right: none;
        }
        &:last-child {
            border-left: none;
        }
        &.select {
            background: #e1ecff;
            border: 1px solid #3a84ff;
            color: #3a84ff;
        }
    }
</style>
