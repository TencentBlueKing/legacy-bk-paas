<template>
    <div class="data-manage-content">
        <!--        顶部按钮区-->
        <div class="operating-buttons">
            <button-group />
        </div>
        <!--搜索区域-->
        <div class="data-filter-area">
            <bk-form class="filters-form" form-type="vertical">
                <bk-form-item
                    v-for="(item, index) in filters"
                    v-hover="{ type: 'filters', index, click: handleCompClick, delete: handleCompDel }"
                    :key="index"
                    style="width: 230px; margin-right: 16px;"
                    :label="item.name">
                    <bk-select size="small" style="pointer-events: none; background: #ffffff" :placeholder="`请选择${item.name}`" v-if="isComSelect(item.type)" />
                    <bk-date-picker size="small" style="pointer-events: none;width: 230px;" :placeholder="`请输入${item.name}`" v-else-if="isComDate(item.type)" />
                    <bk-input
                        v-else
                        size="small"
                        style="pointer-events: none;"
                        :placeholder="`请输入${item.name}`"
                        :type="inputComType(item.type)"
                    />
                </bk-form-item>
                <bk-dropdown-menu
                    @show="dropdownShow"
                    @hide="dropdownHide"
                    v-if="selectList.length > 0"
                    ref="dropdown"
                    ext-cls="dropdown">
                    <div class="add-search" slot="dropdown-trigger">
                        <div class="add-filter-btn">
                            <bk-button
                                icon="plus"
                                size="small">
                                筛选条件
                            </bk-button>
                        </div>
                    </div>
                    <ul class="bk-dropdown-list" slot="dropdown-content">
                        <li v-for="(ele,index) in selectList" :key="ele.key">
                            <a @click="triggerHandler(ele,index)">{{ ele.name }}</a>
                        </li>
                    </ul>
                </bk-dropdown-menu>
            </bk-form>
        </div>
        <!--列表区域-->
        <div class="data-table-edit">
            <span
                class="bk-table-setting-icon bk-icon icon-cog-shape setting-icon"
                v-bk-tooltips="htmlConfig"
                ref="settingTooltips">
            </span>
            <div id="setting-content" class="setting-content">
                <div class="filed-content">
                    <div class="filed-title">
                        <div class="table-setting">表格设置</div>
                        <div class="select-all">
                            <bk-checkbox v-model="selectAll" @change="handleSelectAll">
                                全选
                            </bk-checkbox>
                        </div>
                    </div>
                    <div class="sys-filed">系统字段</div>
                    <bk-checkbox-group v-model="sysSelectFields" style="margin-bottom: 24px">
                        <bk-checkbox
                            v-for="item in sysFieldList"
                            :value="item.key"
                            :key="item.key"
                            ext-cls="sys-box">
                            {{ item.name }}
                        </bk-checkbox>
                    </bk-checkbox-group>
                    <div class="sys-filed">自定义字段</div>
                    <div class="custom-container">
                        <bk-checkbox-group v-model="customFields">
                            <bk-checkbox
                                v-for="item in selectionFields"
                                :value="item.key"
                                :key="item.key"
                                ext-cls="sys-box">
                                {{ item.name }}
                            </bk-checkbox>
                        </bk-checkbox-group>
                    </div>
                </div>
                <div class="confirm-sty">
                    <bk-button :theme="'primary'" @click="onConfirm">确定</bk-button>
                    <bk-button :theme="'default'" @click="onCancel">取消</bk-button>
                </div>
            </div>
            <bk-table :data="tableConfig">
                <bk-table-column type="selection" width="60"></bk-table-column>
                <bk-table-column
                    v-for="field in fieldList"
                    :key="field.id"
                    :label="field.name"
                    :prop="field.key"
                >
                </bk-table-column>
                <bk-table-column label="操作" :label-width="150">
                    <table-action-group />
                </bk-table-column>
            </bk-table>
        </div>
    <!-- <page-element-operate :hover="hoverData" :active="selectedData"></page-element-operate> -->
    </div>
