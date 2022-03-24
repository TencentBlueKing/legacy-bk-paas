<template>
    <div
        :class="{
            [$style['draw-layout']]: true,
            [$style['left-collapse']]: isLeftCollapse,
            [$style['right-collapse']]: isRightCollapse
        }">
        <div :class="$style['left']">
            <slot name="left" />
            
        </div>
        <div id="lesscodeDrawContent" :class="$style['center']">
            <div
                :class="$style['left-btn']"
                v-bk-tooltips.right="{
                    content: '查看所有组件',
                    disabled: !isLeftCollapse
                }"
                @click="handleToggleLeft">
                <i class="bk-drag-icon bk-drag-angle-left" />
            </div>
            <slot />
            <div
                :class="$style['right-btn']"
                v-bk-tooltips.right="{
                    content: '查看组件配置',
                    disabled: !isRightCollapse
                }"
                @click="handleToggleRight">
                <i class="bk-drag-icon bk-drag-angle-left" />
            </div>
        </div>
        <div :class="$style['right']">
            <slot name="right" />
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
    .draw-layout{
        position: relative;
        height: calc(100vh - 120px);
        padding-right: 300px;
        padding-left: 340px;
        transition: all .1s;
        &.left-collapse{
            padding-left: 0;
            .left {
                /* transform: translateX(-100%); */
                width: 0;
                overflow: hidden;
            }
            .left-btn{
                :global(.bk-drag-angle-left){
                    transform: rotate(180deg);
                }
            }
            
        }
        &.right-collapse{
            padding-right: 0;
            .right{
                /* transform: translateX(100%); */
                width: 0;
                overflow: hidden;
            }
            .right-btn{
                :global(.bk-drag-angle-left){
                    transform: rotate(0deg);
                }
            }
        }
        .left,
        .right{
            transition: all .15s;
        }
        .left{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 340px;
            background: #fff;
            box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 10%);
        }
        .right{
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 300px;
            background: #FFF;
            box-shadow: -2px 4px 4px 0px rgba(0,0,0,0.1);
        }
        .left-btn,
        .right-btn{
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 50%;
            width: 16px;
            height: 50px;
            font-size: 12px;
            color: #fff;
            background: #C4C6CC;
            transform: translateY(50%);
            cursor: pointer;
            &:hover {
                background: #3A84FF;
            }
            
            :global(.bk-drag-angle-left){
                transition: transform .15s;
            }
        }
        .left-btn{
            left: 340px;
            border-radius: 0 8px 8px 0;
            :global(.bk-drag-angle-left) {
                transform: rotate(0deg);
            }
        }
        .right-btn{
            right: 300px;
            border-radius: 8px 0 0 8px;
            :global(.bk-drag-angle-left) {
                transform: rotate(180deg);
            }
        }
        .center{
            position: relative;
            height: 100%;
            padding: 20px 0;
            overflow: auto;
            @mixin scroller;
        }
    }
</style>
