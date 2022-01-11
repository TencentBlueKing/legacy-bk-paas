<template>
    <div class="page-select">
        <div class="page-name">
            <i
                class="bk-drag-icon bk-drag-arrow-back"
                title="返回页面列表"
                @click="handleBackPageList" />
            <span class="seperate-line">|</span>
            <span
                class="bk-drag-icon template-logo"
                title="返回项目列表"
                @click="handleBackProjectList">
                <svg
                    aria-hidden="true"
                    width="16"
                    height="16">
                    <use xlink:href="#bk-drag-logo" />
                </svg>
            </span>
            <span class="seperate-line">|</span>
            <div
                id="editPageSwitchPage"
                class="select-page-box">
                <bk-select
                    ext-cls="select-page"
                    ext-popover-cls="select-page-dropdown"
                    ref="pageSelect"
                    :value="pageDetail.id"
                    :clearable="false"
                    :searchable="true"
                    @change="handlePageChange">
                    <div slot="trigger">
                        <div
                            class="name-content"
                            :title="`${pageDetail.pageName}【${projectDetail.projectName}】`">
                            {{ pageDetail.pageName }}<span class="project-name">【{{ projectDetail.projectName }}】</span>
                        </div>
                        <i class="bk-select-angle bk-icon icon-angle-down" />
                    </div>
                    <bk-option
                        v-for="option in pageList"
                        :key="option.id"
                        :id="option.id"
                        :name="option.pageName">
                        <span>{{option.pageName}}</span>
                        <i class="bk-drag-icon bk-drag-copy"
                            style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%)"
                            @click.stop="handleNewPage('copy')"
                            title="复制页面"></i>
                    </bk-option>
                    <div slot="extension" class="extension">
                        <div
                            class="page-row"
                            @click="handleNewPage('create')">
                            <i class="bk-icon icon-plus-circle" /> 新建空白页面
                        </div>
                        <div
                            class="page-row"
                            @click="handlePageFromTemplate">
                            <i class="bk-icon icon-plus-circle" /> 从模板新建页面
                        </div>
                    </div>
                </bk-select>
            </div>
        </div>
        <page-dialog
            ref="pageDialog"
            :action="newPageAction" />
        <page-from-template-dialog ref="pageFromTemplateDialog" />
    </div>
</template>
<script>
    import {
        mapState,
        mapGetters
    } from 'vuex'
    import PageDialog from '@/components/project/page-dialog'
    import PageFromTemplateDialog from '@/components/project/page-from-template-dialog'

    export default {
        name: '',
        components: {
            PageDialog,
            PageFromTemplateDialog
        },
        data () {
            return {
                newPageAction: ''
            }
        },
        computed: {
            ...mapState('route', ['layoutPageList']),
            ...mapGetters('project', [
                'projectDetail'
            ]),
            ...mapGetters('page', [
                'pageDetail',
                'pageList'
            ])
        },
        created () {
            this.projectId = parseInt(this.$route.params.projectId)
            this.pageId = parseInt(this.$route.params.pageId)
        },
        methods: {
            /**
             * @desc 返回项目页面列表
             */
            handleBackPageList () {
                this.$router.push({
                    name: 'pageList',
                    params: {
                        projectId: this.projectId,
                        pageId: this.pageId
                    }
                })
            },
            /**
             * @desc 返回用户项目列表
             */
            handleBackProjectList () {
                this.$router.push({
                    name: 'projects',
                    params: {
                        projectId: this.projectId,
                        pageId: this.pageId
                    }
                })
            },
            /**
             * @desc 页面切换
             */
            handlePageChange (pageId) {
                if (pageId === this.pageId) {
                    return
                }
                this.$bkInfo({
                    title: '确认离开?',
                    subTitle: `您将离开画布编辑页面，请确认相应修改已保存`,
                    confirmFn: async () => {
                        this.$router.push({
                            params: {
                                projectId: this.projectId,
                                pageId
                            }
                        })
                    }
                })
            },
            /**
             * @desc 新建页面
             * @param { String } 新建类型
             *
             * - 新建空白页面
             * - 复制指定页面页面新建
             */
            handleNewPage (action) {
                this.newPageAction = action
                if (action === 'create') {
                    this.$refs.pageDialog.dialog.formData.id = undefined
                    this.$refs.pageDialog.dialog.formData.pageName = ''
                } else {
                    const layoutId = (this.layoutPageList.find(({ pageId }) => pageId === Number(this.pageId)) || {}).layoutId
                    this.$refs.pageDialog.dialog.formData.id = this.pageId
                    this.$refs.pageDialog.dialog.formData.layoutId = layoutId
                    this.$refs.pageDialog.dialog.formData.pageName = `${this.pageDetail.pageName}-copy`
                }

                this.$refs.pageDialog.dialog.formData.pageCode = ''
                this.$refs.pageDialog.dialog.formData.pageRoute = ''
                this.$refs.pageDialog.dialog.visible = true
                this.$refs.pageSelect.close()
            },
            /**
             * @desc 通过模板新建页面
             */
            handlePageFromTemplate () {
                this.$refs.pageFromTemplateDialog.isShow = true
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .page-select {
        display: flex;
        width: 342px;
        align-items: center;
        .page-name {
            display: flex;
            align-items: center;
            height: 100%;
            .bk-drag-icon {
                padding: 10px;
                cursor: pointer;
            }
            .bk-drag-arrow-back {
                font-size: 13px;
                color: #3a84ff;
            }
            .template-logo svg {
                vertical-align: middle;
            }
            .seperate-line {
                width: 1px;
                color: #d8d8d8;
                margin-left: -2px;
            }

            .name-content {
                font-size: 14px;
                margin-left: 10px;
                width: 190px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .project-name {
                    color: #979BA5;
                }
            }

            .select-page-box{
                display: flex;
                flex: 1;
                align-items: center;
                height: 100%;
                .select-page {
                    width: 250px;
                    margin-left: 5px;
                    border: none;
                    background-color: #f0f1f5;
                    &:hover {
                        background-color: #dedee5;
                    }
                    &.is-focus {
                        box-shadow: none;
                        background-color: #dedee5;
                    }
                }
            }
        }
    }
</style>
