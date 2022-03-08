<template>
    <div
        :class="$style['menu']"
        :style="style"
        role="lesscode-menu">
        <div
            v-for="item in menuList"
            :key="item.name"
            :class="$style['item']"
            @click="handleExec(item.command)">
            {{ item.name }}
        </div>
    </div>
</template>
<script>
    import LC from '../index'
    import getActiveNode from '../get-active-node'

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
            const activeNode = getActiveNode()
            if (activeNode.type === 'free-layout') {
                this.menuList = [
                    {
                        name: '删除自由布局',
                        command: 'remove'
                    },
                    {
                        name: '清空自由布局',
                        command: 'clearLayout'
                    }
                ]
            } else if (activeNode.type === 'render-column') {
                this.menuList = [
                    {
                        name: '删除列',
                        command: 'remove'
                    },
                    {
                        name: '清空列',
                        command: 'clearLayout'
                    }
                ]
            } else {
                this.menuList = [
                    {
                        name: '删除',
                        command: 'remove'
                    }
                ]
            }
        },
        methods: {
            handleExec (command) {
                LC.execCommand(command)
            }
        }
    }
</script>
<style lang="postcss" module>
    .menu{
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
