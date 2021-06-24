<template>
    <div class="template-menu-edit">
        <div class="menu-name">
            <bk-input placeholder="请输入导航名称" :value="baseInfo.name" @change="handleNameChange">
                <div
                    v-if="showIcon"
                    slot="prepend"
                    ref="icon"
                    class="group-text"
                    style="padding: 0 10px">
                    <i class="bk-icon" :class="baseInfo.icon" />
                </div>
            </bk-input>
        </div>
        <div class="menu-page-wraper">
            <div v-if="isPageCode">
                <bk-select
                    class="menu-page"
                    placeholder="请选中路由"
                    clearable
                    :value="baseInfo.pageCode"
                    @change="handlePageCodeChange">
                    <bk-option
                        v-for="page in pageRouteList"
                        v-bk-tooltips="{ disabled: !page.disabled, content: '未设置路由' }"
                        :key="page.pageCode"
                        :id="page.pageCode"
                        :disabled="page.disabled"
                        :name="page.pageName" />
                </bk-select>
                <div class="menu-page-query">
                    <bk-input
                        v-if="isShowPageQuery"
                        :value="baseInfo.query"
                        style="margin-top: 10px"
                        placeholder="name=zhangsan&age=18"
                        @change="handlePageQueryChange" />
                    <bk-button
                        v-else
                        text
                        style="font-size: 12px;"
                        @click="handleShowEditPageQuery">
                        添加路由参数
                    </bk-button>
                    <div
                        v-if="isShowPageQuery"
                        class="query-remove"
                        v-bk-tooltips.top-start="'删除路由参数'"
                        @click="handleRemovePageQuery">
                        <i class="bk-icon icon-minus-circle" />
                    </div>
                </div>
            </div>
            <bk-input
                v-else
                class="menu-link"
                placeholder="请输入链接"
                :value="baseInfo.link"
                clearable
                @change="handleLinkChange" />
            <div
                class="menu-type"
                v-bk-tooltips.top-start="isPageCode ? '点击切换链接模式' : '点击切换路由模式'"
                @click="handleTogglePageCode">
                <div class="text">{{ isPageCode ? '路由' : '链接' }}</div>
            </div>
        </div>
        <div style="display: none">
            <div ref="iconPanel" class="template-icon-custom-panel">
                <div v-if="isIconListRender">
                    <div class="list-icon-search">
                        <input
                            ref="search"
                            spellcheck="false"
                            placeholder="输入 icon 的名字"
                            @input="handleInputChange">
                        <i class="bk-icon icon-search icon-search-flag" />
                    </div>
                    <div class="wraper">
                        <template v-if="searchValue">
                            <div
                                class="item"
                                v-for="searchItem in searchList"
                                :key="searchItem.icon"
                                @click="handleIconChange(searchItem.icon)">
                                <i :class="searchItem.icon" />
                                <span class="item-name">{{ searchItem.name }}</span>
                            </div>
                            <div v-if="searchList.length < 1" key="searchEmpty" class="search-empty">暂无数据</div>
                        </template>
                        <template v-else>
                            <template v-for="buildIconGroupName in Object.keys(buildInIconGroup)">
                                <div
                                    v-if="buildInIconGroup[buildIconGroupName].length > 0"
                                    class="group"
                                    :key="buildIconGroupName">
                                    <div class="group-name">{{ buildIconGroupName }}（{{ buildInIconGroup[buildIconGroupName].length }}）</div>
                                    <div
                                        v-for="iconItem in buildInIconGroup[buildIconGroupName]"
                                        class="item"
                                        :key="iconItem.icon"
                                        @click="handleIconChange(iconItem.icon)">
                                        <i :class="iconItem.icon" />
                                        <span class="item-name">{{ iconItem.name }}</span>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { mapState } from 'vuex'
    import iconComponentList from '@/element-materials/materials/icon-list.js'

    export default {
        name: '',
        props: {
            data: {
                type: Object,
                default: () => ({})
            },
            showIcon: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isPageCode: true,
                isShowPageQuery: false,
                baseInfo: {
                    icon: '',
                    name: '',
                    pageCode: '',
                    fullPath: '',
                    link: '',
                    query: ''
                },
                searchValue: '',
                searchList: [],
                isIconListRender: false
            }
        },
        computed: {
            ...mapState('route', ['layoutPageList']),
            pageRouteList () {
                const pageRouteList = this.layoutPageList.map(item => {
                    const { id, layoutPath, path } = item
                    const disabled = !id
                    return {
                        ...item,
                        disabled,
                        fullPath: `${layoutPath}${layoutPath.endsWith('/') ? '' : '/'}${path}`
                    }
                })
                pageRouteList.sort((p1, p2) => p1.disabled - p2.disabled)
                return pageRouteList
            }
        },
        mounted () {
            this.$nextTick(() => {
                // 可选项目icon
                this.initPopover()
            })
        },
        created () {
            this.buildInIconGroup = iconComponentList.reduce((result, item) => {
                if (!result[item.group]) {
                    result[item.group] = []
                }
                result[item.group].push({
                    icon: `bk-icon ${item.name}`,
                    name: item.icon
                })
                return result
            }, {})
            this.baseInfo = { ...this.data }
            this.isPageCode = !this.data.link
            this.isShowPageQuery = !!this.data.query
        },
        methods: {
            triggerChange () {
                this.$emit('on-change', {
                    ...this.baseInfo
                })
            },
            initPopover () {
                if (!this.popperInstance && this.showIcon) {
                    this.popperInstance = this.$bkPopover(this.$refs.icon, {
                        theme: 'light template-custom-icon',
                        arrow: false,
                        interactive: true,
                        animateFill: false,
                        placement: 'bottom-start',
                        content: this.$refs.iconPanel,
                        trigger: 'click',
                        width: '276px',
                        size: 'small',
                        zIndex: window.__bk_zIndex_manager.nextZIndex(),
                        boundary: 'viewport',
                        onShow: () => {
                            this.isIconListRender = true
                        },
                        onHidden: () => {
                            this.isIconListRender = false
                        }
                    })
                    this.$once('hook:beforeDestroy', () => {
                        this.popperInstance.destroy()
                    })
                }
            },
            handleInputChange (event) {
                const localSearch = _.trim(event.target.value).toLocaleLowerCase()
                this.searchValue = localSearch
                if (!localSearch) {
                    this.searchList = []
                    return
                }
                const result = []
                for (let i = 0; i < iconComponentList.length; i++) {
                    const curItem = iconComponentList[i]
                    if (curItem.icon.indexOf(localSearch) > -1) {
                        result.push({
                            icon: `bk-icon ${curItem.name}`,
                            name: curItem.icon
                        })
                    }
                }
                this.searchList = Object.freeze(result)
            },
            handleIconChange (icon) {
                this.baseInfo.icon = icon
                this.popperInstance.hide()
                this.triggerChange()
            },
            handleNameChange (name) {
                this.baseInfo.name = name
                this.triggerChange()
            },
            handlePageCodeChange (pageCode) {
                const { fullPath } = this.pageRouteList.find(item => item.pageCode === pageCode)
                this.baseInfo.pageCode = pageCode
                this.baseInfo.fullPath = fullPath
                this.triggerChange()
            },
            handleShowEditPageQuery () {
                this.isShowPageQuery = !this.isShowPageQuery
            },
            handlePageQueryChange (query) {
                this.baseInfo.query = query
                this.triggerChange()
            },
            handleRemovePageQuery () {
                this.isShowPageQuery = false
                this.baseInfo.query = ''
                this.triggerChange()
            },
            handleLinkChange (link) {
                this.baseInfo.link = link
                this.triggerChange()
            },
            handleTogglePageCode () {
                this.baseInfo.pageCode = ''
                this.baseInfo.link = ''
                this.baseInfo.query = ''
                this.isPageCode = !this.isPageCode
            }
        }
    }
