<template>
    <div
        class="search-box"
        v-bk-clickoutside="handleHideDropList">
        <bk-input
            ref="input"
            right-icon="bk-icon icon-search"
            :value="keyword"
            @change="handleSearch"
            @keydown="handleKeydown"
            @focus="handleShowDropList"
            @clear="handleClear"
            :native-attributes="{
                spellcheck: false
            }" />
        <div
            v-if="isShowList"
            class="search-dropdown-list">
            <ul
                v-if="renderList.length"
                ref="searchListContainer"
                :style="{
                    'max-height': `${contentMaxHeight}px`
                }"
                class="outside-ul">
                <li
                    v-for="(data, index) in renderList"
                    class="search-dropdown-list-item"
                    :class="{
                        hover: selectedIndex === index
                    }"
                    :key="index"
                    @click="handleSelect(data)">
                    {{ data.type }}
                </li>
            </ul>
            <ul
                v-else
                :style="{
                    'max-height': `${contentMaxHeight}px`
                }"
                class="outside-ul">
                <li class="search-dropdown-list-item">
                    <span class="text">没有找到</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    const encodeRegexp = (paramStr) => {
        const regexpKeyword = [
            '\\', '.', '*', '-', '{', '}', '[', ']', '^', '(', ')', '$', '+', '?', '|'
        ]
        const res = regexpKeyword.reduce(
            (result, charItem) => result.replace(new RegExp(`\\${charItem}`, 'g'), `\\${charItem}`),
            paramStr
        )
        return res
    }

    export default {
        name: '',
        props: {
            list: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                keyword: '',
                isShowList: '',
                selectedIndex: 0,
                contentMaxHeight: 300,
                renderList: []
            }
        },
        methods: {
            handleSearch (searchText) {
                const keyword = searchText.trim()
                if (!keyword) {
                    this.renderList = []
                    this.isShowList = false
                    this.keyword = ''
                    this.$emit('on-change', null)
                    return
                }
                const reg = new RegExp(encodeRegexp(searchText), 'i')
                const renderList = this.list.reduce((result, item) => {
                    if (reg.test(item.type) || reg.test(item.name)) {
                        result.push(item)
                    }
                    return result
                }, [])
                this.renderList = Object.freeze(renderList)
                this.keyword = keyword
                this.isShowList = true
            },
            handleShowDropList () {
                if (this.keyword) {
                    this.handleSearch(this.keyword)
                }
            },
            handleHideDropList () {
                this.isShowList = false
                this.selectedIndex = 0
            },
            handleSelect (data) {
                this.isShowList = false
                this.keyword = data.type
                this.$emit('on-change', data)
            },
            handleKeydown (value, e) {
                const keyCode = e.keyCode
                const length = this.renderList.length

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
                                const curSelectNode = this.$refs.searchListContainer.querySelector('li.hover')
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
                                const curSelectNode = this.$refs.searchListContainer.querySelector('li.hover')
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
                        const item = this.renderList[this.selectedIndex]
                        if (item) {
                            this.handleSelect(item)
                        }
                        break
                    default:
                        break
                }
            },
            handleClear () {
                this.$emit('on-change', null)
            }
        }
    }
</script>
<style lang="postcss" scoped>
    @import "@/css/mixins/scroller";
    @import "@/css/mixins/ellipsis";

    .search-box {
        position: relative;
        .search-dropdown-list {
            position: absolute;
            left: 20px;
            right: 20px;
            margin-top: 5px;
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
                &.hover {
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
