<template>
    <bk-dropdown-menu
        class="select-base-component"
        ref="dropdownMenuComp"
        trigger="click"
        @show="handleToggleSelectPanel(true)"
        @hide="handleToggleSelectPanel(false)">
        <div slot="dropdown-trigger">
            <span class="tab-item-label">
                {{ componentNameText }}
            </span>
            <i
                class="bk-drag-icon toggle-icon"
                :class="{
                    'bk-drag-angle-down-fill': isShowSelectPanel,
                    'bk-drag-angle-up-fill': !isShowSelectPanel
                }" />
        </div>
        <div
            slot="dropdown-content"
            class="base-component-list">
            <div
                class="base-component-item"
                :class="{
                    'selected': value === 'bk'
                }">
                <div @click="handleChnage('bk')">
                    <span>蓝鲸Vue组件库</span>
                    <i
                        class="bk-drag-icon bk-drag-vesion-fill"
                        v-bk-tooltips="{
                            content: bkUiTips,
                            placements: ['bottom-end']
                        }" />
                </div>
            </div>
            <div
                class="base-component-item"
                :class="{
                    'selected': value === 'element'
                }">
                <div @click="handleChnage('element')">
                    <span>element-ui</span>
                    <i
                        class="bk-drag-icon bk-drag-vesion-fill"
                        v-bk-tooltips="{
                            content: elementUiTips,
                            placements: ['bottom-end']
                        }" />
                </div>
            </div>
        </div>
    </bk-dropdown-menu>
</template>
<script>
    export default {
        name: '',
        props: {
            value: {
                type: String,
                default: 'bk'
            }
        },
        data () {
            return {
                isShowSelectPanel: false
            }
        },
        computed: {
            componentNameText () {
                const nameMap = {
                    bk: '蓝鲸Vue组件库',
                    element: 'element-ui'
                }
                return nameMap[this.value]
            }
        },
        created () {
            this.bkUiTips = '当前组件库版本为“latest”，<a target="_blank" href="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/changelog" style="cursor: pointer;color: #3a84ff">查看更新日志</a>'
            this.elementUiTips = '当前组件库版本为“2.15.1”，<a target="_blank" href="https://github.com/ElemeFE/element/releases" style="cursor: pointer;color: #3a84ff">查看更新日志</a>'
        },
        methods: {
            handleToggleSelectPanel () {
                this.isShowSelectPanel = true
            },
            handleChnage (value) {
                this.$emit('input', value)
                this.$emit('change', value)
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .select-base-component{
        .base-component-list{
            .base-component-item{
                height: 32px;
                line-height: 33px;
                padding: 0 16px;
                color: #63656e;
                font-size: 14px;
                text-decoration: none;
                white-space: nowrap;
                &:hover,
                &.selected{
                    background-color: #eaf3ff;
                    color: #3a84ff;
                }
            }
        }
    }
</style>
