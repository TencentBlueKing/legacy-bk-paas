<template>
    <div
        v-bk-clickoutside="closeShortcutPanel"
        :class="['process-node-item', { 'draft-status': node.nodeInfo && node.nodeInfo.is_draft }]"
        @mousedown="onMousedown"
        @contextmenu.prevent="handleContextMenuClick"
        @click="handleNodeClick">
        <!-- 开始节点 -->
        <div v-if="node.type === 'START'" class="start-node">开始</div>
        <!-- 结束节点 -->
        <div v-else-if="node.type === 'END'" class="end-node">结束</div>
        <!-- 并行网关 -->
        <div v-else-if="node.type === 'ROUTER-P'" class="gateway-node">
            <i class="custom-icon-font icon-node-convergence"></i>
        </div>
        <!-- 汇聚网关 -->
        <div v-else-if="node.type === 'COVERAGE'" class="gateway-node">
            <i class="custom-icon-font icon-node-branch"></i>
        </div>
        <!-- 普通流转节点 -->
        <div v-else :class="['flow-node', node.nodeInfo && node.nodeInfo.status]">
            <div class="node-icon-area">
                <i :class="['custom-icon-font', nodeTypeList.find(item => item.type === node.type).icon]"></i>
            </div>
            <div class="node-name-area" :title="node.name || '新增节点'">
                {{ node.name || '新增节点' }}
            </div>
            <div
                v-if="
                    node.nodeInfo && ['TERMINATED', 'FAILED', 'FINISHED', 'RUNNING', 'SUSPEND'].includes(node.nodeInfo.status)
                "
                class="status-icon">
                <i v-if="node.nodeInfo.status === 'FINISHED'" class="bk-icon icon-check-1"></i>
                <i v-if="['TERMINATED', 'FAILED'].includes(node.nodeInfo.status)" class="bk-icon icon-close"></i>
                <!-- <img
                    v-if="['RUNNING', 'SUSPEND'].includes(node.nodeInfo.status)"
                    src="../../assets/images/spin.svg"
                    class="spin-img" /> -->
            </div>
            <div class="action-desc-area" v-if="!single && !hideNodeGuide && node.nodeInfo && node.nodeInfo.is_builtin">
                <p><span>单击：</span>快速配置节点</p>
                <p><span>右键：</span>调出快速添加节点菜单</p>
                <i class="bk-icon icon-close" @click.stop="closeNodeGuide"></i>
            </div>
        </div>
        <i
            v-if="editable && !(node.nodeInfo && node.nodeInfo.is_builtin)"
            class="bk-icon icon-close node-delete-icon"
            @click.stop="$emit('delete', node)">
        </i>
        <!-- 更多操作 -->
        <div class="shortcut-panel" v-if="shortcutPanelShow && node.type !== 'START' && node.type !== 'END'">
            <ul class="node-list">
                <li
                    v-for="type in shortcutNodes"
                    :key="type"
                    :class="{ 'gataway-type': ['ROUTER-P', 'COVERAGE'].includes(type) }"
                    @click.stop="$emit('fastCreateNode', node.nodeInfo.id, type)">
                    <i :class="['custom-icon-font', nodeTypeList.find(item => item.type === type).menuIcon]"></i>
                </li>
            </ul>
            <div class="action-area">
                <span
                    :class="['action-item', { disabled: ['ROUTER-P', 'COVERAGE'].includes(node.type) }]"
                    @click.stop="$emit('onNodeClick', node)">
                    配置
                </span>
                <span class="action-item" @click.stop="$emit('cloneNode', node.nodeInfo.id)">复制</span>
                <span
                    :class="['action-item', { disabled: node.nodeInfo && node.nodeInfo.is_builtin }]"
                    @click.stop="handleDeleteNode">
                    删除
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    import { NODE_TYPE_LIST } from '../constants/nodes.js'

    export default {
        name: 'NodeTemplate',
        props: {
            node: {
                type: Object,
                default () {
                    return {}
                }
            },
            editable: {
                type: Boolean,
                default: true
            },
            single: {
                type: Boolean,
                default: false
            },
            canvasData: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                moveFlag: {
                    x: 0,
                    y: 0
                },
                hideNodeGuide: false,
                shortcutPanelShow: false,
                nodeTypeList: NODE_TYPE_LIST,
                shortcutNodes: ['NORMAL', 'DATA-PROC', 'TASK', 'SIGN', 'APPROVAL', 'COVERAGE', 'ROUTER-P']
            }
        },
        created () {
            this.hideNodeGuide = JSON.parse(localStorage.getItem('hideNodeGuide'))
        },
        methods: {
            onMousedown (e) {
                this.moveFlag = { x: e.pageX, y: e.pageY }
            },
            handleNodeClick (e) {
                const moveBuffer = 2
                const { pageX: x, pageY: y } = e
                if (Math.abs(x - this.moveFlag.x) < moveBuffer && Math.abs(y - this.moveFlag.y) < moveBuffer) {
                    this.$emit('onNodeClick', this.node)
                }
            },
            // 鼠标右键单击
            handleContextMenuClick () {
                if (this.editable) {
                    this.shortcutPanelShow = true
                }
            },
            closeShortcutPanel () {
                this.shortcutPanelShow = false
            },
            // 删除节点
            handleDeleteNode () {
                // 内置节点不可删除
                if (this.node.nodeInfo && this.node.nodeInfo.is_builtin) {
                    return
                }
                this.$emit('delete', this.node)
            },
            // 隐藏节点操作提示
            closeNodeGuide () {
                this.hideNodeGuide = true
                localStorage.setItem('hideNodeGuide', true)
            }
        }
    }
