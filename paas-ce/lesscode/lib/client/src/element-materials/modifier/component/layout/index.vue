<template>
    <div :class="$style['layout']">
        <div :class="$style['title']">布局</div>
        <div :class="$style['content']">
            <div :class="$style['item']" @click="handleClick('left')">居左</div>
            <div :class="$style['item']" @click="handleClick('center')">居中</div>
            <div :class="$style['item']" @click="handleClick('right')">居右</div>
        </div>
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        created () {
            this.componentNode = LC.getActiveNode()
        },
        methods: {
            handleClick () {
                
            }
        }
    }
</script>
<style lang="postcss" module>
    .title{
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        font-weight: bold;
    }
    .content{
        display: flex;
        .item{
            flex: 1;
            height: 36px;
            line-height: 36px;
            border: 1px solid #ddd;
            text-align: center;
            cursor: pointer;
        }
    }
</style>
