<template>
    <div class="field-edit">
        <bk-form form-type="vertical">
            <bk-form-item label="字段名称">
                <bk-input v-model.trim="fieldData.name" @change="handleChangeName" @blur="onNameBlur"></bk-input>
            </bk-form-item>
            <bk-form-item label="唯一标识">
                <bk-input v-model.trim="fieldData.key" @change="change" @blur="onNameBlur"></bk-input>
            </bk-form-item>
            <bk-form-item label="布局">
                <bk-radio-group v-model="fieldData.layout" @change="change">
                    <bk-radio value="COL_6" :disabled="fieldProps.fieldsFullLayout.includes(fieldData.type)">半行</bk-radio>
                    <bk-radio value="COL_12" :disabled="fieldProps.fieldsFullLayout.includes(fieldData.type)">整行</bk-radio>
                </bk-radio-group>
            </bk-form-item>
            <bk-form-item label="填写属性">
                <div class="attr-value">
                    <div class="contidion">
                        <bk-checkbox
                            :true-value="true"
                            :false-value="false"
                            v-model="fieldData.is_readonly">
                            只读
                        </bk-checkbox>
                        <span v-show="fieldData.is_readonly === true" @click="readerOnlyShow = true">条件编辑</span>
                    </div>
                    <div class="contidion">
                        <bk-checkbox
                            :true-value="'REQUIRE'"
                            :false-value="'OPTION'"
                            v-model="fieldData.validate_type">
                            必填
                        </bk-checkbox>
                        <span v-show="fieldData.validate_type === 'REQUIRE'" @click="requireConfigShow = true">条件编辑</span>
                    </div>
                    <div class="contidion">
                        <bk-checkbox
                            :true-value="1"
                            :false-value="0"
                            v-model="fieldData.show_type">
                            隐藏
                        </bk-checkbox>
                        <span v-show="fieldData.show_type === 1" @click="showTypeShow = true">条件编辑</span>
                    </div>
                </div>
            </bk-form-item>
            <bk-form-item label="校验方式">
                <bk-select
                    v-model="fieldData.regex"
                    :clearable="false"
                    :searchable="true"
                    :loading="regexListLoading"
                    :disabled="
                        regexListLoading ||
                            fieldData.source === 'TABLE' ||
                            (fieldData.meta && fieldData.meta.code === 'APPROVE_RESULT')
                    "
                    @selected="change">
                    <bk-option v-for="option in regexList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item
                v-if="fieldProps.fieldsShowDefaultValue.includes(fieldData.type) && fieldData.source_type === 'CUSTOM'"
                label="默认值">
                <default-value
                    :key="fieldData.type"
                    :field="defaultData"
                    @change="handleDefaultValChange">
                </default-value>
            </bk-form-item>
            <bk-form-item label="填写说明">
                <bk-input v-model.trim="fieldData.desc" type="textarea" :rows="4" @change="change"></bk-input>
                <div>
                    <div class="form-tip">
                        <span>  <bk-checkbox v-model="checkTips" @change="handleCheckedChange">添加额外填写说明</bk-checkbox></span>
                        <span class="tips" v-show="checkTips" v-bk-tooltips.top-start="fieldData.tips">效果预览</span>
                    </div>
                    <bk-input
                        v-if="checkTips"
                        class="check-tips-input"
                        v-model.trim="fieldData.tips"
                        type="textarea"
                        :rows="4"
                        @change="change">
                    </bk-input>
                </div>
            </bk-form-item>
        </bk-form>
        <read-only-dialog
            :show.sync="readerOnlyShow"
            :value="fieldData.read_only_conditions"
            @confirm="(val) => onConfirm('read_only_conditions',val)">
        </read-only-dialog>
        <require-dialog
            :show.sync="requireConfigShow"
            :value="fieldData.mandatory_conditions"
            @confirm="(val) => onConfirm('mandatory_conditions',val)">
        </require-dialog>
        <show-type-dialog
            :show.sync="showTypeShow"
            :value="fieldData.show_conditions"
            @confirm="(val) => onConfirm('show_conditions',val)">
        </show-type-dialog>
    </div>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import { FIELDS_FULL_LAYOUT, FIELDS_SHOW_DEFAULT_VALUE } from '../../constant/forms'
    import pinyin from 'pinyin'
    import DefaultValue from './defaultValue.vue'
    import ReadOnlyDialog from './readOnlyDialog.vue'
    import RequireDialog from './requireDialog.vue'
    import ShowTypeDialog from './showTypeDialog.vue'
    export default {
        name: 'formEdit',
        components: {
            DefaultValue,
            ReadOnlyDialog,
            RequireDialog,
            ShowTypeDialog
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: {
                type: Object,
                default: () => ({})
            },
            list: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                fieldData: cloneDeep(this.value),
                checkTips: '',
                regexListLoading: false,
                regexList: [],
                defaultData: this.getDefaultData(),
                fieldProps: {
                    fieldsFullLayout: FIELDS_FULL_LAYOUT,
                    fieldsShowDefaultValue: FIELDS_SHOW_DEFAULT_VALUE
                },
                readerOnlyShow: false,
                requireConfigShow: false,
                showTypeShow: false
            }
        },
        watch: {
            value (val, oldVal) {
                this.fieldData = cloneDeep(val)
                if (val.type !== oldVal.type) {
                    this.getRegexList()
                }
                this.defaultData = this.getDefaultData()
            }
        },
        created () {
            this.getRegexList()
        },
        methods: {
            async getRegexList () {
                try {
                    this.regexListLoading = true
                    const params = {
                        type: this.fieldData.type
                    }
                    const resp = await this.$store.dispatch('fromSetting/getRegexList', params)
                    this.regexList = resp.data.regex_choice.map((item) => {
                        const [id, name] = item
                        return { id, name: name === '' ? '无' : name }
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.regexListLoading = false
                }
            },
            onNameBlur () {
                if (this.fieldData.name === '') {
                    this.fieldData.name = '字段名称'
                    this.change()
                }
            },
            handleChangeName (val) {
                const key = pinyin(val, {
                    style: pinyin.STYLE_NORMAL,
                    heteronym: false
                })
                    .join('_')
                    .toUpperCase()
                this.fieldData.key = key
            },
            handleCheckedChange () {
                this.fieldData.tips = ''
                this.change()
            },
            getDefaultData () {
                const { type, default: defaultVal, choice, meta } = this.value
                let dftVal
                if (['MULTISELECT', 'CHECKBOX', 'MEMBERS', 'MEMBER'].includes(type)) {
                    dftVal = defaultVal ? defaultVal.split(',') : []
                } else {
                    dftVal = cloneDeep(defaultVal)
                }
                return {
                    type,
                    choice,
                    value: dftVal,
                    meta,
                    multiple: ['MULTISELECT', 'CHECKBOX'].includes(type)
                }
            },
            handleDefaultValChange (val) {
                this.fieldData.default = ['MULTISELECT', 'CHECKBOX', 'MEMBER', 'MEMBERS'].includes(this.fieldData.type)
                    ? val.join(',')
                    : cloneDeep(val)
                this.change()
            },
            onConfirm (type, val) {
                this.fieldData[type] = val
                if (type === 'read_only_conditions') {
                    this.readerOnlyShow = false
                } else if (type === 'mandatory_conditions') {
                    this.requireConfigShow = false
                } else {
                    this.showTypeShow = false
                }
                this.change()
            },
            change () {
                this.$emit('change', this.fieldData)
            }
        }
    }
</script>

<style scoped lang="postcss">
/deep/ .bk-form-control {
  & > .bk-form-radio,
  & > .bk-form-checkbox {
    margin-right: 24px;
  }
}

.form-tip {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;

  .tips {
    display: block;
    color: #3a84ff;

    &:hover {
      cursor: pointer;
    }
  }
}

.attr-value{
  display: flex;
  flex-direction: column;
  /deep/ .bk-form-checkbox {
    margin-top: 8px;
  }
  .contidion{
    display: flex;
    justify-content: space-between;
    span{
      color: #3a84ff;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
.check-tips-input {
  margin-top: 16px;
}
</style>
