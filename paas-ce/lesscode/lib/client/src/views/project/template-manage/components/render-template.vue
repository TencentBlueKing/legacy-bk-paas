<template>
    <section v-bkloading="{ isLoading: isLoading }" style="height: 100%">
        <main class="templates templates-content" v-show="!isLoading">
            <div class="templates-head">
                <div class="extra">
                    <bk-input
                        :style="{ width: '400px' }"
                        placeholder="请输入模板名称"
                        :clearable="true"
                        :right-icon="'bk-icon icon-search'"
                        v-model="keyword"
                        @clear="handleSearch(true)"
                        @enter="handleSearch(false)">
                    </bk-input>
                </div>
            </div>
            <div class="templates-body">
                <div class="template-list">
                    <div class="template-item" v-for="(template, index) in renderList" :key="index">
                        <div class="item-bd">
                            <div class="preview">
                                <img :src="getPreviewImg(template.previewImg)" alt="页面缩略预览">
                                <div class="mask">
                                    <div class="operate-btns">
                                        <bk-button class="edit-btn" theme="primary" @click.stop="handlePreview(template)">预览</bk-button>
                                        <bk-button class="preview-btn" @click="handleDownloadSource(template.content, template.id, template.lifeCycle)">下载源码</bk-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-ft">
                            <div class="col">
                                <h3 class="name" :title="template.templateName">{{template.templateName}}</h3>
                                <div class="stat">{{ template.updateUser || template.createUser }}</div>
                            </div>
                            <div class="col">
                                <bk-dropdown-menu :ref="`moreActionDropdown${template.id}`">
                                    <span slot="dropdown-trigger" class="more-menu-trigger">
                                        <i class="bk-drag-icon bk-drag-more-dot"></i>
                                    </span>
                                    <ul class="bk-dropdown-list" slot="dropdown-content" @click="hideDropdownMenu(template.id)">
                                        <li><a href="javascript:;" @click="handleEdit(template)">编辑</a></li>
                                        <li><a href="javascript:;" @click="handleDelete(template)" :class="{ 'g-no-permission': !getDeletePerm(template) }" v-bk-tooltips="{ content: '无删除权限', disabled: getDeletePerm(template) }">删除</a></li>
                                    </ul>
                                </bk-dropdown-menu>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="empty" v-show="(!templateList.length || !renderList.length) && !isLoading">
                    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                        <div v-if="!templateList.length" class="empty-page">暂无模板</div>
                        <div v-else>无搜索结果</div>
                    </bk-exception>
                </div>
            </div>
            <!-- <page-dialog ref="pageDialog" :action="action" :current-name="currentName" :refresh-list="getTemplateList"></page-dialog> -->
        </main>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import preivewErrImg from '@/images/preview-error.png'
    // import pageDialog from '@/components/project/page-dialog'

    export default {
        // components: {
        //     pageDialog
        // },
        props: {
            categoryId: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                action: '',
                currentName: '',
                currentRoute: {},
                keyword: '',
                renderList: [],
                templateList: [],
                pageRouteList: [],
                routeGroup: [],
                isLoading: true
            }
        },
        computed: {
            ...mapGetters(['user']),
            projectId () {
                return this.$route.params.projectId
            },
            userPerm () {
                return this.$store.getters['member/userPerm'] || { roleId: 2 }
            }
        },
        watch: {
            keyword (val) {
                if (!val) {
                    this.handleSearch(false)
                }
            },
            categoryId () {
                this.getTemplateList()
            }
        },
        async created () {
            await this.getTemplateList()
        },
        methods: {
            async getTemplateList () {
                this.isLoading = true
                try {
                    this.templateList = await this.$store.dispatch('pageTemplate/list', { projectId: this.projectId, categoryId: this.categoryId })

                    if (this.keyword) {
                        this.renderList = this.templateList.filter(item => item.templateName.indexOf(this.keyword) !== -1)
                    } else {
                        this.renderList = this.templateList
                    }
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.isLoading = false
                }
            },
            async handleDownloadSource (targetData, pageId, lifeCycle) {
                if (!targetData) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '该页面为空页面，无源码生成'
                    })
                    return
                }
                console.log('页面列表的下载')
                this.$store.dispatch('vueCode/getPageCode', {
                    targetData: JSON.parse(targetData),
                    projectId: this.projectId,
                    lifeCycle,
                    pageId,
                    layoutContent: this.pageLayout.layoutContent,
                    from: 'download_page'
                }).then((res) => {
                    const downlondEl = document.createElement('a')
                    const blob = new Blob([res])
                    downlondEl.download = `bklesscode-${pageId}.vue`
                    downlondEl.href = URL.createObjectURL(blob)
                    downlondEl.style.display = 'none'
                    document.body.appendChild(downlondEl)
                    downlondEl.click()
                    document.body.removeChild(downlondEl)
                })
            },
            async handleEdit (template) {
                this.action = 'rename'
                this.currentName = template.templateName
                this.$refs.pageDialog.dialog.formData.templateName = template.templateName
                this.$refs.pageDialog.dialog.formData.pageCode = template.pageCode
                this.$refs.pageDialog.dialog.formData.pageRoute = template.pageRoute
                this.$refs.pageDialog.dialog.formData.id = template.id
                this.$refs.pageDialog.dialog.formData.layoutId = null
                this.$refs.pageDialog.dialog.visible = true
            },
            handleDelete (template) {
                if (!this.getDeletePerm(template)) return

                this.$bkInfo({
                    title: '确认删除?',
                    subTitle: `确认删除  “页面${template.templateName}”?`,
                    theme: 'danger',
                    confirmFn: async () => {
                        await this.$store.dispatch('page/delete', {
                            pageId: template.id
                        })
                        this.getTemplateList()
                    }
                })
            },
            getDeletePerm (template) {
                return this.userPerm.roleId === 1 || this.user.username === template.createUser
            },
            handleEditPage (id) {
                this.$router.push({
                    name: 'new',
                    params: {
                        projectId: this.projectId,
                        pageId: id
                    }
                })
            },
            handlePreview (template) {
                if (!template.content) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '该页面为空页面，请先编辑页面',
                        limit: 1
                    })
                    return
                }
                window.open(`/preview/project/${this.projectId}/?pageCode=${template.pageCode}`, '_blank')
            },
            handleSearch (clear = false) {
                if (clear) {
                    this.keyword = ''
                    this.renderList = this.templateList
                } else {
                    this.renderList = this.templateList.filter(item => item.templateName.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1)
                }
            },
            hideDropdownMenu (pageId) {
                this.$refs[`moreActionDropdown${pageId}`][0].hide()
            },
            getPreviewImg (previewImg) {
                if (previewImg && previewImg.length > 30) {
                    return previewImg
                }
                return preivewErrImg
            }
        }
    }
