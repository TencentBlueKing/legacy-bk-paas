<template>
    <div class="filter-area">
        <i
            v-if="filters.length > 0"
            :class="['bk-icon icon-funnel filter-expand-icon', { actived: expanding }]"
            @click="expanding = !expanding">
        </i>
        <div class="filter-form-area">
            <div v-if="expanding" class="filter-form-content">
                <bk-form
                    class="form-container"
                    form-type="vertical">
                    <bk-form-item
                        v-for="(item, index) in mockDataFilter"
                        style="width: 230px; margin-right: 16px;"
                        :key="index"
                        :label="item.name">
                        <bk-select
                            style="background: #ffffff"
                            v-if="isComSelect(item.type)"
                            :multiple="['MULTISELECT','CHECKBOX'].includes(item.type)"
                            :searchable="item.type === 'INPUTSELECT'"
                            v-model="item.value"
                            :placeholder="`请选择${item.name}`">
                            <bk-option v-for="option in item.choice"
                                :key="option.key"
                                :id="option.key"
                                :name="option.name">
                            </bk-option>
                        </bk-select>
                        <bk-date-picker
                            v-else-if="isComDate(item.type)"
                            :type="'daterange'"
                            :placeholder="`请输入${item.name}`"
                            v-model="item.value" />
                        <bk-input
                            v-else
                            v-model="item.value"
                            :placeholder="`请输入${item.name}`"
                            :type="inputComType(item.type)">
                        </bk-input>
                        <!--人员选择器-->
                    </bk-form-item>
                </bk-form>
                <div class="form-buttons">
                    <bk-button size="small" theme="primary" @click="handleSearch">查询</bk-button>
                    <bk-button size="small" @click="handleCancel">取消</bk-button>
                </div>
            </div>
            <div v-if="!expanding && conditions.length > 0" class="selected-conditions">
                <bk-tag
                    v-for="(condition,index) in conditions"
                    :key="condition.key"
                    closable
                    @close="handleClose(condition,index)">
                    {{`${condition.name}:${condition.value}`}}
                </bk-tag>
            </div>
        </div>
    </div>
</template>
<script>
    import mockData from '../../common/mockFormData.json'
    import dayjs from 'dayjs'

    export default {
        name: 'filterArea',
        props: {
            fields: {
                type: Array,
                default: () => []
            },
            filters: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                expanding: false,
                conditions: [],
                mockDataFilter: mockData.filter(item => !['TABLE', 'RICHTEXT', 'FILE', 'LINK', 'IMAGE'].includes(item.type)),
                tableData: []
            }
        },
        methods: {
            handleSearch () {
                const conditions = this.formatSearchCondition()
                const searchParams = {
                    connector: 'and',
                    expressions: conditions
                }
                this.$emit('search', searchParams)
                this.expanding = false
            },
            handleClose (condition, index) {
                this.conditions.splice(index, 1)
                const deleteIndex = this.mockDataFilter.findIndex(item => item.key === condition.key)
                this.$set(this.mockDataFilter[deleteIndex], 'value', '')
                const conditions = this.formatSearchCondition()
                const searchParams = {
                    connector: 'and',
                    expressions: conditions
                }
                this.$emit('search', searchParams)
            },
            handleClear (key) {
                const index = this.mockDataFilter.findIndex(item => item.key === key)
                this.$set(this.mockDataFilter[index], 'value', '')
            },
            handleCancel () {
                this.expanding = true
            },
            isComSelect (type) {
                return ['SELECT', 'INPUTSELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO'].includes(type)
            },
            isComDate (type) {
                return ['DATE', 'DATETIME'].includes(type)
            },
            inputComType (type) {
                return type === 'INT' ? 'number' : 'text'
            },
            formatSearchCondition () {
                const searchConditions = [] // 搜索条件
                const displayCondition = [] // 展示tag
                this.mockDataFilter.forEach(item => {
                    // value 可能存在 string 和array两种类型

                    if (item.value || (Array.isArray(item.value) && item.value.every(i => i))) {
                        const key = item.key
                        if (['DATE', 'DATETIME'].includes(item.type)) { // 时间类型
                            item.value.forEach((el, index) => {
                                searchConditions.push({ key, value: dayjs(el).format('YYYY-MM-DD HH:mm:ss'), type: 'const', condition: index === 0 ? '>=' : '<=' })
                            })
                            if (item.value.every(i => i)) {
                                displayCondition.push({
                                    key,
                                    value: `${dayjs(item.value[0]).format('YYYY-MM-DD HH:mm:ss')}--${dayjs(item.value[1]).format('YYYY-MM-DD HH:mm:ss')}`,
                                    name: item.name
                                })
                            }
                        } else if (item.type === 'INT') { // 数字
                            searchConditions.push({ key, value: Number(item.value), type: 'const', condition: '==' })
                            displayCondition.push({
                                key,
                                value: item.value,
                                name: item.name
                            })
                        } else if (this.isComSelect(item.type)) { // 下拉框
                            searchConditions.push({ key, value: item.value.toString(), type: 'const', condition: '==' })
                            const name = []
                            item.choice.forEach(choice => {
                                if (item.value.toString().split(',').find(el => el === choice.key)) {
                                    name.push(choice.name)
                                }
                            })
                            displayCondition.push({
                                key,
                                value: name.toString(),
                                name: item.name
                            })
                        } else if (['MEMBER', 'MEMBERS'].includes(item.type)) {
                            searchConditions.push({ key, value: item.value.toString(), type: 'const', condition: '==' })
                            displayCondition.push({
                                key,
                                value: name.toString(),
                                name: item.name
                            })
                        } else { // 普通文本
                            searchConditions.push({ key, value: item.value, type: 'const', condition: 'icontains' })
                            displayCondition.push({
                                key,
                                value: item.value,
                                name: item.name
                            })
                        }
                    }
                })
                this.conditions = displayCondition
                return searchConditions
            }
        }
    }
</script>
<style lang="postcss" scoped>
.filter-area {
  position: relative;
  margin-bottom: 16px;
}

.filter-expand-icon {
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  color: #979ba5;
  background: #fff;
  border: 1px solid #c4c6cc;
  border-radius: 2px;
  cursor: pointer;

  &.actived {
    color: #699df4;
    border-color: #699df4;
  }
}

.filter-form-content {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 2px;
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  >>> .bk-form-item {
    margin-top: 0;
  }
}

.form-buttons {
  margin-top: 16px;

  .bk-button {
    margin-right: 4px;
  }
}
</style>
