<template>
    <div class="render-list">
        <div class="header">
            <bk-button theme="primary" @click="handleShowOperation">新建</bk-button>
            <div class="header-right">
                <type-select class="type-select" @select-change="handleSelectChange"></type-select>
                <a class="download-demo" href="/help/custom" target="_blank">组件开发指引</a>
            </div>
        </div>
        <div class="component-list-content" v-bkloading="{ isLoading }">
            <bk-table
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#f0f1f5' }"
                :data="data"
                :row-class-name="rowClassMethod"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column label="组件名称" prop="name" align="left" min-width="150" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span class="comp-type">
                            <i v-if="row.compType === 'MOBILE'" class="bk-drag-icon bk-drag-mobilephone"> </i>
                            <i v-else class="bk-drag-icon bk-drag-pc"> </i>
                        </span>
                        <span class="component-name">{{ row.displayName }}({{ row.name }})</span>
                        <img
                            v-if="row.status === 1"
                            class="component-off-flag"
                            src="/static/images/icon/off.svg" />
                    </template>
                </bk-table-column>
                <bk-table-column label="组件ID" prop="type" align="left" show-overflow-tooltip />
                <bk-table-column label="所属分类" prop="category" align="left" width="120" show-overflow-tooltip />
                <bk-table-column label="公开范围" prop="scope" align="left" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <div class="component-scope">
                            <span class="scope-name">
                                {{ getScopeName(getPublicScope(row.id)[0]) }}
                            </span>
                            <i class="bk-icon icon-edit2" @click="handleScope(row)" />
                        </div>
                    </template>
                </bk-table-column>
                <bk-table-column label="最新版本" prop="latestVersionId" align="left" width="120">
                    <template slot-scope="{ row }">
                        <div class="component-version" @click="handleVersionDetail(row)">
                            <span>{{ row.version }}</span>
                            <i class="bk-drag-icon bk-drag-info-fill" style="margin-left: 8px" />
                        </div>
                    </template>
                </bk-table-column>
                <bk-table-column label="更新时间" prop="updateTime" align="left" width="160" />
                <bk-table-column label="更新人" prop="updateUser" align="left" width="120" show-overflow-tooltip />
                <bk-table-column label="操作" prop="statusText" align="left" width="200">
                    <template slot-scope="{ row }">
                        <bk-button v-if="row.status === 0" text @click="handleUpdate(row)">更新</bk-button>
                        <bk-button v-if="row.status === 0" text @click="handleOff(row)">下架</bk-button>
                        <bk-button v-if="row.status === 1" text @click="handleOnline(row)">上架</bk-button>
                    </template>
                </bk-table-column>
                <bk-exception slot="empty" class="component-list-empty" type="empty">
                    <div style="font-size: 12px">
                        暂无组件
                        <span>
                            ，<bk-button text theme="primary" @click="handleShowOperation">立即创建</bk-button>
                        </span>
                    </div>
                </bk-exception>
            </bk-table>
        </div>
        <operation
            :is-show.sync="isShowOperation"
            :default-category="categoryId"
            :data="editInfo"
            @on-update="fetchData"
            @on-add="handleComponentAdd" />
        <version-log
            :is-show.sync="isShowVersionLog"
            :data="currentVerionData" />
        <public-scope
            :is-show.sync="isShowPublicScope"
            :data="currentScopeData"
            @on-update="fetchData" />
    </div>
