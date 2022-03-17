<template>
    <div
        :class="$style['menu']"
        :style="style"
        role="lesscode-menu">
        <div
            v-for="item in menuList"
            :key="item.name"
            :class="{
                [$style['item']]: true,
                [$style['item-disabled']]: item.disabled
            }"
            @click="handleExec(item)">
            <div :class="$style['name']">
                {{ item.name }}
            </div>
            <div
                v-if="item.key"
                :class="$style['key']">
                {{ item.key }}
            </div>
        </div>
    </div>
</template>
<script>
    import LC from '../../index'
    import createMenu from './create-menu'

    export default {
        name: '',
        props: {
            componentId: String,
            left: Number,
            top: Number
        },
        computed: {
            style () {
                return {
                    position: 'fixed',
                    top: `${this.top}px`,
                    left: `${this.left}px`
                }
            }
        },
        created () {
            this.menuList = createMenu()
        },
        methods: {
            handleExec (action) {
                if (action.disabled) {
                    return
                }
                if (typeof action.action === 'function') {
                    action.action()
                } else if (action.command) {
                    LC.execCommand(action.command)
                }
            }
        }
    }
</script>
<style lang="postcss" module>
    .menu{
        z-index: 10000000;
        width: 180px;
        padding: 8px 0;
        font-size: 12px;
        color: #63656E;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0px 2px 30px 0px rgba(0,0,0,0.14);
        .item{
            display: flex;
            padding: 0 16px;
            line-height: 32px;
            color: #63656e;
            font-size: 14px;
            cursor: pointer;
            &:hover{
                color: #3A84FF;
                background-color: #E1ECFF;
            }
        }
        .item-disabled{
            color: #C4C6CC !important;
            background: #fff !important;
            cursor: default;
        }
        .key{
            margin-left: auto;
            color: #C4C6CC;
        }
    }
</style>
