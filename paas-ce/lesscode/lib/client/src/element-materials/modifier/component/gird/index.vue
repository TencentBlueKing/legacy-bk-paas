<template>
    <div v-if="isShow" class="modifier-grid">
        <div class="column-title">
            <span
                class="label"
                v-bk-tooltips="{
                    interactive: false,
                    allowHtml: true,
                    content: '#column-title-tips'
                }">
                列配置:
            </span>
            <div id="column-title-tips">
                <p>每一列栅格宽度占比为</p>
                <p>该列配置值占总列配置值的百分比</p>
                <p>建议总列配置值为 12 或 24</p>
            </div>
        </div>
        <div class="column-list">
            <div
                v-for="(columnNode, index) in columnList"
                class="column-item"
                :key="columnNode.componentId">
                <span class="column-item-text">第 {{index + 1}} 列：</span>
                <bk-input
                    :value="columnNode.prop.span"
                    type="number"
                    :min="1"
                    @change="value => handleSpanChange(value, columnNode)" />
                <i class="bk-icon icon-minus-circle" @click="handleDelete(columnNode)" />
            </div>
        </div>
        <div
            v-show="columnList.length <= 11"
            class="column-add"
            @click="handleAdd">
            <span>添加 1 列</span>
            <i class="bk-icon icon-plus-circle" />
        </div>
    </div>
</template>
<script>
    import LC from '@/element-materials/core'

    export default {
        name: '',
        data () {
            return {
                isShow: false,
                columnList: []
            }
        },
        created () {
            this.componentNode = LC.getActiveNode()
            this.isShow = this.componentNode.type === 'render-grid'
            this.columnList = Object.freeze([...this.componentNode.children])

            const updateCallback = (event) => {
                if (this.componentNode.componentId === event.target.componentId) {
                    this.columnList = Object.freeze([...this.componentNode.children])
                    this.$forceUpdate()
                }
            }

            LC.addEventListener('update', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
            })
        },
        methods: {
            handleSpanChange (value, columnNode) {
                columnNode.setProp('span', parseInt(value, 10))
            },
            handleDelete (columnNode) {
                this.componentNode.removeChild(columnNode)
            },
            handleAdd () {
                const newColumnNode = LC.createNode('render-column')
                this.componentNode.appendChild(newColumnNode)
            }
        }
    }
</script>
<style lang="postcss">
    .modifier-grid {
        padding: 0 10px;
        .column-title {
            display: flex;
            align-items: center;
            height: 32px;
            font-size: 14px;
            font-weight: 500;
            color: #606266;
            .label {
                border-bottom: 1px dashed #979ba5;
                cursor: pointer;
            }
        }
        .column-list {
            display: flex;
            flex-direction: column;
            .column-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                .column-item-text {
                    flex-shrink: 0;
                    width: 95px;
                }
                .icon-minus-circle {
                    margin: 0 0 0 8px;
                    cursor: pointer;
                    font-size: 16px;
                    &:hover {
                        color: #3a84ff
                    }
                }
            }
        }
        .column-add {
            text-align: right;
            font-size: 12px;
            cursor: pointer;
            color: #3a84ff;
            .icon-plus-circle {
                font-size: 16px;
                margin-left: 4px;
            }
        }
    }
</style>
