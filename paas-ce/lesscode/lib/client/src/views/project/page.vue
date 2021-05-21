<template>
    <section v-bkloading="{ isLoading: isLoading }" style="height: 100%">
        <main class="pages pages-content" v-show="!isLoading">
            <div class="pages-head">
                <bk-button theme="primary" @click="handleCreate">新建页面</bk-button>
                <bk-button @click="handlePreviewProject">预览项目</bk-button>
                <bk-button @click="handleDownLoadProject">源码下载</bk-button>
                <div class="extra">
                    <bk-input
                        :style="{ width: '400px' }"
                        placeholder="请输入页面名称"
                        :clearable="true"
                        :right-icon="'bk-icon icon-search'"
                        v-model="keyword"
                        @clear="handleSearch(true)"
                        @enter="handleSearch(false)">
                    </bk-input>
                </div>
            </div>
            <div class="pages-body">
                <div class="page-list">
                    <div class="page-item" v-for="(page, index) in renderList" :key="index">
                        <div class="item-bd">
                            <div class="preview" @click="handleEditPage(page.id)">
                                <img v-if="page.previewImg" :src="getPreviewImg(page.previewImg)" alt="页面缩略预览">
                                <div class="empty-preview-img" v-else>页面为空</div>
                                <div class="mask">
                                    <div class="operate-btns">
                                        <bk-button class="edit-btn" theme="primary">编辑</bk-button>
                                        <bk-button class="preview-btn" @click.stop="handlePreview(page)">预览</bk-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="item-ft">
                            <div class="col">
                                <h3 class="name" :title="page.pageName">{{page.pageName}}</h3>
                                <div class="stat">{{ page.updateUser || page.createUser }} {{ getRelativeTime(page.updateTime) }}更新</div>
                            </div>
                            <div class="col">
                                <bk-dropdown-menu :ref="`moreActionDropdown${page.id}`">
                                    <span slot="dropdown-trigger" class="more-menu-trigger">
                                        <i class="bk-drag-icon bk-drag-more-dot"></i>
                                    </span>
                                    <ul class="bk-dropdown-list" slot="dropdown-content" @click="hideDropdownMenu(page.id)">
                                        <li><a href="javascript:;" @click="handleDownloadSource(page.content, page.id, page.lifeCycle)">下载源码</a></li>
                                        <li><a href="javascript:;" @click="handleRename(page)">重命名</a></li>
                                        <li><a href="javascript:;" @click="handleCopy(page)">复制</a></li>
                                        <li><a href="javascript:;" @click="handleDelete(page)" :class="{ 'g-no-permission': userPerm.roleId === 2 }" v-bk-tooltips="{ content: '无删除权限', placements: ['right'], disabled: userPerm.roleId === 1 }">删除</a></li>
                                    </ul>
                                </bk-dropdown-menu>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="empty" v-show="(!pageList.length || !renderList.length) && !isLoading">
                    <bk-exception class="exception-wrap-item exception-part" type="empty" scene="part">
                        <div v-if="!pageList.length" class="empty-page">暂无页面，<bk-link theme="primary" @click="handleCreate">立即创建</bk-link></div>
                        <div v-else>无搜索结果</div>
                    </bk-exception>
                </div>
            </div>
            <page-dialog ref="pageDialog" :action="action" :current-name="currentName" :refresh-list="getPageList"></page-dialog>
            <download-dialog ref="downloadDialog"></download-dialog>
        </main>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import preivewErrImg from '@/images/preview-error.png'
    import pageDialog from '@/components/project/page-dialog'
    import downloadDialog from '@/views/system/components/download-dialog'
    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    import 'dayjs/locale/zh-cn'
    dayjs.extend(relativeTime)
    dayjs.locale('zh-cn')

    export default {
        components: {
            pageDialog,
            downloadDialog
        },
        data () {
            return {
                action: '',
                currentName: '',
                keyword: '',
                renderList: [],
                pageList: [],
                isLoading: true
            }
        },
        computed: {
            ...mapGetters('layout', ['pageLayout']),
            ...mapGetters('project', ['currentProject']),
            projectId () {
                return this.$route.params.projectId
            },
            pageId () {
                return this.$route.params.pageId || ''
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
            }
        },
        async created () {
            await this.getPageList()
        },
        methods: {
            async getPageList () {
                this.isLoading = true
                try {
                    this.pageList = await this.$store.dispatch('page/getList', { projectId: this.projectId })
                    if (this.keyword) {
                        this.renderList = this.pageList.filter(item => item.pageName.indexOf(this.keyword) !== -1)
                    } else {
                        this.renderList = this.pageList
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.isLoading = false
                }
            },
            handleCreate () {
                this.action = 'create'
                this.$refs.pageDialog.dialog.formData.id = undefined
                this.$refs.pageDialog.dialog.formData.pageName = ''
                this.$refs.pageDialog.dialog.formData.pageCode = ''
                this.$refs.pageDialog.dialog.formData.pageRoute = ''
                this.$refs.pageDialog.dialog.visible = true
            },
            handlePreviewProject () {
                window.open(`/preview/project/${this.projectId}/`, '_blank')
            },
            async handleCopy (page) {
                this.action = 'copy'
                this.$refs.pageDialog.dialog.formData.id = page.id
                this.$refs.pageDialog.dialog.formData.pageName = `${page.pageName}-copy`
                this.$refs.pageDialog.dialog.formData.pageCode = ''
                this.$refs.pageDialog.dialog.formData.pageRoute = ''
                this.$refs.pageDialog.dialog.visible = true
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
            async handleRename (page) {
                this.action = 'rename'
                this.currentName = page.pageName
                this.$refs.pageDialog.dialog.formData.pageName = page.pageName
                this.$refs.pageDialog.dialog.formData.pageCode = page.pageCode
                this.$refs.pageDialog.dialog.formData.pageRoute = page.pageRoute
                this.$refs.pageDialog.dialog.formData.id = page.id
                this.$refs.pageDialog.dialog.visible = true
            },
            handleDelete (page) {
                if (this.userPerm.roleId === 2) return

                this.$bkInfo({
                    title: '确认删除?',
                    subTitle: `确认删除  “页面${page.pageName}”?`,
                    theme: 'danger',
                    confirmFn: async () => {
                        await this.$store.dispatch('page/delete', {
                            pageId: page.id
                        })
                        this.getPageList()
                    }
                })
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
            handlePreview (page) {
                if (!page.content) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '该页面为空页面，请先编辑页面',
                        limit: 1
                    })
                    return
                }
                window.open(`/preview/project/${this.projectId}/?pageCode=${page.pageCode}`, '_blank')
            },
            handleDownLoadProject () {
                this.$refs.downloadDialog.isShow = true
                this.$refs.downloadDialog.projectId = this.projectId
                this.$refs.downloadDialog.projectName = this.currentProject.projectName
            },
            handleSearch (clear = false) {
                if (clear) {
                    this.keyword = ''
                    this.renderList = this.pageList
                } else {
                    this.renderList = this.pageList.filter(item => item.pageName.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1)
                }
            },
            hideDropdownMenu (pageId) {
                this.$refs[`moreActionDropdown${pageId}`][0].hide()
            },
            getRelativeTime (time) {
                return dayjs(time).fromNow() || ''
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
    .pages-content {
        padding: 16px 24px;
        display: flex;
        flex-direction: column;
        height: 100%;

        .pages-head {
            display: flex;
            margin-bottom: 17px;

            button {
                width: 86px;
                &:not(:first-child) {
                    margin-left: 10px;
                }
            }

            .extra {
                flex: none;
                margin-left: auto;
            }
        }
        .pages-body {
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
            .page-list {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;

                .page-item {
                    position: relative;
                    flex: none;
                    width: 304px;
                    height: 234px;
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
                        width: 292px;
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
                        padding: 4px 0;
                    }
                }
            }
        }
    }
</style>