</script>
<style lang="postcss" scoped>
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.process-node-item {
  position: relative;
  &.draft-status {
    .node-icon-area {
      background: #c4c6cc;
    }
  }
  &:hover {
    .node-delete-icon {
      display: block;
    }
  }
}
.start-node,
.end-node {
  width: 40px;
  height: 40px;
  line-height: 37px;
  border-radius: 50%;
  border: 2px solid #c9cacb;
  text-align: center;
  color: #63656e;
  background-color: #f0f1f5;
  font-size: 12px;
  box-shadow: 0px 2px 4px 0px rgba(196, 198, 204, 0.5);
}
.gateway-node {
  border: 1px solid #c4c6cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: #fff;
  position: relative;
  box-shadow: 0px 2px 4px 0px rgba(196, 198, 204, 0.5);
  cursor: pointer;
  position: relative;
  & > i {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 25px;
    color: #737987;
    transform: translate(-50%, -50%);
  }
}
.flow-node {
  position: relative;
  padding-left: 40px;
  width: 150px;
  height: 40px;
  line-height: 38px;
  color: #63656e;
  font-size: 14px;
  text-align: center;
  border: 1px solid #dcdee5;
  border-radius: 25px;
  background-color: #fff;
  box-shadow: 0px 2px 4px 0px rgba(196, 198, 204, 0.5);
  cursor: pointer;
  &:hover {
    border: 1px solid #3a84ff;
    border-radius: 20px;
    .node-name-area {
      color: #3a84ff;
    }
  }
  &.FINISHED {
    .node-icon-area {
      background: #2dcb56;
    }
    .status-icon {
      background: #2dcb56;
    }
  }
  &.TERMINATED,
  &.FAILED {
    .node-icon-area {
      background: #ff5656;
    }
    .status-icon {
      background: #ff5656;
    }
  }
  &.RUNNING,
  &.SUSPEND {
    .node-icon-area {
      background: #3a84ff;
    }
    .status-icon {
      background: #3a84ff;
    }
  }
  .node-icon-area {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 16px;
    width: 40px;
    height: 38px;
    line-height: 38px;
    color: #fff;
    background-color: #3a84ff;
    border-radius: 25px 0 0 25px;
    box-shadow: 0px 2px 4px 0px rgba(196, 198, 204, 0.5);
    .custom-icon-font {
      position: absolute;
      top: 49%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.74, 0.74);
      &.icon-node-api-pure {
        font-size: 12px;
      }
    }
  }
  .status-icon {
    position: absolute;
    top: 12px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    color: #ffffff;
  }
  .spin-img {
    width: 10px;
    animation: rotation 1.5s linear infinite;
  }
  .action-desc-area {
    position: absolute;
    top: -70px;
    left: -28px;
    padding: 10px;
    border: 1px solid #dcdee5;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.09);
    line-height: 20px;
    background-color: #fff;
    width: 210px;
    text-align: left;
    &::before {
      content: '';
      position: absolute;
      bottom: -5px;
      right: 100px;
      transform: rotate(-45deg);
      width: 10px;
      height: 10px;
      border-left: 1px solid #dcdee5;
      border-bottom: 1px solid #dcdee5;
      background-color: #fff;
    }
    span {
      font-weight: bold;
    }
    .icon-close {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 18px;
      border-radius: 50%;
      &:hover {
        background-color: #dcdee5;
        color: #fff;
      }
    }
  }
}
.node-name-area {
  display: inline-block;
  box-sizing: border-box;
  width: 110px;
  padding: 0 20px 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.node-delete-icon {
  position: absolute;
  top: -8px;
  right: -4px;
  display: none;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%;
  background-color: #d8d8d8;
  color: #fff;
  font-size: 18px;
  text-align: center;
  z-index: 2;
  cursor: pointer;
  &:hover {
    background-color: #979ba5;
  }
}
.shortcut-panel {
  position: absolute;
  top: 30px;
  right: -178px;
  width: 180px;
  background-color: #fff;
  border: 1px solid #dde4eb;
  box-shadow: 0px 2px 4px 0px rgba(218, 218, 218, 0.5);
  border-radius: 2px;
  z-index: 103;
  cursor: initial;
  .node-list {
    overflow: hidden;
    & > li {
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25%;
      height: 42px;
      &.gataway-type {
        i {
          font-size: 28px;
        }
      }
      i {
        color: #737987;
        font-size: 24px;
        cursor: pointer;
        &:hover {
          color: #3a84ff;
        }
      }
    }
  }
  .action-area {
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #63656e;
    height: 28px;
    font-size: 12px;
    border-top: 1px solid #e9edf1;
    .action-item {
      color: #63656e;
      cursor: pointer;
      &.disabled {
        color: #c6cfd9;
        cursor: not-allowed;
      }
      &:hover {
        color: #3a84ff;
      }
    }
  }
}
</style>
