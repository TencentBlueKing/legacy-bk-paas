<template>
    <bk-form :model="form" :label-width="82" ref="basicForm" v-if="isEdit" v-bkloading="{ isLoading }">
        <bk-form-item
            v-for="field in formFields"
            :key="field.property"
            :label="field.label"
            :property="field.property"
            :required="field.required"
            :rules="rules[field.property]"
            error-display-type="normal"
        >
            <bk-input
                v-model="form[field.property]"
                :disabled="field.disabled"
                class="section-item"
                @change="change"
            ></bk-input>
        </bk-form-item>
    </bk-form>
    <ul v-else class="info-table">
        <li
            v-for="field in formFields"
            :key="field.property"
            class="table-field"
        >
            <span class="field-label">{{ field.label }}：</span>
            <span class="field-value">{{ form[field.property] }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRef,
        ref,
        reactive,
        watch,
        onBeforeMount
    } from '@vue/composition-api'
    import { messageError } from '@/common/bkmagic'
    import store from '@/store'
    import router from '@/router'

    export default defineComponent({
        props: {
            isEdit: {
                type: Boolean,
                default: true
            },
            basicInfo: {
                type: Object,
                default: () => ({})
            }
        },

        setup (props, { emit }) {
            const currentRoute = router?.currentRoute
            const projectId = currentRoute?.params?.projectId
            const tableId = currentRoute?.query?.id
            let tableList = []
            const basicForm = ref(null)
            const form = reactive({ tableName: '', comment: '' })
            const isLoading = ref(false)
            const canEditTableName = currentRoute?.name === 'createTable'
            const formFields = [
                { label: '表名', required: true, disabled: !canEditTableName, property: 'tableName' },
                { label: '存储引擎', disabled: true, property: 'engine' },
                { label: '字符集', disabled: true, property: 'character' },
                { label: '备注', property: 'comment' }
            ]
            // 校验规则
            const rules = {
                tableName: [
                    {
                        required: true,
                        message: '表名是必填项',
                        trigger: 'blur'
                    }, {
                        regex: /^[a-zA-Z][a-zA-Z-_]*[a-zA-Z]$/,
                        message: '开头和结尾需是大小写字母，中间可以是大小写字母、连字符和下划线。长度最少为2个字符',
                        trigger: 'blur'
                    }, {
                        validator (val) {
                            return tableList.findIndex((table) => (table.tableName === val && +table.id !== +tableId)) <= -1
                        },
                        message: '表名不能重复',
                        trigger: 'blur'
                    }
                ]
            }

            watch(
                toRef(props, 'basicInfo'),
                (val) => {
                    Object.assign(form, val)
                },
                {
                    immediate: true,
                    deep: true
                }
            )

            const validate = () => {
                return new Promise((resolve, reject) => {
                    basicForm.value.validate().then(() => {
                        resolve(form)
                    }, validator => {
                        reject(new Error(`${validator.field}：${validator.content}`))
                    })
                })
            }

            const change = () => {
                emit('change')
            }

            const getAllTable = () => {
                if (!canEditTableName) return

                const params = { projectId }
                isLoading.value = true
                store.dispatch('dataSource/list', params).then((res) => {
                    tableList = res.list
                }).catch((err) => {
                    messageError(err.message || err)
                }).finally(() => {
                    isLoading.value = false
                })
            }

            onBeforeMount(getAllTable)

            return {
                basicForm,
                validate,
                form,
                formFields,
                isLoading,
                rules,
                change
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .section-item {
        width: 483px;
    }
    .info-table {
        &:after {
            content: '';
            display: table;
            clear: both;
        }
        .table-field {
            float: left;
            line-height: 36px;
            font-size: 12px;
            width: 260px;
            .field-label {
                width: 60px;
                display: inline-block;
            }
            &:nth-child(even) {
                width: calc(100% - 260px);
            }
        }
    }
</style>
