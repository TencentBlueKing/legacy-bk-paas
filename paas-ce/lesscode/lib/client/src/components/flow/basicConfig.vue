<template>
    <section class="basic-config">
        <div class="basic-config-form">
            <bk-form ref="basicForm" class="form-container" form-type="vertical" :model="formData" :rules="rules">
                <bk-form-item label="功能属性" property="type" :required="true" :error-display-type="'normal'">
                    <bk-select
                        v-model="formData.type"
                        :clearable="false"
                        :searchable="true"
                        :disabled="formData.is_builtin"
                        @change="handleTypeChange">
                        <bk-option v-for="item in typeList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="功能名称" property="name" :required="true" :error-display-type="'normal'">
                    <bk-input v-model="formData.name" :disabled="formData.is_builtin"></bk-input>
                </bk-form-item>
                <bk-form-item label="关联表单" property="worksheet_ids" :required="true" :error-display-type="'normal'">
                    <bk-select
                        :value="formData.worksheet_ids"
                        :loading="formListLoading"
                        :multiple="true"
                        :clearable="false"
                        :searchable="true"
                        :disabled="formData.is_builtin"
                        @selected="handleFormSelect">
                        <bk-option v-for="item in formList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="功能描述" property="desc">
                    <bk-input v-model="formData.desc" type="textarea" :rows="7" :disabled="formData.is_builtin"></bk-input>
                </bk-form-item>
            </bk-form>
        </div>
        <div class="action-wrapper">
            <bk-button size="large" @click="handleCancel">取消</bk-button>
            <bk-button theme="primary" size="large" :loading="basicPending" @click="handleNextStep">下一步</bk-button>
        </div>
    </section>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import isequal from 'lodash.isequal'

    export default {
        name: 'FunctionConfig',
        props: {
            appId: {
                type: String,
                default: ''
            },
            funcData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                formData: cloneDeep(this.funcData),
                formListLoading: false,
                formList: [],
                typeList: [
                    { id: 'ADD', name: '添加', desc: '添加一条数据' },
                    { id: 'EDIT', name: '编辑', desc: '编辑一条数据' },
                    { id: 'DELETE', name: '删除', desc: '删除一条数据' },
                    { id: 'DETAIL', name: '详情', desc: '查看一条数据' }
                ],
                basicPending: false,
                rules: {
                    type: [
                        {
                            required: true,
                            message: '功能属性为必填项',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '功能属性为必填项',
                            trigger: 'blur'
                        }
                    ],
                    worksheet_ids: [
                        {
                            required: true,
                            message: '关联表单为必填项',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created () {
            this.getFormList()
        },
        methods: {
            async getFormList () {
                try {
                    this.formListLoading = true
                    const res = await this.$store.dispatch('setting/getFormList', { project_key: this.appId, page_size: 10000 })
                    this.formList = res.data.items
                } catch (e) {
                    console.error(e)
                } finally {
                    this.formListLoading = false
                }
            },
            handleTypeChange (val) {
                const funcData = this.typeList.find(item => item.id === val)
                this.formData.desc = funcData.desc
                if (val === 'DETAIL') {
                    this.formData.worksheet_ids = []
                }
                this.$emit('select', val)
            },
            // 详情类型的功能只能绑定一个表单
            handleFormSelect (val) {
                if (this.formData.type === 'DETAIL' && val.length > 0) {
                    this.formData.worksheet_ids = val.slice(-1)
                } else {
                    this.formData.worksheet_ids = val
                }
            },
            handleCancel () {
                this.$bkInfo({
                    title: '此操作会导致您的编辑没有保存，确认吗？',
                    type: 'warning',
                    width: 500,
                    confirmFn: () => {
                        this.$router.push({ name: 'functionList', params: { appId: this.appId } })
                    }
                })
            },
            handleNextStep () {
                this.$refs.basicForm.validate(async (result) => {
                    if (!result) {
                        return
                    }
                    // 没有做修改则直接跳到下一步
                    if (this.funcData.id && isequal(this.funcData, this.formData)) {
                        this.$router.push({ name: 'functionFlow', params: { appId: this.appId, funcId: this.funcData.id } })
                        return
                    }
                    try {
                        this.basicPending = true
                        const { type, name, desc, worksheet_ids, key } = this.formData
                        const params = {
                            type,
                            name,
                            desc,
                            key,
                            worksheet_ids,
                            id: this.funcData.id,
                            project_key: this.appId
                        }
                        const action = this.funcData.id ? 'setting/updateFunction' : 'setting/createFunction'
                        const res = await this.$store.dispatch(action, params)
                        this.$emit('update', res.data)
                        this.$router.push({ name: 'functionFlow', params: { appId: this.appId, funcId: res.data.id } })
                    } catch (e) {
                        console.error(e)
                    } finally {
                        this.basicPending = false
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
.basic-config {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.basic-config-form {
  height: calc(100% - 56px);
  padding-top: 24px;
  box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
  border-radius: 2px;
  overflow: auto;
}
.form-container {
  width: 1000px;
  margin: 0 auto;
  padding: 0 200px 32px;
  background: #ffffff;
  overflow: hidden;
  /deep/ .bk-form-item:not(:last-child) {
    margin-top: 18px;
  }
}
.action-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 24px;
  height: 56px;
  line-height: 56px;
  text-align: right;
  background: #fafbfd;
  box-shadow: inset 0 1px 0 0 #dcdee5;
  .bk-button {
    margin-left: 4px;
    min-width: 100px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
