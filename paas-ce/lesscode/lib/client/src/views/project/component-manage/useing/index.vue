<template>
    <div :class="$style['component-manage-useing-page']">
        <div :class="$style['search']">
            <div :class="$style['version-selector']">
                项目版本：<project-version-selector :bordered="false" :popover-width="200" v-model="projectVersionId" />
            </div>
            <bk-input
                :class="$style['search-input']"
                right-icon="bk-icon icon-search"
                placeholder="请输入组件名称"
                v-model.trim="keyword"
                @clear="handleSearch"
                @enter="handleSearch"
                :clearable="true" />
        </div>
        <div :class="$style['data-list']" v-bkloading="{ isLoading, opacity: 0.1 }">
            <bk-table
                :outer-border="false"
                :header-border="false"
                :header-cell-style="{ background: '#f0f1f5' }"
                :data="list"
                v-show="!isLoading">
                <bk-table-column label="组件名称" prop="compName" min-width="180" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span :class="$style['component-name']">{{ row.displayName }}({{ row.name }})</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="来源项目" prop="compSource" min-width="120" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span>{{row.belongProjectId !== row.sourceProject.id ? row.sourceProject.projectName : '本项目'}}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="所属分类" prop="category" min-width="120" sortable show-overflow-tooltip />
                <!-- <bk-table-column label="是否公开" prop="isPublic" show-overflow-tooltip>
                </bk-table-column> -->
                <bk-table-column label="使用版本" prop="currentVersion" width="150" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <div :class="[$style['component-version'], { [$style['outdate']]: row.useingVersion.versionId !== row.versionId }]"
                            @click="handleVersionDetail(row, 1)">
                            <span>{{ row.useingVersion.version }}</span>
                            <i class="bk-drag-icon bk-drag-info-fill" style="margin-left: 8px" />
                        </div>
                    </template>
                </bk-table-column>
                <bk-table-column label="最新版本" prop="latestVersion" width="150" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <div :class="$style['component-version']" @click="handleVersionDetail(row)">
                            <span>{{ row.version }}</span>
                            <i class="bk-drag-icon bk-drag-info-fill" style="margin-left: 8px" />
                        </div>
                    </template>
                </bk-table-column>
                <bk-table-column label="使用页面" prop="usingPage" min-width="280" show-overflow-tooltip>
                    <template slot-scope="{ row }">
                        <span :class="$style['component-pages']">
                            <span>{{ row.pageList.map(_ => _.pageName).join('、') }}</span>
                        </span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作" width="120">
                    <template slot-scope="{ row }">
                        <span v-bk-tooltips="{ content: '已升级到最新版本', placements: ['top'], disabled: row.useingVersion.versionId !== row.versionId }">
                            <bk-button
                                text
                                :disabled="row.useingVersion.versionId === row.versionId"
                                @click="handleUpdate(row)">
                                升级
                            </bk-button>
                        </span>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>

        <bk-dialog v-model="updateDialog.visible"
            render-directive="if"
            theme="primary"
            ext-cls="confirm-dialog-wrapper"
            title="确认升级组件？"
            width="400"
            footer-position="center"
            :mask-close="false"
            :auto-close="false">
            <p class="tips-content">
                将会把该项目“{{selectedProjectVersionName}}”版本里所有页面中使用到的【{{updateDialog.data.displayName}}】组件统一升级到【{{updateDialog.data.version}}】版本，请谨慎操作
            </p>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="primary"
                    :loading="updateDialog.loading"
                    @click="handleUpdateConfirm">升级</bk-button>
                <bk-button @click="updateDialog.visible = false" :disabled="updateDialog.loading">取消</bk-button>
            </div>
        </bk-dialog>

        <version-log
            :is-show.sync="isShowVersionLog"
            :data="verionDetail" />
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import VersionLog from '@/components/version-log'

    export default {
        name: '',
        components: {
            VersionLog
        },
        data () {
            return {
                isLoading: false,
                data: [],
                list: [],
                keyword: '',
                isShowVersionLog: false,
                isShowUpdateDialog: false,
                updateDialog: {
                    visible: false,
                    loading: false,
                    data: {}
                },
                verionDetail: {},
                selectedProjectVersionId: ''
            }
        },
        computed: {
            ...mapGetters('projectVersion', ['getVersionById']),
            projectVersionId: {
                get () {
                    return this.getInitialVersion().id
                },
                set (id) {
                    this.selectedProjectVersionId = id
                }
            },
            selectedProjectVersionName () {
                return this.getVersionById(this.selectedProjectVersionId).version
            }
        },
        watch: {
            keyword (val) {
                if (!val) {
                    this.handleSearch()
                }
            },
            selectedProjectVersionId () {
                this.fetchData()
            }
        },
        methods: {
            async fetchData () {
                this.isLoading = true
                this.data = await this.$store.dispatch('components/useing', {
                    belongProjectId: parseInt(this.$route.params.projectId),
                    projectVersionId: this.selectedProjectVersionId || ''
                })
                this.list = this.data
                this.isLoading = false
            },
            async handleUpdateConfirm () {
                this.updateDialog.loading = true
                try {
                    await this.$store.dispatch('components/updatePageComp', {
                        projectId: parseInt(this.$route.params.projectId),
                        projectVersionId: this.selectedProjectVersionId || '',
                        compId: this.updateDialog.data.id,
                        versionId: this.updateDialog.data.versionId,
                        displayName: this.updateDialog.data.displayName
                    })
                    this.updateDialog.visible = false
                    this.fetchData()
                    this.messageSuccess('升级成功')
                } catch (e) {
                    console.error(e)
                } finally {
                    this.updateDialog.loading = false
                }
            },
            handleUpdate (payload) {
                this.updateDialog.visible = true
                this.updateDialog.data = payload
            },
            handleVersionDetail (comp, isCurrent) {
                this.verionDetail = isCurrent ? { ...comp, ...comp.useingVersion } : comp
                this.isShowVersionLog = true
            },
            handleSearch () {
                if (!this.keyword) {
                    this.list = this.data
                } else {
                    this.list = this.data.filter(item => {
                        return item.displayName.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1
                            || item.name.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1
                    })
                }
            },
            getInitialVersion () {
                return this.$store.getters['projectVersion/initialVersion']()
            }
        }
    }
</script>
<style lang="postcss" module>
    .component-manage-useing-page {
        padding: 14px 27px 22px 32px;

        .search {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;

            .version-selector {
                display: flex;
                align-items: center;
            }

            .search-input {
                width: 400px;
            }
        }

        .data-list {
            min-height: calc(100vh - 250px);
        }

        .component-version {
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

            &.outdate {
                background: #F0F1F5;
                &:hover {
                    background: #DCDEE5;
                }
            }
        }
    }

    :global {
        .confirm-dialog-wrapper {
            .bk-dialog-footer {
                text-align: center;
                padding: 0 65px 30px;
                background-color: #fff;
                border: none;
                border-radius: 0;
            }
            .dialog-footer {
                button {
                    width: 86px;
                    & + button {
                        margin-left: 4px;
                    }
                }
            }
        }
    }
</style>
