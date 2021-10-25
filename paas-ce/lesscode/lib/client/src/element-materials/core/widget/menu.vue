<template>
    <div
        class="lesscode-edit-action-menu"
        :style="style"
        role="action-menu">
        <div
            v-for="item in menuList"
            :key="item.name"
            class="item"
            @click="handleExec(item.command)">
            {{ item.name }}
        </div>
    </div>
</template>
<script>
    import getActiveNode from '../get-active-node'
    import {
        remove,
        cleayLayout
    } from '../helper/commands'

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
            this.activeNode = getActiveNode()
            if (this.activeNode.type === 'free-layout') {
                this.menuList = [
                    { name: '删除自由布局', command: remove },
                    { name: '清空自由布局', command: cleayLayout }
                ]
            } else if (this.activeNode.type === 'render-grid') {
                this.menuList = [
                    { name: '删除栅格布局', command: remove },
                    { name: '清空栅格布局', command: cleayLayout }
                ]
            } else {
                this.menuList = [
                    { name: '删除', command: remove }
                ]
            }
        },
        methods: {
            handleExec (command) {
                command(this.activeNode)
            }
        }
    }
</script>
<style lang="postcss">
    .lesscode-edit-action-menu{
        z-index: 10000000;
        border: 1px solid #eee;
        box-shadow: 0 0.5em 1em 0 rgb(0 0 0 / 10%);
        border-radius: 1px;
        background: #fff;
        .item{
            height: 28px;
            min-width: 75px;
            padding: 0 10px;
            line-height: 25px;
            text-align: center;
            display: block;
            color: #63656e;
            padding: 2px;
            font-size: 14px;
            cursor: pointer;
            &:hover{
                background-color: #ea3636;
                color: #fff;
            }
        }
    }
</style>
