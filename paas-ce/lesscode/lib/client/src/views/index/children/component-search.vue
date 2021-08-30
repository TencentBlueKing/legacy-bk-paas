<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div class="component-search" v-bk-clickoutside="hideSearchResult">
        <bk-input
            clearable
            placeholder="请输入"
            v-model="keyword"
            @input="handleInput"
            @keydown="handleKeydown"
            @clear="handleClear"
            right-icon="bk-icon icon-search">
        </bk-input>
        <bk-popover class="search-dropdown"
            trigger="manual"
            placement="bottom-start"
            animation="slide-toggle"
            :offset="-1"
            :distance="12"
            :tippy-options="popoverOptions">
            <template v-if="isShowResult">
                <div class="search-dropdown-list" v-if="searchResult.length">
                    <ul ref="searchListContainer" :style="{ 'max-height': `${contentMaxHeight}px` }" class="outside-ul">
                        <li v-for="(data, index) in searchResult"
                            class="search-dropdown-list-item"
                            :class="selectedIndex === index ? 'cur' : ''"
                            :key="index"
                            @click="handleSelect(data)">
                            <SearchItemRender :query="keyword" :node="data" />
                        </li>
                    </ul>
                </div>
                <div class="search-dropdown-list" v-else>
                    <ul ref="searchListContainer" :style="{ 'max-height': `${contentMaxHeight}px` }" class="outside-ul">
                        <li class="search-dropdown-list-item">
                            <span class="text">没有找到{{ searchType === 'template' ? '模板' : '组件' }}</span>
                        </li>
                    </ul>
                </div>
            </template>
        </bk-popover>
    </div>
</template>

<script>
    import { pascalCase } from 'change-case'

    const SearchItemRender = {
        name: 'SearchItemRender',
        functional: true,
        props: {
            node: Object,
            query: String
        },
        render (h, ctx) {
            const textClass = 'text'
            const { node, query } = ctx.props
            return (
                <span title={node.searchName} domPropsInnerHTML={
                    query ? node.searchName.replace(new RegExp(`(${query})`, 'i'), '<em>$1</em>') : node.searchName
                } class={textClass}></span>
            )
        }
    }

    export default {
        components: {
            SearchItemRender
        },
        props: {
            source: {
                type: Array,
                default: () => ([])
            },
            result: {
                type: Object,
                default: () => ({})
            },
            searchType: {
                type: String,
                default: 'component'
            }
        },
        data () {
            return {
                keyword: '',
                searchResult: [],
                popoverOptions: {
                    type: Object,
                    default () {
                        return {
                            distance: 0
                        }
                    }
                },
                isShowResult: false,
                selectedIndex: 0,
                contentMaxHeight: 300
            }
        },
        computed: {
            componentList () {
                let componentList = []
                if (this.searchType === 'template') {
                    componentList = this.source.map(item => {
                        return {
                            id: item.id,
                            name: item.templateName,
                            categoryId: item.categoryId,
                            offcialType: item.offcialType,
                            searchName: item.templateName
                        }
                    })
                } else {
                    componentList = this.source.map(({ name, displayName, group, groupType }) => {
                        return {
                            name,
                            displayName,
                            group,
                            groupType,
                            // searchName: `${name} ${displayName}`
                            searchName: groupType === 'custom' ? `${name} ${displayName}` : `${pascalCase(name)} ${displayName}`
                        }
                    })
                }
                
                return componentList
            }
        },
        watch: {
            result (value) {
                if (!value) {
                    this.keyword = ''
                }
            }
        },
        methods: {
            handleInput () {
                const keyword = this.keyword.trim()
                if (keyword.length) {
                    this.searchResult = this.componentList.filter(item =>
                        ~item.searchName.toLowerCase().indexOf(keyword.toLowerCase())
                    )
                } else {
                    this.handleClear()
                }

                this.isShowResult = keyword.length > 0
            },
            handleSelect (data) {
                this.keyword = data.searchName

                this.$emit('update:result', data)
                this.hideSearchResult()
            },
            handleKeydown (value, e) {
                const keyCode = e.keyCode
                const length = this.searchResult.length

                switch (keyCode) {
                    // 上
                    case 38:
                        e.preventDefault()
                        if (this.selectedIndex === -1 || this.selectedIndex === 0) {
                            this.selectedIndex = length - 1
                            this.$refs.searchListContainer.scrollTop = this.$refs.searchListContainer.scrollHeight
                        } else {
                            this.selectedIndex--
                            this.$nextTick(() => {
                                const curSelectNode = this.$refs.searchListContainer.querySelector('li.cur')
                                const offsetTop = curSelectNode.offsetTop
                                if (offsetTop < this.$refs.searchListContainer.scrollTop) {
                                    this.$refs.searchListContainer.scrollTop -= 32
                                }
                            })
                        }
                        break
                    // 下
                    case 40:
                        e.preventDefault()
                        if (this.selectedIndex < length - 1) {
                            this.selectedIndex++
                            this.$nextTick(() => {
                                const curSelectNode = this.$refs.searchListContainer.querySelector('li.cur')
                                const offsetTop = curSelectNode.offsetTop
                                // this.$refs.searchListContainer 上下各有 6px 的 padding
                                if (offsetTop > this.contentMaxHeight - 2 * 6) {
                                    // 每一个 item 是 32px height
                                    this.$refs.searchListContainer.scrollTop += 32
                                }
                            })
                        } else {
                            this.selectedIndex = 0
                            this.$refs.searchListContainer.scrollTop = 0
                        }
                        break
                    case 13:
                        e.preventDefault()
                        const item = this.searchResult[this.selectedIndex]
                        if (item) {
                            this.handleSelect(item)
                        }
                        break
                    default:
                        break
                }
            },
            handleClear () {
                this.$emit('update:result', null)
            },
            hideSearchResult () {
                this.isShowResult = false
                this.selectedIndex = 0
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .component-search {
        .search-dropdown-list {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            right: 0;
            box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.2);
            border-radius: 2px;
            background-color: #fff;
            z-index: 100;
            overflow-y: hidden;
            .outside-ul {
                @mixin scroller;
                padding: 0;
                margin: 0;
                list-style: none;
                overflow-y: auto;
                padding: 6px 0;
            }
            .search-dropdown-list-item {
                position: relative;
                width: 100%;
                border-left: #c4c6cc;
                border-right: #c4c6cc;
                background-color: #fff;
                cursor: pointer;
                height: 32px;
                line-height: 32px;
                padding: 0 10px;
                color: #63656E;
                font-size: 14px;
                .text {
                    @mixin ellipsis 100%;
                    em {
                        font-style: normal;
                        color: #3a84ff;
                    }
                }
                &:first-child {
                    border-top: #c4c6cc;
                }
                &:last-child {
                    border-bottom: #c4c6cc;
                }
                &:hover,
                &.cur {
                    background-color: #e1ecff;
                }
            }
        }
        .bk-tooltip.search-dropdown {
            display: block;
            &>.bk-tooltip-ref {
                display: block;
            }
        }
    }
</style>
