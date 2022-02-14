<template>
    <div class="panel-component">
        <div class="category-tabs">
            <div
                class="tab-item base-component-box"
                :class="{ active: tab === 'baseComponent' }"
                @click="handleChangeTab('baseComponent')">
                <select-base-component v-model="baseComponent" />
            </div>
            <div
                class="tab-item"
                :class="{ active: tab === 'customComponent' }"
                @click="handleChangeTab('customComponent')">
                <span class="tab-item-label">自定义组件</span>
            </div>
            <div
                class="tab-item"
                :class="{ active: tab === 'icon' }"
                @click="handleChangeTab('icon')">
                <span class="tab-item-label">图标</span>
            </div>
        </div>
        <div class="drag-component-list">
            <component :is="com" :base-component="baseComponent" />
        </div>
    </div>
</template>
<script>
    import SelectBaseComponent from './components/select-base-component.vue'
    import RenderBaseComponent from './components/render-base-component'
    import RenderCustomComponent from './components/render-custom-component'
    import RnderIcon from './components/render-icon'

    export default {
        name: '',
        components: {
            SelectBaseComponent
        },
        data () {
            return {
                tab: 'baseComponent',
                baseComponent: 'bk'
            }
        },
        computed: {
            com () {
                const comMap = {
                    baseComponent: RenderBaseComponent,
                    customComponent: RenderCustomComponent,
                    icon: RnderIcon
                }
                return comMap[this.tab]
            }
        },
        methods: {
            handleChangeTab (tab) {
                this.tab = tab
            }
        }
    }
</script>
<style lang="postcss">
    @import "@/css/mixins/ellipsis";
    @import "@/css/mixins/scroller";

    .panel-component{
        height: 100%;
        .category-tabs {
            display: flex;
            height: 46px;
            border-bottom: 1px solid #ccc;
            padding: 0 20px;
            user-select: none;

            .tab-item {
                flex: 0 0 auto;
                font-size: 14px;
                height: 46px;
                padding: 0 10px;
                line-height: 46px;
                white-space: nowrap;
                cursor: pointer;
                user-select: none;
                &:hover {
                    color: #3A84FF;
                }
                &:first-child{
                    margin-right: auto;
                }
                &.active {
                    color: #3A84FF;
                    border-bottom: 2px solid #3A84FF;
                }
                .tab-item-label {
                    font-size: 14px;
                    @mixin ellipsis 86px;
                }
                .toggle-icon {
                    line-height: 46px;
                    overflow: hidden;
                    display: inline-block;
                }
            }
        }
        .search-box{
            padding: 12px 20px;
        }
        .drag-component-list{
            height: calc(100% - 46px);
            padding-bottom: 10px;
            overflow-y: auto;
            @mixin scroller;
        }
    }
</style>
