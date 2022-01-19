<template>
    <div class="render-custom-component" v-bkloading="{ isLoading }">
        <search-box
            :list="searchList"
            @on-change="handleSearchChange" />
        <div>
            <template v-if="isSearch">
                <group-box
                    v-for="(comList, groupName) in renderGroupComponentMap"
                    :key="groupName"
                    :list="comList"
                    :group-name="groupName">
                    <render-component
                        v-for="component in comList"
                        :key="component.name"
                        :data="component" />
                </group-box>
            </template>
            <template v-else>
                <group-box
                    :list="favoriteComponentList"
                    :group-name="'我的收藏'"
                    key="favorite">
                    <render-component
                        v-for="component in favoriteComponentList"
                        :key="component.name"
                        :data="component" />
                </group-box>
                <template v-for="(componentList, groupName) in groupComponentMap">
                    <group-box
                        v-if="componentList.length > 0"
                        :key="groupName"
                        :list="componentList"
                        :group-name="groupName">
                        <render-component
                            v-for="component in componentList"
                            :key="component.name"
                            :data="component" />
                    </group-box>
                </template>
                <group-box
                    :list="publicComponentList"
                    :group-name="'其他项目公开的组件'"
                    key="publice">
                    <render-component
                        v-for="component in publicComponentList"
                        :key="component.name"
                        :data="component" />
                </group-box>
            </template>
        </div>
        <div class="fixed-opts">
            <bk-link
                class="text-link"
                theme="primary"
                icon="bk-drag-icon bk-drag-jump-link"
                @click="handleCreate(true)">
                新建更多自定义组件
            </bk-link>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import GroupBox from '../../common/group-box'
    import SearchBox from '../../common/search-box'
    import RenderComponent from '../../common/group-box/render-component'

    export default {
        name: '',
        components: {
            GroupBox,
            SearchBox,
            RenderComponent
        },
        data () {
            return {
                isLoading: false,
                favoriteComponentList: [],
                publicComponentList: [],
                groupComponentMap: {},
                renderGroupComponentMap: {},
                searchList: [],
                isSearch: false
            }
        },
        created () {
            this.projectId = this.$route.params.projectId
            this.searchList = []
            this.fetchFavoriteList()
        },
        methods: {
            /**
             * @desc 获取自定义组件的收藏状态，处理自定义组件分类信息
             */
            async fetchFavoriteList () {
                try {
                    this.isLoading = true
                    const favoriteList = await this.$store.dispatch('components/favoriteList', {
                        projectId: this.projectId
                    })
                    const favoriteIdMap = favoriteList.reduce((result, item) => {
                        result[item.compId] = true
                        return result
                    }, {})
                    const favoriteComponentList = []
                    const publicComponentList = []
                    const groupComponentMap = {}
                    const searchList = []
                    window.customCompontensPlugin.forEach(registerCallback => {
                        const [
                            config,,
                            baseInfo
                        ] = registerCallback(Vue)
                        const realConfig = {
                            ...config,
                            meta: baseInfo
                        }
                        searchList.push(config)
                        if (favoriteIdMap[baseInfo.id]) {
                            favoriteComponentList.push(realConfig)
                            return
                        }
                        if (baseInfo.isPublic) {
                            publicComponentList.push(realConfig)
                            return
                        }
                        if (!groupComponentMap[baseInfo.category]) {
                            groupComponentMap[baseInfo.category] = []
                        }
                        groupComponentMap[baseInfo.category].push(realConfig)
                    })
                    this.favoriteComponentList = Object.freeze(favoriteComponentList)
                    this.publicComponentList = Object.freeze(publicComponentList)
                    this.groupComponentMap = Object.freeze(groupComponentMap)
                    this.renderGroupComponentMap = Object.freeze({
                        '我的收藏': this.favoriteComponentList,
                        '其他项目公开的组件': this.publicComponentList,
                        ...this.groupComponentMap
                    })
                    this.searchList = Object.freeze(searchList)
                } finally {
                    this.isLoading = false
                }
            },
            
            /**
             * @desc 去新建自定义组件
             */
            handleCreate () {
                const route = this.$router.resolve({
                    name: 'componentManage',
                    params: {
                        projectId: this.projectId
                    }
                })
                window.open(route.href, '_blank')
            },
            /**
             * @desc 组件搜索
             */
            handleSearchChange (data) {
                if (!data) {
                    this.isSearch = false
                    this.renderGroupComponentMap = Object.freeze({
                        '我的收藏': this.favoriteComponentList,
                        '其他项目公开的组件': this.publicComponentList,
                        ...this.groupComponentMap
                    })
                    return
                }
                const renderGroupComponentMap = {}
                Object.keys(this.renderGroupComponentMap).forEach(groupName => {
                    const groupList = this.renderGroupComponentMap[groupName]
                    groupList.forEach(component => {
                        if (component.name === data.name) {
                            if (!renderGroupComponentMap[groupName]) {
                                renderGroupComponentMap[groupName] = []
                            }
                            renderGroupComponentMap[groupName].push(component)
                        }
                    })
                })
                this.renderGroupComponentMap = Object.freeze(renderGroupComponentMap)
                this.isSearch = true
            }
        }
    }
</script>
<style lang="postcss">
    .render-custom-component{
        .fixed-opts{
            position: fixed;
            bottom: 0;
            background: #fff;
            width: 300px;
            padding: 4px 14px;
            .bk-link-text {
                font-size: 12px;
            }
        }
    }
</style>
