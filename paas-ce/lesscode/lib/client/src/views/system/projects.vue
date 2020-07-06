<template>
    <main class="projects page-content">
        <div class="page-head">
            <bk-button theme="primary" @click="handleCreate">新建</bk-button>
            <ul class="filter-links">
                <router-link tag="li"
                    :class="['link-item', { 'router-link-exact-active': !$route.query.filter }]"
                    :to="{ name: 'projects', query: { filter: '' } }">
                    全部项目
                </router-link>
                <router-link tag="li" class="link-item" :to="{ name: 'projects', query: { filter: 'my' } }">
                    我创建的
                </router-link>
                <router-link tag="li" class="link-item" :to="{ name: 'projects', query: { filter: 'favorite' } }">
                    我收藏的
                </router-link>
                <router-link tag="li" class="link-item" :to="{ name: 'projects', query: { filter: 'share' } }">
                    我的共享
                </router-link>
            </ul>
            <div class="extra">
                <bk-input
                    :style="{ width: '400px' }"
                    placeholder="请输入项目名称或描述"
                    :clearable="true"
                    :right-icon="'bk-icon icon-search'"
                    v-model="keyword">
                </bk-input>
            </div>
        </div>
        <div class="page-body">
            <div class="project-list">
                <div class="project-item" v-for="(project, index) in projectList" :key="index">
                    <div class="item-bd">
                        <template v-if="project.pageCount > 0">
                            <div class="preview">
                                <img :src="projectPreivewImg" alt="项目缩略预览">
                            </div>
                            <div class="desc">
                                <p class="desc-text">
                                    项目xxx是一款面向应用的 CMDB，在 ITIL 体系里，CMDB 是构建其它流程平台是一款面向应用的 CMDB，在 ITIL 体系里，
                                    CMDB 是构建其它流程平台是一款面向应用的 CMDB，在 ITIL 体系里，CMDB 是构建其它流程平台是一款面向应用的 CMDB，
                                    在 ITIL 体系里，CMDB 是构建其它流程的基石，而在蓝鲸智云体系里，配置平台就扮演着基石的角色，为应用提供了各种运维场景的配置数据服务
                                </p>
                            </div>
                        </template>
                        <div class="empty" v-else>暂无页面</div>
                    </div>
                    <div class="item-ft">
                        <div class="col">
                            <h3 class="name">{{index}}. {{project.projectName}}</h3>
                            <div class="stat">testuser 45 分钟前更新</div>
                        </div>
                        <div class="col">
                            <bk-dropdown-menu>
                                <span slot="dropdown-trigger" class="more-menu-trigger">
                                    <i class="bk-drag-icon bk-drag-more-dot"></i>
                                </span>
                                <ul class="bk-dropdown-list" slot="dropdown-content">
                                    <li><a href="javascript:;">下载源码</a></li>
                                    <li><a href="javascript:;">重命名</a></li>
                                    <li><a href="javascript:;">复制</a></li>
                                    <li><a href="javascript:;">删除</a></li>
                                </ul>
                            </bk-dropdown-menu>
                        </div>
                    </div>
                    <span
                        class="favorite-btn"
                        v-bk-tooltips.top="{ content: project.collected ? '取消收藏' : '添加收藏' }">
                        <i :class="['bk-drag-icon', `bk-drag-favorite${project.collected ? '' : '-o' }`]"></i>
                    </span>
                </div>
            </div>
            <bk-exception v-if="!projectList.length" class="exception-wrap-item exception-part" type="empty" scene="part">
                暂无项目，<bk-link theme="primary" @click="handleCreate">立即创建</bk-link>
            </bk-exception>
        </div>

        <bk-dialog v-model="dialog.create.visible"
            theme="primary"
            width="600"
            :mask-close="false"
            header-position="left"
            title="创建项目">
            <bk-form :label-width="90" :model="dialog.create.formData">
                <bk-form-item label="项目名称" :required="true" :property="'name'">
                    <bk-input v-model="dialog.create.formData.name"></bk-input>
                </bk-form-item>
                <bk-form-item label="项目ID" :required="true" :property="'id'">
                    <bk-input v-model="dialog.create.formData.id"></bk-input>
                </bk-form-item>
                <bk-form-item label="项目简介" :required="true" :property="'desc'">
                    <bk-input
                        v-model="dialog.create.formData.desc"
                        :type="'textarea'"
                        :rows="3"
                        :maxlength="100">
                    </bk-input>
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </main>
</template>

<script>
    import projectPreivewImg from '@/images/homeBg.jpg'

    export default {
        data () {
            return {
                keyword: '',
                projectList: Array(20).fill({
                    projectName: '项目xxx',
                    pageCount: Math.round(Math.random()),
                    collected: false
                }),
                projectPreivewImg,
                dialog: {
                    create: {
                        visible: false,
                        formData: {}
                    }
                }
            }
        },
        watch: {
            '$route.query': function (query) {
                const { filter } = query
                console.log(filter)
            }
        },
        created () {
        },
        methods: {
            beforeRouteUpdate (to, from, next) {
                console.log(to, from)
                next()
            },
            handleCreate () {
                console.log('create')
                this.dialog.create.visible = true
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .filter-links {
        display: flex;
        align-items: center;
        margin-left: 16px;
        .link-item {
            padding: 6px 12px;
            margin: 0 8px;
            border-radius: 16px;
            cursor: pointer;

            &:hover {
                background: #E1ECFF;
            }

            &.router-link-exact-active {
                background: #E1ECFF;
                color: #3A84FF;
            }
        }
    }

    .project-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;

        .project-item {
            position: relative;
            flex: none;
            width: 312px;
            height: 243px;
            margin: 0 14px 30px 0;
            padding: 6px;
            background: #fff;
            border-radius: 0px 6px 6px 6px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.11);
            cursor: pointer;

            &::before {
                content: "";
                position: absolute;
                top: -10px;
                left: 0;
                width: 156px;
                height: 10px;
                border-radius: 6px 0px 0px 0px;
                background: linear-gradient(-160deg, transparent 9px, #dcdee5 0)
            }
            &:hover {
                .desc {
                    display: block;
                }
                .favorite-btn {
                    display: block;
                }
                .preview {
                    &::before {
                        background: rgba(0, 0, 0, 0.4);
                    }
                }
            }

            .favorite-btn {
                display: none;
                position: absolute;
                right: 16px;
                top: 16px;

                .bk-drag-icon {
                    font-size: 18px;
                    color: #63656E;
                    cursor: pointer;
                }
                .bk-drag-favorite {
                    color: #FE9C00;
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
                width: 300px;
                height: 166px;
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
                font-size: 0;
                height: 100%;
                overflow: hidden;
                border-radius: 4px 4px 0px 0px;
                img {
                    max-width: 100%;
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.2);
                }
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
                font-size: 14px;
                font-weight: 700;
                color: #63656E;
            }
            .stat {
                font-size: 12px;
                color: #979BA5;
                padding: 4px 0;
            }
        }
    }
</style>
