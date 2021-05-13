<template>
    <div class="template-menu-edit">
        <div class="menu-name">
            <bk-input placeholder="请输入导航名称" :value="baseInfo.name" @change="handleNameChange">
                <template v-if="showIcon" slot="prepend">
                    <div class="group-text" style="padding: 0 10px">
                        <i class="bk-icon icon-block-shape" />
                    </div>
                </template>
            </bk-input>
        </div>
        <div class="menu-page-wraper">
            <bk-select
                v-if="isPageCode"
                class="menu-page"
                placeholder="请选中路由"
                clearable
                :value="baseInfo.pageCode"
                @change="handlePageCodeChange">
                <bk-option
                    v-for="page in layoutPageList"
                    :key="page.pageCode"
                    :id="page.pageCode"
                    :name="page.pageName" />
            </bk-select>
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
    </div>
</template>
<script>
    import { mapState } from 'vuex'

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
                baseInfo: {
                    name: '',
                    pageCode: '',
                    link: ''
                }
            }
        },
        computed: {
            ...mapState('route', ['layoutPageList'])
        },
        created () {
            this.baseInfo = { ...this.data }
            this.isPageCode = !this.data.link
        },

        methods: {
            triggerChange () {
                this.$emit('on-change', {
                    ...this.baseInfo
                })
            },
            handleNameChange (name) {
                this.baseInfo.name = name
                this.triggerChange()
            },
            handlePageCodeChange (pageCode) {
                this.baseInfo.pageCode = pageCode
                this.triggerChange()
            },
            handleLinkChange (link) {
                this.baseInfo.link = link
                this.triggerChange()
            },
            handleTogglePageCode () {
                this.baseInfo.pageCode = ''
                this.baseInfo.link = ''
                this.isPageCode = !this.isPageCode
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .template-menu-edit{
        .menu-name,
        .menu-page,
        .menu-link{
            background: #fff;
        }
        .group-text{
            color: #979BA5;
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
        }
    }
</style>
