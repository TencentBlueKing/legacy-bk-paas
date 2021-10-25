<template>
    <bk-form :model="form" :label-width="82" ref="basicForm" v-if="isEdit">
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
        ref,
        reactive,
        watch
    } from '@vue/composition-api'

    const formFields = [
        { label: '表名', required: true, property: 'tableName' },
        { label: '存储引擎', disabled: true, property: 'engine' },
        { label: '字符集', disabled: true, property: 'character' },
        { label: '备注', property: 'comment' }
    ]

    const rules = {
        tableName: [
            {
                required: true,
                message: '表名是必填项',
                trigger: 'blur'
            }
        ]
    }

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
            const basicForm = ref(null)
            const form = reactive({ tableName: '', comment: '' })

            watch(
                props.basicInfo,
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

            return {
                basicForm,
                validate,
                form,
                formFields,
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