</template>
<script>
    import { execCopy } from '@/common/util'
    import Operation from './operation'
    import VersionLog from '@/components/version-log'
    import PublicScope from '../../public-scope'
    import typeSelect from '@/components/project/type-select'

    export default {
        name: '',
        components: {
            Operation,
            VersionLog,
            PublicScope,
            typeSelect
        },
        props: {
            categoryId: {
                type: Number
            }
        },
        data () {
            return {
                isLoading: true,
                isShowOperation: false,
                isShowVersionLog: false,
                isShowPublicScope: false,
                currentVerionData: {},
                data: [],
                publicScope: {},
                componentScope: {},
                currentScopeData: {
                    scope: [],
                    comp: {}
                },
                pagination: {
                    count: 0,
                    limit: 5,
                    current: 1,
                    limitList: [
                        1,
                        2,
                        5,
                        100
                    ]
                },
                componentId: 0,
                editInfo: {},
                compType: ''
            }
        },
        watch: {
            categoryId () {
                this.fetchData()
            }
        },
        created () {
            this.fetchData()
            const isProd = process.env.V3_ENV === 'prod'
            this.tnpmPrefix = isProd ? '' : 'test-'
        },
        methods: {
            async fetchData () {
                this.isLoading = true
                const res = await this.$store.dispatch('components/list', {
                    belongProjectId: parseInt(this.$route.params.projectId),
                    categoryId: this.categoryId,
                    limit: this.pagination.limit,
                    current: this.pagination.current,
                    compType: this.compType
                })
                this.data = Object.freeze(res.data)
                this.pagination.count = res.count
                this.pagination.limit = res.limit
                this.pagination.current = res.current
                this.publicScope = res.publicScope
                this.isLoading = false
            },
            rowClassMethod (row) {
                const data = row.row
                return data.status === 1 ? 'offline' : ''
            },
            handleShowOperation () {
                this.componentId = 0
                this.isShowOperation = true
                this.editInfo = {}
            },
            handleVersionDetail (comp) {
                this.currentVerionData = comp
                this.isShowVersionLog = true
            },
            handleUpdate (component) {
                this.editInfo = Object.freeze({
                    ...component
                })
                this.isShowOperation = true
            },
            handleComponentAdd () {
                this.$emit('on-change')
            },
            async handleOff (component) {
                await this.$store.dispatch('components/off', {
                    belongProjectId: component.belongProjectId,
                    id: component.id
                })
                this.fetchData()
                this.messageSuccess('操作成功')
            },
            async handleOnline (component) {
                await this.$store.dispatch('components/online', {
                    belongProjectId: component.belongProjectId,
                    id: component.id
                })
                this.fetchData()
                this.messageSuccess('操作成功')
            },
            handleCopytnpm (content) {
                execCopy(content)
            },
            handleScope (component) {
                this.currentScopeData = {
                    scope: this.componentScope[component.id],
                    comp: component
                }
                this.isShowPublicScope = true
            },
            getPublicScope (compId) {
                let scope
                // 是否公开给所有项目
                const isAll = this.publicScope.all.findIndex(item => item.id === compId) !== -1
                if (isAll) {
                    scope = ['所有项目', 1]
                } else if (this.publicScope.specify[compId]) {
                    scope = [this.publicScope.specify[compId], -1]
                } else {
                    scope = ['仅本项目', 0]
                }
                this.componentScope[compId] = scope
                return scope
            },
            getScopeName (scope) {
                if (Array.isArray(scope)) {
                    return scope.map(item => item.projectName).join('，')
                }
                return scope
            },
            handleSelectChange (type) {
                this.compType = type === 'ALL' ? '' : type
                this.pagination.current = 1
                this.fetchData()
            },
            handlePageChange (current) {
                this.pagination.current = current
                this.fetchData()
            },
            handlePageLimitChange (limit) {
                this.pagination.current = 1
                this.pagination.limit = limit
                this.fetchData()
            }
        }
    }
</script>
<style lang='postcss'>
    .render-list{
        padding: 14px 25px 14px 14px;
        .header{
            display: flex;
            align-items: flex-end;
            margin-bottom: 12px;
            .header-right{
                margin-left: auto;
                display: flex;
                align-items: center;
            }
            .download-demo{
                font-size: 12px;
                color: #3a84ff;
            }
            .type-select{
            }
        }
        .component-off-flag{
            width: 42px;
            padding: 0 4px;
            margin-left: 4px;
            margin-bottom: 2px;
            font-size: 12px;
            font-weight: bold;
            vertical-align: middle;
            color: #979BA5;
            background: #F0F1F5;
        }
        .component-version{
            display: flex;
            align-items: center;
            height: 24px;
            padding-left: 3px;
            color: #3A84FF;
            font-weight: bold;
            background: #e1ecff;
            border-radius: 2px;
            cursor: pointer;
            &:hover{
                background: #A2C5FD;
            }
        }
        .component-scope {
            display: flex;
            align-items: center;
            .scope-name {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .bk-icon {
                font-size: 20px;

                &:hover {
                    color: #3a84ff;
                    cursor: pointer;
                }
            }
        }
        .component-updater{
            display: flex;
            align-items: center;
            height: 24px;
            padding-left: 8px;
            color: #63656E;
            border-radius: 2px;
            background: #f0f1f5;
        }
        .component-list-content{
            min-height: calc(100vh - 250px);
        
            .comp-type {
                font-size: 16px;
                color: #979ba5;
                margin-right: 10px;
            }
        }
        .component-list-empty{
            font-size: 14px;
            justify-content: center;
        }
        .bk-table-row{
            &.offline{
                .component-name{
                    text-decoration: line-through;
                }
            }
            .bk-button-text+.bk-button-text {
                margin-left: 10px;
            }
        }
    }
</style>
