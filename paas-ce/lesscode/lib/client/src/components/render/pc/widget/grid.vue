<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div :class="$style['grid']">
        <resolve-component
            v-for="slotComponentData in componentData.slot.default"
            :class="$style['col']"
            :key="slotComponentData.renderKey"
            :component-data="slotComponentData" />
        <div
            v-if="isShowActiveBtn || componentData.isActived"
            :class="$style['placholder']">
            <div :class="$style['btn']">
                <i class="bk-drag-icon bk-drag-drag-small1" />
            </div>
        </div>
    </div>
</template>
<script>
    import LC from '@/element-materials/core'
    import ResolveComponent from '../resolve-component'

    export default {
        name: 'render-grid',
        components: {
            ResolveComponent
        },
        inheritAttrs: false,
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        provide () {
            return {
                renderGrid: this
            }
        },
        data () {
            return {
                isColumnEmpty: true,
                isShowActiveBtn: false
            }
        },
        created () {
            this.spanTotalNumsMemo = 0
            this.updateChildColumn()

            /**
             * @desc grid本身更新或者子组件column更新时都需要重新执行
             * @param { Object } event
             */
            const updateCallback = (event) => {
                if (event.target.componentId === this.componentData.componentId
                    || (
                        event.target.type === 'render-column'
                        && event.target.parentNode.componentId === this.componentData.componentId
                    )) {
                    this.$forceUpdate()
                    this.updateChildColumn()
                }
            }
            /**
             * @desc 子组件column选中时需要给grid的tips
             */
            const activeCallback = event => {
                this.isShowActiveBtn = event.target.parentNode === this.componentData
            }
            const activeClearCallback = () => {
                this.isShowActiveBtn = false
            }
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', activeClearCallback)

            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', activeClearCallback)
            })
        },
        methods: {
            /**
             * @desc gird有更新需要同步计算colum的样式
             */
            updateChildColumn () {
                const columnNodeList = this.componentData.children

                // 直接子组件column是否有拖入组件
                this.isColumnEmpty = true
                columnNodeList.forEach(node => {
                    if (node.children.length > 0) {
                        this.isColumnEmpty = false
                    }
                })
                // 计算每个column的宽度
                const spanTotalNums = columnNodeList.reduce((result, columnNode) => {
                    return result + columnNode.prop.span
                }, 0)
                if (this.spanTotalNumsMemo === spanTotalNums) {
                    return
                }
                
                this.spanTotalNumsMemo = spanTotalNums
                columnNodeList.forEach(node => {
                    const renderWidth = `${Number((node.prop.span / spanTotalNums * 100).toFixed(4))}%`
                       
                    if (node.style.width !== renderWidth) {
                        node.setStyle('width', renderWidth)
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" module>
    .grid{
        position: relative;
        display: flex;
        /* 如果基础的 slot 可以拖拽需要设置这个屏蔽掉基础组件上面的 pointer-events: none 效果 */
        pointer-events: all;

        .col {
            border: 1px dashed #ccc;
            &:nth-child(n + 2) {
                border-left: none;
            }
<<<<<<< HEAD
=======
            /* &:last-child{
                border-right: 1px dashed #ccc;
            } */
>>>>>>> base/lesscode-develop
        }
    }
    .placholder {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        display: flex;
<<<<<<< HEAD
        .btn{
            display: flex;
            align-content: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            margin-bottom: -14px;
            font-size: 14px;
            color: #C4C6CC;
            background: #EAEBF0;
            cursor: pointer;
            pointer-events: all;
            &:hover{
                color: #699DF4;
                background: #A3C5FD;
=======
        height: 2px;
        justify-content: center;
        font-size: 12px;
        background: #3A84FF;
        .btn{
            height: 20px;
            padding: 0 10px;
            color: #fff;
            border-radius: 2px;
            text-align: center;
            cursor: pointer;
            background: #3A84FF;
            pointer-events: all;
            &:hover{
                background: skyblue;
>>>>>>> base/lesscode-develop
            }
        }
    }
</style>
