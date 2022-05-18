<template>
    <div
        :class="{
            [$style['draw-layout']]: true,
            [$style['is-left-collapsed']]: isLeftCollapse,
            [$style['is-right-collapsed']]: isRightCollapse
        }">
        <div :class="$style['layout-left']">
            <slot name="left" />
        </div>
        <div
            id="lesscodeDrawContent"
            :class="$style['layout-center']">
            <slot />
        </div>
        <div :class="$style['layout-right']">
            <slot name="right" />
        </div>
        <div
            :class="$style['collapsed-left-btn']"
            v-bk-tooltips.right="{
                content: '查看所有组件',
                disabled: !isLeftCollapse
            }"
            @click="handleToggleLeft">
            <i class="bk-drag-icon bk-drag-angle-left" />
        </div>
        <div
            :class="$style['collapsed-right-btn']"
            v-bk-tooltips.right="{
                content: '查看组件配置',
                disabled: !isRightCollapse
            }"
            @click="handleToggleRight">
            <i class="bk-drag-icon bk-drag-angle-left" />
        </div>
    </div>
</template>
<script>
    export default {
        name: '',
        data () {
            return {
                isLeftCollapse: false,
                isRightCollapse: false
            }
        },
        methods: {
            handleToggleLeft () {
                this.isLeftCollapse = !this.isLeftCollapse
            },
            handleToggleRight () {
                this.isRightCollapse = !this.isRightCollapse
            }
        }
    }
</script>
<style lang="postcss" module>
    @import "@/css/mixins/scroller";
    $layoutLeftWidth: 340px;
    $layoutRightWidth: 300px;

    .draw-layout{
        position: relative;
        padding-right: 300px;
        padding-left: 340px;
        transition: all .1s;
        &.is-left-collapsed{
            padding-left: 0;
            .layout-left {
                width: 0;
                overflow: hidden;
            }
            .collapsed-left-btn{
                left: 0;
                :global(.bk-drag-angle-left){
                    transform: rotate(180deg);
                }
            }
        }
        &.is-right-collapsed{
            padding-right: 0;
            .layout-right{
                width: 0;
                overflow: hidden;
            }
            .collapsed-right-btn{
                right: 0;
                :global(.bk-drag-angle-left){
                    transform: rotate(0deg);
                }
            }
        }
        .layout-left,
        .layout-right{
            transition: all .15s;
        }
        .layout-left{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: $layoutLeftWidth;
            background: #fff;
            box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 10%);
        }
        .layout-right{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: $layoutRightWidth;
            background: #FFF;
            box-shadow: -2px 4px 4px 0px rgba(0,0,0,0.1);
        }
        .layout-center{
            position: relative;
            height: 100%;
        }
        .collapsed-left-btn,
        .collapsed-right-btn{
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 50%;
            width: 16px;
            height: 50px;
            font-size: 12px;
            color: #fff;
            background: #C4C6CC;
            transform: translateY(-50%);
            cursor: pointer;
            &:hover {
                background: #3A84FF;
            }
            
            :global(.bk-drag-angle-left){
                transition: transform .15s;
            }
        }
        .collapsed-left-btn{
            left: 340px;
            border-radius: 0 8px 8px 0;
            :global(.bk-drag-angle-left) {
                transform: rotate(0deg);
            }
        }
        .collapsed-right-btn{
            right: 300px;
            border-radius: 8px 0 0 8px;
            :global(.bk-drag-angle-left) {
                transform: rotate(180deg);
            }
        }
    }
</style>