</script>
<style lang="postcss">
    .template-custom-icon-theme{
        padding: 0 !important;
        .list-icon-search{
            position: relative;
            padding: 0 10px;
            color: #979BA5;
            input{
                width: 100%;
                height: 32px;
                padding: 0 10px 0 30px;
                line-height: 32px;
                background: transparent;
                border: none;
                border-bottom: 1px solid #DCDEE5;
                outline: none;
                &::placeholder{
                    color: #C4C6CC;
                }
            }
            .icon-search-flag{
                position: absolute;
                top: 8px;
                left: 10px;
                font-size: 16px;
                color: #979ba5;
            }
        }
        .template-icon-custom-panel{
            font-size: 12px;
            color: #63656E;
            .wraper{
                max-height: 320px;
                line-height: 32px;
                overflow-y: auto;
                .group{
                    .group-name{
                        margin: 0 12px;
                        color: #979BA5;
                        line-height: 32px;
                        border-bottom: 1px solid #DCDEE5;
                    }
                }
                .item{
                    padding: 0 12px;
                    cursor: pointer;
                    &:hover{
                        color: #3A84FF;
                        background: #EAF3FF;
                    }
                }
                .item-name{
                    padding-left: 5px;
                }
                .search-empty{
                    padding: 0 12px;
                    text-align: center;
                }
            }
        }
    }

</style>
<style lang='postcss' scoped>
    .template-menu-edit{
        .menu-name,
        .menu-page,
        .menu-link{
            background: #fff;
        }
        .group-text{
            color: #979BA5;
            cursor: pointer;
        }
        .menu-page-wraper{
            position: relative;
            padding-left: 42px;
            margin-top: 6px;
            .menu-type{
                position: absolute;
                top: 8px;
                left: 7px;
                padding: 2px 3px;
                font-size: 12px;
                color: #3A84FF;
                line-height: 1;
                border-radius: 2px;
                background: #fff;
                cursor: pointer;
                &:hover{
                    background: #E1ECFF;
                }
                .text{
                    transform: scale(.8333);
                }
            }
            .menu-page-query{
                position: relative;
                .query-remove{
                    position: absolute;
                    top: 0;
                    top: 17px;
                    right: -28px;
                    display: flex;
                    font-size: 16px;
                    color: #979BA5;
                    cursor: pointer;
                }
            }
        }
    }
</style>
