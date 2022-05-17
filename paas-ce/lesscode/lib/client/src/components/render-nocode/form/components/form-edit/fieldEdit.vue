<template>
    <div class="field-edit">
        <bk-form form-type="vertical">
            <div v-if="fieldData.type === 'DESC'">
                <bk-button :theme="'default'" title="内容配置" @click="descCompValueShow = true" class="mr10">
                    内容配置
                </bk-button>
            </div>
            <template v-else-if="fieldData.type === 'DIVIDER'">
                <bk-form-item label="是否展示文字">
                    <bk-input v-model.trim="fieldData.default" @change="change"></bk-input>
                </bk-form-item>
                <bk-form-item label="文字位置">
                    <bk-select
                        v-model="fieldData.deviderAttr.align"
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
                <bk-form-item label="线条颜色">
                    <bk-color-picker v-model="fieldData.deviderAttr.color" size="small" @change="change">
                    </bk-color-picker>
                </bk-form-item>
            </template>
            <template v-else>
                <bk-form-item label="字段名称">
                    <bk-input v-model.trim="fieldData.name" @change="handleChangeName" @blur="onNameBlur"></bk-input>
                </bk-form-item>
                <bk-form-item label="唯一标识">
                    <bk-input v-model.trim="fieldData.key" @change="change" @blur="onNameBlur"></bk-input>
                </bk-form-item>
                <bk-form-item label="表头配置" v-if="fieldData.type === 'TABLE'">
                    <table-header-setting
                        :list="fieldData.choice"
                        @move="handleChangeTableHeader"
                        @remove="handleRemoveChocie"
                        @update="handleUpdateChocie">
                    </table-header-setting>
                    <span class="add-chocie" @click="handleAddTableChoice">添加</span>
                </bk-form-item>
                <bk-form-item label="上传模板附件" :ext-cls="'input-position mt20-item'" v-if="fieldData.type === 'FILE'">
                    <bk-button :theme="'default'" title="点击上传">
                        点击上传
                    </bk-button>
                    <input type="file" :value="fileVal" class="input-file" @change="handleAddFiles">
                    <ul class="file-list">
                        <li v-for="(item, index) in fieldData.fileTemplate" :key="index">
                            <span class="file-success">
                                <i class="bk-icon icon-check-1"></i>
                            </span>
                            <span>{{ item.name }}</span>
                            <span class="file-delete" @click="handleDelete(item, index)">×</span>
                        </li>
                    </ul>
                </bk-form-item>
                <bk-form-item label="布局">
                    <bk-radio-group v-model="fieldData.layout" @change="change">
                        <bk-radio value="COL_6" :disabled="fieldProps.fieldsFullLayout.includes(fieldData.type)">半行</bk-radio>
                        <bk-radio value="COL_12" :disabled="fieldProps.fieldsFullLayout.includes(fieldData.type)">整行</bk-radio>
                    </bk-radio-group>
                </bk-form-item>
                <bk-form-item v-if="fieldProps.fieldsDataSource.includes(fieldData.type)" label="下拉数据源">
                    <div class="source-data">
                        <bk-select
                            :value="fieldData.source_type"
                            :clearable="false"
                            style="width: 200px"
                            @selected="handleSourceTypeChange">
                            <bk-option v-for="item in sourceTypeList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                        </bk-select>
                        <bk-button :theme="'default'" :title="'配置'" @click="dataSourceDialogShow = true">
                            配置
                        </bk-button>
                    </div>
                </bk-form-item>
                <bk-form-item label="填写属性">
                    <div class="attr-value">
                        <div class="contidion">
                            <bk-checkbox
                                :true-value="true"
                                :false-value="false"
                                v-model="fieldData.is_readonly"
                                @change="change">
                                只读
                            </bk-checkbox>
                            <span v-show="fieldData.is_readonly === true" @click="readerOnlyShow = true">条件编辑</span>
                        </div>
                        <div class="contidion">
                            <bk-checkbox
                                :true-value="'REQUIRE'"
                                :false-value="'OPTION'"
                                v-model="fieldData.validate_type"
                                @change="handleChangeValidataType">
                                必填
                            </bk-checkbox>
                            <span v-show="fieldData.validate_type === 'REQUIRE'" @click="requireConfigShow = true">条件编辑</span>
                        </div>
                        <div class="contidion">
                            <bk-checkbox
                                :true-value="1"
                                :false-value="0"
                                v-model="fieldData.show_type"
                                @change="change">
                                隐藏
                            </bk-checkbox>
                            <span v-show="fieldData.show_type === 1" @click="showTypeShow = true">条件编辑</span>
                        </div>
                    </div>
                </bk-form-item>
                <bk-form-item label="控制上传范围" v-if="fieldData.type === 'IMAGE'">
                    <div>
                        <div>
                            <bk-checkbox
                                :disabled="fieldData.validate_type === 'REQUIRE'"
                                :true-value="true"
                                :false-value="false"
                                v-model="fieldData.imageRange.isMin"
                                @change="change">
                                至少上传
                            </bk-checkbox>
                            <bk-input
                                class="up-load-input"
                                type="number"
                                :max="99"
                                :min="1"
                                v-model="fieldData.imageRange.minNum"
                                @change="change">
                            </bk-input>
                            张图
                        </div>
                        <div>
                            <bk-checkbox
                                :true-value="true"
                                :false-value="false"
                                v-model="fieldData.imageRange.isMax"
                                @change="change">
                                最多上传
                            </bk-checkbox>
                            <bk-input
                                class="up-load-input"
                                type="number"
                                style="width: 80px"
                                :max="99"
                                :min="1"
                                v-model="fieldData.imageRange.maxNum"
                                @change="change">
                            </bk-input>
                            张图
                        </div>
                    </div>
                </bk-form-item>
                <bk-form-item label="控制选择范围" v-if="['MULTISELECT','CHECKBOX'].includes(fieldData.type)">
                    <div>
                        <div>
                            <bk-checkbox
                                :disabled="fieldData.validate_type === 'REQUIRE'"
                                :true-value="true"
                                :false-value="false"
                                v-model="fieldData.imageRange.isMin"
                                @change="handleSelectMinChoice">
                                至少选择
                            </bk-checkbox>
                            <bk-input
                                class="up-load-input"
                                type="number"
                                :max="99"
                                :min="1"
                                v-model="fieldData.imageRange.minNum"
                                @change="change">
                            </bk-input>
                            个选项
                        </div>
                        <div>
                            <bk-checkbox
                                :true-value="true"
                                :false-value="false"
                                v-model="fieldData.imageRange.isMax"
                                @change="change">
                                最多选择
                            </bk-checkbox>
                            <bk-input
                                class="up-load-input"
                                type="number"
                                style="width: 80px"
                                :max="99"
                                :min="1"
                                v-model="fieldData.imageRange.maxNum"
                                @change="change">
                            </bk-input>
                            个选项
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
                    label="默认值"
                    v-if="fieldProps.fieldsShowDefaultValue.includes(fieldData.type) && fieldData.source_type === 'CUSTOM'">
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
            </template>
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
        <data-source-dialog
            :show.sync="dataSourceDialogShow"
            :app-id="'1'"
            :source-type="fieldData.source_type"
            :field-type="fieldData.type"
            :value="sourceData"
            @confirm="handleDataSourceChange">
        </data-source-dialog>
        <config-desc-comp-value-dialog
            :show.sync="descCompValueShow"
            :value="fieldData.value"
            @confirm="handleDescValueChange">
        </config-desc-comp-value-dialog>
    </div>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import pinyin from 'pinyin'
    import DefaultValue from './defaultValue.vue'
    import ReadOnlyDialog from './readOnlyDialog.vue'
    import RequireDialog from './requireDialog.vue'
    import ShowTypeDialog from './showTypeDialog.vue'
    import DataSourceDialog from './dataSourceDialog.vue'
    import ConfigDescCompValueDialog from './configDescCompValueDialog'
    import TableHeaderSetting from './tableHeaderSetting.vue'
    import {
        FIELDS_FULL_LAYOUT,
        FIELDS_SHOW_DEFAULT_VALUE,
        DATA_SOURCE_FIELD,
        FIELDS_SOURCE_TYPE
    } from '../../constant/forms'

    export default {
        name: 'formEdit',
        components: {
            DefaultValue,
            TableHeaderSetting,
            ReadOnlyDialog,
            RequireDialog,
            ShowTypeDialog,
            DataSourceDialog,
            ConfigDescCompValueDialog
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
                    fieldsShowDefaultValue: FIELDS_SHOW_DEFAULT_VALUE,
                    fieldsDataSource: DATA_SOURCE_FIELD
                },
                dataSourceDialogShow: false,
                readerOnlyShow: false,
                requireConfigShow: false,
                showTypeShow: false,
                descCompValueShow: false,
                fileVal: ''
            }
        },
        computed: {
            sourceTypeList () {
                if (this.fieldData.type === 'TABLE') {
                    return FIELDS_SOURCE_TYPE.filter(item => item.id === 'CUSTOM')
                }
                return FIELDS_SOURCE_TYPE
            },
            sourceData () {
                const { source_type, choice, meta, api_info, kv_relation } = this.fieldData
                let data = {}
                switch (source_type) {
                    case 'CUSTOM':
                        data = choice
                        break
                    case 'API':
                        data = { api_info, kv_relation }
                        break
                    case 'WORKSHEET':
                        data = meta.data_config
                        break
                }
                return data
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
                    const resp = await this.$store.dispatch('nocode/formSetting/getRegexList', params)
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
            handleAddFiles (e) {
                const fileInfo = e.target.files[0]
                const maxSize = 100000
                const fileSize = fileInfo.size / 1024
                const fileName = fileInfo.name
                for (let i = 0; i < this.fileList.length; i++) {
                    if (fileName === this.fieldData.fileTemplate.name) {
                        this.$bkMessage({
                            message: '此文件已经上传',
                            theme: 'error'
                        })
                        break
                    }
                }
                if (fileSize <= maxSize) {
                    const data = new FormData()
                    data.append('field_file', fileInfo)
                    // todo ajax
                } else {
                    this.fileVal = ''
                    this.$bkMessage({
                        message: '该文件大小超过100MB',
                        theme: 'error'
                    })
                }
                this.change()
            },
            handleDelete (item, index) {
                this.fieldData.fileTemplate.splice(index, 1)
                this.change()
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
            // 数据源配置变更
            handleDataSourceChange (val) {
                const { source_type } = this.fieldData
                this.dataSourceDialogShow = false
                if (source_type === 'CUSTOM') {
                    this.fieldData.choice = val
                } else if (source_type === 'API') {
                    this.fieldData.api_info = val.api_info
                    this.fieldData.kv_relation = val.kv_relation
                } else if (source_type === 'WORKSHEET') {
                    this.fieldData.meta.data_config = val
                }
                this.change()
            },
            // 数据源类型切换
            handleSourceTypeChange (val) {
                this.fieldData.source_type = val
                if (val === 'CUSTOM') {
                    this.fieldData.choice = [
                        { key: 'XUANXIANG1', name: '选项1', color: '#FF8C00', isDefaultVal: true },
                        { key: 'XUANXIANG2', name: '选项2', color: '#3A84FF', isDefaultVal: false }
                    ]
                    this.fieldData.api_info = {}
                    this.fieldData.kv_relation = {}
                } else if (val === 'API') {
                    this.fieldData.choice = []
                    this.fieldData.api_info = {
                        remote_api_id: '',
                        remote_system_id: '',
                        req_body: {},
                        req_params: {},
                        rsp_data: ''
                    }
                    this.fieldData.kv_relation = { key: '', name: '' }
                } else if (val === 'WORKSHEET') {
                    this.fieldData.choice = []
                    this.fieldData.api_info = {}
                    this.fieldData.kv_relation = {}
                    this.fieldData.meta.data_config = {
                        // id: '',
                        field: '',
                        source: {
                            project_key: this.appId
                        },
                        target: {
                            project_key: this.appId,
                            worksheet_id: ''
                        },
                        conditions: {
                            connector: '',
                            expressions: []
                        }
                    }
                }
                this.change()
            },
            // 设置描述组件的值
            handleDescValueChange (val) {
                this.descCompValueShow = false
                this.fieldData.value = val
                this.change()
            },
            handleChangeValidataType (val) {
                if (val === 'REQUIRE') {
                    this.fieldData.imageRange.isMin = true
                }
                this.change()
            },
            handleSelectMinChoice (val) {
                if (val) {
                    this.fieldData.validate_type = 'REQUIRE'
                }
                this.change()
            },
            handleChangeTableHeader (newIndex, oldIndex) {
                this.fieldData.timeStamp = Date.parse(new Date())
                const field = this.fieldData.choice.splice(oldIndex, 1)
                this.fieldData.choice.splice(newIndex, 0, field[0])
                this.change()
            },
            handleRemoveChocie (index) {
                this.fieldData.choice.splice(index, 1)
                this.change()
            },
            handleUpdateChocie ($event, index) {
                this.fieldData.choice.splice(index, 1, $event)
                this.change()
            },
            handleAddTableChoice () {
                this.fieldData.choice.push({
                    choice: [],
                    display: '',
                    name: '',
                    required: false
                })
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

.attr-value {
  display: flex;
  flex-direction: column;

  /deep/ .bk-form-checkbox {
    margin-top: 8px;
  }

  .contidion {
    display: flex;
    justify-content: space-between;

    span {
      color: #3a84ff;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.check-tips-input {
  margin-top: 16px;
}

.source-data {
  display: flex;
  justify-content: space-between;
}

.mt20-item {
  margin-top: 20px !important;
}

.up-load-input {
  width: 80px;
  margin: 8px;
}

.input-position {
  position: relative;

  .input-file {
    position: absolute;
    top: 0;
    left: 0;
    width: 96px;
    height: 36px;
    overflow: hidden;
    opacity: 0;
    cursor: pointer;
  }

  .file-list {
    margin-top: 10px;
    line-height: 25px;
    font-size: 14px;
    color: #424950;

    li {
      &:hover {
        background-color: #dfeeff;
      }
    }

    .file-success {
      color: #30d878;
      font-size: 12px;
    }

    .file-delete {
      float: right;
      font-size: 20px;
      color: #7a7f85;
      cursor: pointer;
    }
  }
}

.add-chocie{
  color: #3a84ff;
  font-size: 14px;
  margin-top: 8px;
  &:hover{
    cursor: pointer;
  }
}
</style>