</script>

<style lang="postcss" scoped>
/* page */
    .templates-content {
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        height: 100%;

        .templates-head {
            display: flex;
            margin-bottom: 17px;
        }
        .templates-body {
            display: flex;
            flex: 1;
             .empty {
                flex: 1;
                display: flex;
                align-items: center;
                .empty-page {
                    display: flex;
                    align-items: center;
                }
            }
            .template-list {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;

                .template-item {
                    position: relative;
                    flex: none;
                    width: 290px;
                    height: 226px;
                    margin: 0 14px 30px 0;
                    padding: 6px;
                    background: #fff;
                    border-radius: 0px 6px 6px 6px;
                    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.11);
                    cursor: pointer;

                    &:hover {
                        box-shadow: 1px 2px 8px 2px rgba(0, 0 ,0 , 0.11);

                        .desc {
                            display: block;
                        }
                        .preview {
                            .mask {
                                background: rgba(0, 0, 0, 0.4);
                                .operate-btns {
                                    display: block;
                                    opacity: 1;
                                }
                            }
                        }
                    }
                    .more-menu-trigger {
                        .bk-drag-more-dot {
                            display: block;
                            width: 32px;
                            height: 32px;
                            line-height: 34px;
                            text-align: center;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 20px;
                            color: #979BA5;
                            &:hover {
                                background: #F0F1F5;
                            }
                        }
                    }

                    .item-bd {
                        flex: none;
                        position: relative;
                        width: 286px;
                        height: 158px;
                        background: #fff;
                        border-radius: 4px 4px 0px 0px;
                    }
                    .item-ft {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin: 16px 10px 0 10px;
                    }

                    .preview {
                        position: relative;
                        height: 100%;
                        overflow: hidden;
                        border-radius: 4px 4px 0px 0px;
                        img {
                            max-width: 100%;
                        }

                        .empty-preview-img {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 700;
                            color: #C4C6CC;
                            height: 100%;
                            background: #f0f1f5;
                            border-radius: 4px 4px 0px 0px;
                        }

                        .mask {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.1);
                            display: flex;
                            align-items: center;
                            .operate-btns {
                                display: none;
                                .edit-btn {
                                    width: 86px;
                                    margin-left: 59px;
                                }
                                .preview-btn {
                                    width: 86px;
                                    margin-left: 10px;
                                    margin-rihgt: 59px;
                                }
                            }
                        }

                        /* &::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.2);
                        } */
                    }
                    .desc {
                        display: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        padding: 28px 26px 28px 21px;

                        .desc-text {
                            font-size: 12px;
                            color: #fff;
                            margin: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 5;
                            -webkit-box-orient: vertical;
                        }
                    }
                    .empty {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                        color: #C4C6CC;
                        height: 100%;
                        background: #f0f1f5;
                        border-radius: 4px 4px 0px 0px;
                    }
                    .name {
                        margin: 0;
                        font-size: 12px;
                        font-weight: 700;
                        color: #63656E;
                        width: 240px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .stat {
                        font-size: 12px;
                        color: #979BA5;
                        margin: 4px 0;
                    }
                    .route {
                        display: flex;
                        align-items: center;
                        margin: 9px 0;
                        .label {
                            margin-top: 1px;
                            margin-left: -2px;
                        }
                        .path {
                            width: 212px;
                            font-size: 12px;
                            color: #63656E;
                            margin-left: 5px;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;

                            .unset {
                                color: #FF9C01;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
