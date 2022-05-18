<template>
    <ul class="palette-panel">
        <li v-for="node in nodeTypeList" v-bk-tooltips.right="node.name" :key="node.type">
            <div v-if="node.type === 'START'" class="start-node" data-type="START">开始</div>
            <div v-else-if="node.type === 'END'" class="end-node" data-type="END">结束</div>
            <div
                v-else
                :class="['entry-item', { 'gateway-node': ['ROUTER-P', 'COVERAGE'].includes(node.type) }]"
                :data-type="node.type">
                <i :class="['custom-icon-font', node.menuIcon]"></i>
            </div>
        </li>
    </ul>
</template>
<script>
    import { NODE_TYPE_LIST } from '../constants/nodes.js'

    export default {
        name: 'PalettePanel',
        data () {
            return {
                nodeTypeList: NODE_TYPE_LIST
            }
        }
    }
</script>
<style lang="postcss" scoped>
.palette-panel {
  margin: 0;
  padding: 0;
  list-style: none;
  & > li {
    position: relative;
    text-align: center;
  }
  .start-node,
  .end-node {
    display: inline-block;
    margin: 12px 0;
    width: 34px;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    color: #979ba5;
    border: 1px solid #c3cdd7;
    border-radius: 50%;
    user-select: none;
    cursor: not-allowed;
  }
  .entry-item {
    display: inline-block;
    padding: 12px 0;
    width: 100%;
    color: #979ba5;
    user-select: none;
    cursor: move;
    &.gateway-node i {
      font-size: 32px;
    }
    &:hover {
      background: #e1ecff;
      color: #3a84ff;
    }
    i {
      font-size: 26px;
    }
  }
}
</style>
