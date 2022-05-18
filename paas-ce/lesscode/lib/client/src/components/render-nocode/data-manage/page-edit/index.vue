<template>
    <div class="data-manage-content">
        <div class="operating-buttons">
            <button-group />
        </div>
        <div class="data-filter-area">
            <bk-form class="filters-form" form-type="vertical">
                <bk-form-item
                    v-for="(item, index) in filters"
                    v-hover="{ type: 'filters', index, click: handleCompClick, delete: handleCompDel }"
                    :key="index"
                    style="width: 230px; margin-right: 16px;"
                    :label="item.name">
                    <bk-input size="small" style="pointer-events: none;" :placeholder="`请输入${item.name}`" />
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
                <!--                <div class="add-filter-btn">-->
                <!--                    <bk-button-->
                <!--                        icon="plus"-->
                <!--                        size="small"-->
                <!--                        @click.stop="addFilterForm">-->
                <!--                        {{ filters.length > 0 ? '' : '筛选条件' }}-->
                <!--                    </bk-button>-->
                <!--                </div>-->
            </bk-form>
        </div>
        <div class="data-table-edit">
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
                fieldList: cloneDeep(mockData),
                selectList: this.getSelectList(mockData)
            }
        },
        methods: {
            // addFilterForm () {
            //     this.filters.push({ name: '', type: '', id: '' })
            // },
            getSelectList (data) {
                const UN_SEARCH_ABLE_ARR = ['TABLE', 'RICHTEXT', 'FILE', 'LINK', 'IMAGE']
                return data.filter(item => !UN_SEARCH_ABLE_ARR.includes(item.type))
            },
            addTableAction () {
                this.tableConfig[0].innerActions.push({ name: '默认', type: '' })
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
            }
        }
    }
</script>
<style lang="postcss" scoped>
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

</style>