</template>
<script>
    import hoverDiretive from './hover-directive.js'
    import ButtonGroup from './buttonGroup'
    import TableActionGroup from './tableActionGroup'
    import mockData from '../../common/mockFormData.json'
    import cloneDeep from 'lodash.clonedeep'
    import { SYS_FIELD } from '../../common/field'

    export default {
        name: 'DataPage',
        components: { TableActionGroup, ButtonGroup },
        directives: {
            hover: hoverDiretive,
            ButtonGroup,
            TableActionGroup
        },
        data () {
            return {
                pageActive: false,
                operatingButtons: [],
                filters: [],
                tableConfig: [{ innerActions: [] }],
                hoverComp: {
                    el: null,
                    data: {}
                },
                localFieldList: [],
                fieldList: cloneDeep(mockData),
                selectList: this.getSelectList(mockData),
                htmlConfig: {
                    allowHtml: true,
                    width: 500,
                    trigger: 'click',
                    theme: 'light',
                    content: '#setting-content',
                    placement: 'bottom-end',
                    extCls: 'custom-tip'
                },
                selectAll: false,
                sysFieldList: SYS_FIELD,
                sysSelectFields: [],
                customFields: [],
                selectionFields: []
            }
        },
        created () {
            this.getFormList()
        },
        methods: {
            getFormList () {
                // 关联的表单
                this.localFieldList = cloneDeep(mockData)
                this.selectionFields = cloneDeep(mockData)
                this.customFields = this.selectionFields.map(i => i.key)
            },
            getTableConfig () {
            // TODO 获取表单配置项
            },
            getSelectList (data) {
                const UN_SEARCH_ABLE_ARR = ['TABLE', 'RICHTEXT', 'FILE', 'LINK', 'IMAGE']
                return data.filter(item => !UN_SEARCH_ABLE_ARR.includes(item.type))
            },
            handleCompClick (data) {
                console.log('click', data)
            },
            handleCompDel (data) {
                const { index } = data
                this.selectList.push(this.filters[index])
                this.filters.splice(index, 1)
                // console.log('delete', data)
            },
            dropdownShow () {
                this.isDropdownShow = true
            },
            dropdownHide () {
                this.isDropdownShow = false
            },
            triggerHandler (item, index) {
                this.filters.push(item)
                this.selectList.splice(index, 1)
                this.$emit('change', item)
            },
            onConfirm () {
                // 点击确认 同步自定义字段勾选的值
                const curSelectFields = this.localFieldList.filter(item => this.customFields.includes(item.key))
                const curSelectSysFields = SYS_FIELD.filter(item => this.sysSelectFields.includes(item.key))
                this.fieldList = curSelectFields.concat(curSelectSysFields)
                this.selectList = this.getSelectList(curSelectFields).concat(curSelectSysFields)
                console.log(this.selectList)
                this.$refs.settingTooltips._tippy.hide()
            },
            onCancel () {
                this.customFields = this.selectionFields.map(i => i.key)
                this.$refs.settingTooltips._tippy.hide()
            },
            handleSelectAll () {
                if (this.selectAll) {
                    this.sysSelectFields.push(...this.sysFieldList.filter(filed => !this.sysSelectFields.includes(filed.key))
                        .map(field => field.key))
                    this.customFields.push(...this.selectionFields.filter(field => !this.customFields.includes(field.key))
                        .map(field => field.key))
                } else {
                    this.sysSelectFields = []
                    this.customFields = []
                }
            },
            isComSelect (type) {
                return ['SELECT', 'INPUTSELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO'].includes(type)
            },
            isComDate (type) {
                return ['DATE', 'DATETIME'].includes(type)
            },
            inputComType (type) {
                return type === 'INT' ? 'number' : 'text'
            }
        }
    }

</script>
<style lang="postcss" scoped>
@import "@/css/mixins/scroller";
.data-manage-content {
  padding: 24px;
  height: 100%;
  background: #ffffff;
}

.operating-buttons {
  display: flex;
  flex-wrap: wrap;

  .btn-item {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.data-filter-area {
  margin-bottom: 16px;
  padding: 16px;
  min-height: 120px;
  background: #f5f7fa;

  .filters-form {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;

    >>> .bk-form-item {
      margin-top: 0;
    }

    .add-filter-btn {
      display: flex;
      align-items: flex-end;
    }
  }
}

.data-table-edit {
  position: relative;
}

.setting-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 42px;
  height: 42px;
  color: #63656E;
  line-height: 42px;
  border-left: 1px solid #DCDEE5;
  z-index: 10;
}

.custom-container {
  height: 150px;

  /deep/ .bk-form-control {
    height: 117px;
    overflow: auto;
    margin-bottom: 24px;
    @mixin scroller;
  }
}

.filed-title {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  padding-bottom: 24px;

  .table-setting {
    font-size: 20px;
    line-height: 28px;
    color: #313238;
    width: 90px;
  }

  .select-all {
    font-size: 14px;
    color: #63656E;
    width: 50px;
  }
}
.confirm-sty {
  font-size: 14px;
  padding: 10px;
  height: 50px;
  text-align: right;
  margin-top: 8px;
  margin-left: -14px;
  margin-bottom: -8px;
  margin-right: -14px;
  background-color: #fafbfd;
  border-top: 1px solid #dcdee5;
  border-bottom: 1px solid #dcdee5;
}

.sys-filed {
  display: inline-block;
  font-size: 14px;
  color: #313238;
  margin-bottom: 12px;
}

.sys-box {
  display: inline-block;
  width: calc(33.33333% - 15px);
  margin: 10px 15px 0 0;

  /deep/ .bk-checkbox-text {
    overflow: hidden;
    white-space: nowrap;
    width: calc(100% - 22px);
    text-overflow: ellipsis;
  }
}

.dropdown {

  .bk-dropdown-list {
    cursor: pointer;
    height: 100%;
    overflow-y: auto;
  }

  /deep/ .bk-dropdown-content {
    top: 10px;
  }
}
/deep/ .bk-form-content{
  min-height: 0;
  .bk-date-picker .bk-date-picker-rel {
    .icon-wrapper{
      width: 26px;
      height: 26px;
    }
    .bk-date-picker-editor{
      height: 26px;
    }
  }
}

</style>

<style lang="postcss">
.bk-table-setting-content {
  .content-title {
    display: none;
  }

  .content-line-height {
    display: none;
  }

}

.custom-tip {
  .tippy-tooltip {
    width: 400px !important;
    max-height: 420px;
    border: 1px solid #DCDEE5;
    box-shadow: 0 0 6px 0 #DCDEE5;
  }

  .tippy-content {
    height: 100%;
  }

  .setting-content {
    height: 100%;

    .filed-content {
      min-height: 100%;
      margin-bottom: -50px;
      padding: 13px 10px;;
    }
  }

}
</style>
