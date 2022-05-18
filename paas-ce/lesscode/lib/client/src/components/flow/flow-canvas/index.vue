<template>
    <div class="process-canvas-wrapper">
        <div class="tip-box" v-if="tipIsShow && $route.name === 'functionFlow'">
            <span>
                <bk-icon type="info-circle" class="info" />
                {{tips[type]}}
            </span>
            <i class="bk-icon icon-close" @click="tipIsShow = false"></i>
        </div>
        <bk-flow
            ref="flowCanvas"
            selector="entry-item"
            :data="canvasData"
            :show-palette="showPalette"
            :show-tool="showTool"
            :editable="editable"
            :endpoint-options="endpointOptions"
            :connector-options="connectorOptions"
            :node-options="nodeOptions"
            @onNodeMoveStop="handleNodeMoveStop"
            @onCreateNodeAfter="handleCreateNode"
            @onBeforeDrop="onBeforeDrop"
            @onConnection="onConnection"
            @onOverlayClick="onOverlayClick">
            <template slot="palettePanel">
                <palette-panel></palette-panel>
            </template>
            <template slot="toolPanel">
                <tool-panel @onZoomIn="onZoomIn" @onZoomOut="onZoomOut" @onResetPosition="onResetPosition"> </tool-panel>
            </template>
            <template slot="nodeTemplate" slot-scope="{ node }">
                <node-template
                    ref="templateNode"
                    :node="node"
                    :editable="editable"
                    @fastCreateNode="handleFastCreateNode"
                    @cloneNode="handleCloneNode"
                    @onNodeClick="handleNodeClick"
                    @delete="handleDeleteNode">
                </node-template>
            </template>
        </bk-flow>
        <bk-sideslider
            title="线条配置"
            :width="700"
            :quick-close="false"
            :is-show="showLineConfigPanel"
            :before-close="hanldeLineConfigPanelClose">
            <line-config
                slot="content"
                :line="lineConfig"
                :flow-id="flowId"
                :save-pending="lineSavePending"
                :delete-pending="lineDeletePending"
                @save="handleLineSave"
                @delete="handleLineDelete"
                @close="hanldeLineConfigPanelClose">
            </line-config>
        </bk-sideslider>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import { uuid } from '@/common/util.js'
    import BkFlow from './flow.js'
    import PalettePanel from './palettePanel.vue'
    import NodeTemplate from './nodeTemplate.vue'
    import ToolPanel from './toolPanel.vue'
    import LineConfig from './lineConfig.vue'

    const TIPS = {
        ADD: '数据删除功能可以用于同时删除多张表单数据的场景，通过在「数据源节点」后添加人工节点引导用户输入期望删除的数据条件，与数据处理节点搭配使用。',
        EDIT: '数据编辑功能可以在数据源中引用对应表单开放编辑的字段，与数据处理节点搭配使用',
        DETAIL: '查看详情功能用于表格的行操作列中，可以在「数据源节点」中配置字段实现开放部分数据给用户查看的场景。',
        DELETE: '数据删除功能可以用于同时删除多张表单数据的场景，通过在「数据源节点」后添加人工节点引导用户输入期望删除的数据条件，与数据处理节点搭配使用。'
    }

    const endpointOptions = {
        endpoint: 'Dot',
        connector: ['Flowchart', { stub: [10, 16], alwaysRespectStub: true, gap: 2, cornerRadius: 10 }],
        connectorOverlays: [['PlainArrow', { width: 8, length: 6, location: 1, id: 'arrow' }]],
        paintStyle: { fill: 'rgba(0, 0, 0, 0)', stroke: '', strokeWidth: 1, radius: 6 },
        hoverPaintStyle: { fill: '#EE8F62', stroke: '#EE8F62', radius: 8 },
        cssClass: 'template-canvas-endpoint',
        hoverClass: 'template-canvas-endpoint-hover',
        isSource: true, // 端点是否可以作为拖动源
        isTarget: true, // 端点是否可以作为拖动目标
        maxConnections: -1
    }
    const nodeOptions = {
        grid: [10, 10]
    }
    const connectorOptions = {
        paintStyle: { fill: 'transparent', stroke: '#a9adb6', strokeWidth: 1 },
        hoverPaintStyle: { fill: 'transparent', stroke: '#3a84ff', strokeWidth: 2 },
        cssClass: 'flow-connector',
        hoverClass: 'flow-connector-hover',
        detachable: true // 是否可以通过鼠标拖动连线
    }
    export default {
        components: {
            BkFlow,
            PalettePanel,
            NodeTemplate,
            ToolPanel,
            LineConfig
        },
        props: {
            nodes: {
                type: Array,
                default () {
                    return []
                }
            },
            lines: {
                type: Array,
                default () {
                    return []
                }
            },
            showPalette: {
                type: Boolean,
                default: true
            },
            type: { type: String },
            showTool: {
                type: Boolean,
                default: true
            },
            disableEditLine: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: true
            },
            flowId: Number
        },
        data () {
            return {
                endpointOptions,
                connectorOptions,
                nodeOptions,
                tips: TIPS,
                tipIsShow: true,
                canvasData: {
                    nodes: [],
                    lines: []
                },
                showLineConfigPanel: false,
                lineConfig: {},
                lineSavePending: false,
                lineDeletePending: false
            }
        },
        created () {
            this.transData()
        },
        mounted () {
            this.lines.forEach((item) => {
                const { id, name, from_state: sId, to_state: tId } = item
                this.addOverlay({
                    id,
                    name,
                    sourceId: `node_${sId}`,
                    targetId: `node_${tId}`
                })
            })
        },
        methods: {
            // 将数据转换为画布组件要求格式
            transData () {
                this.nodes.forEach((item, index) => {
                    const xValue = item.axis.x ? item.axis.x : 165 + index * 250
                    const yValue = item.axis.y ? item.axis.y : 195 + (index % 2 === 1 ? 5 : 0)
                    this.canvasData.nodes.push({
                        id: `node_${item.id}`,
                        x: xValue,
                        y: yValue,
                        type: item.type,
                        name: item.name,
                        nodeInfo: cloneDeep(item)
                    })
                })
                this.lines.forEach((item) => {
                    this.canvasData.lines.push({
                        source: {
                            arrow: item.axis.start || 'Right',
                            id: `node_${item.from_state}`
                        },
                        target: {
                            arrow: item.axis.end || 'Left',
                            id: `node_${item.to_state}`
                        },
                        lineInfo: item,
                        options: {
                            paintStyle: {
                                fill: 'transparent',
                                stroke: item.lineStatus === 'SUCCESS' ? '#2DCB56' : '#a9adb6',
                                strokeWidth: 1
                            }
                        }
                    })
                })
            },
            // 注册线条的Label
            addOverlay (line) {
                const sNode = this.canvasData.nodes.find(item => item.id === line.sourceId)
                if (sNode && sNode.type === 'START') {
                    return
                }
                const lineConfig = {
                    source: { id: line.sourceId },
                    target: { id: line.targetId },
                    id: line.id
                }
                const value = {
                    id: `label_${line.id}`,
                    type: 'Label',
                    name: `<span class="bk-label-test-name">${line.name || '默认'}</span>`,
                    cls: 'label-test',
                    location: 0.5
                }

                this.$refs.flowCanvas.addLineOverlay(lineConfig, value)
            },
            // 计算传入的 x +- delta, y +- delta 坐标上是否有节点
            isNodeIndividual (x, y, delta = 10) {
                return this.canvasData.nodes.some(item => item.x + delta > x && item.x - delta < x && item.y + delta > y && item.y - delta < y)
            },
            handleNodeClick (node) {
                this.$emit('onNodeClick', node.nodeInfo)
            },
            handleFastCreateNode (id, type) {
                const crtNode = this.canvasData.nodes.find(item => item.nodeInfo.id === id)
                const { x: nodeX, y: nodeY } = crtNode
                const x = nodeX + 340
                let y = nodeY
                while (this.isNodeIndividual(x, y)) {
                    y += 50
                }
                const node = {
                    id: `n${uuid(32)}`,
                    x,
                    y,
                    type
                }
                this.$refs.flowCanvas.createNode(node)
            },
            handleNodeMoveStop (node) {
                try {
                    const { x, y } = node
                    const params = {
                        id: node.nodeInfo.id,
                        data: {
                            axis: { x, y }
                        }
                    }
                    this.$store.dispatch('setting/patchFlowNode', params)
                } catch (e) {
                    console.error(e)
                }
            },
            async handleCreateNode (node) {
                if (node.nodeInfo && 'id' in node.nodeInfo) {
                    return false
                }
                try {
                    const { name = '', x, y, type } = node
                    const params = {
                        name,
                        type,
                        extras: {},
                        is_terminable: false, // @待确认是否需要
                        axis: { x, y },
                        workflow: this.flowId
                    }
                    const res = await this.$store.dispatch('setting/createFlowNode', params)
                    const { axis, type: nodeType, name: nodeName } = res.data
                    const addedNode = {
                        id: node.id,
                        x: axis.x,
                        y: axis.y,
                        type: nodeType,
                        name: nodeName,
                        nodeInfo: cloneDeep(res.data)
                    }
                    const index = this.canvasData.nodes.findIndex(item => item.id === node.id)
                    this.canvasData.nodes.splice(index, 1, addedNode)
                } catch (e) {
                    // this.$refs.flowCanvas.removeNode(addedNode);
                    console.error(e)
                }
            },
            async handleCloneNode (nodeId) {
                try {
                    const res = await this.$store.dispatch('setting/cloneFlowNode', nodeId)
                    const { id, axis, type, name } = res.data
                    const addedNode = {
                        id: `node_${id}`,
                        x: axis.x,
                        y: axis.y,
                        type,
                        name,
                        nodeInfo: cloneDeep(res.data)
                    }
                    this.$refs.flowCanvas.createNode(addedNode)
                } catch (e) {
                    console.error(e)
                }
            },
            // 创建连线
            async createLine (line) {
                const { source, target } = line
                if (this.canvasData.lines.find(item => item.source.id === source.id && item.target.id === target.id)) {
                    return
                }
                const sNode = this.canvasData.nodes.find(item => item.id === source.id)
                const tNode = this.canvasData.nodes.find(item => item.id === target.id)

                try {
                    const params = {
                        workflow: this.flowId,
                        name: '默认',
                        axis: {
                            start: source.anchor,
                            end: target.anchor
                        },
                        from_state: sNode.nodeInfo.id,
                        to_state: tNode.nodeInfo.id
                    }
                    const res = await this.$store.dispatch('setting/createLine', params)
                    const lineData = {
                        source: {
                            arrow: res.data.axis.start,
                            id: source.id
                        },
                        target: {
                            arrow: res.data.axis.end,
                            id: target.id
                        },
                        lineInfo: res.data,
                        options: {
                            paintStyle: {
                                fill: 'transparent',
                                stroke: res.data.lineStatus === 'SUCCESS' ? '#2DCB56' : '#a9adb6',
                                strokeWidth: 1
                            }
                        }
                    }
                    this.addOverlay({ id: res.data.id, sourceId: sNode.id, targetId: tNode.id })
                    this.canvasData.lines.push(lineData)
                } catch (e) {
                    this.$refs.flowCanvas.removeConnector({
                        source: { id: sNode.id },
                        target: { id: tNode.id }
                    })
                    // this.$refs.flowCanvas.removeNode(addedNode);
                    console.error(e)
                }
            },
            handleDeleteNode (node) {
                try {
                    this.$refs.flowCanvas.removeNode(node)
                    this.$store.dispatch('setting/deleteFlowNode', node.nodeInfo.id)
                } catch (e) {
                    console.log(e)
                }
            },
            // 校验连线是否合法
            checkLineValid (connection) {
                let result = true
                let message = ''
                const { sourceId, targetId } = connection
                const sNode = this.canvasData.nodes.find(item => item.id === sourceId)
                const tNode = this.canvasData.nodes.find(item => item.id === targetId)
                if (sourceId === targetId) {
                    result = false
                    message = '节点自身不能相连'
                } else {
                    // 开始节点只能输出（且只能单一输出），结束节点只能输入
                    if (sNode.type === 'START') {
                        if (this.canvas.lines.find(item => item.sourceId === sNode.id)) {
                            result = false
                            message = '开始节点只能单一输出！'
                        }
                    }
                    if (tNode.type === 'START') {
                        result = false
                        message = '开始节点只能输出！'
                    }
                    if (sNode.type === 'END') {
                        result = false
                        message = '结束节点只能输入！'
                    }
                    if (sNode.type === 'START' && tNode.type === 'END') {
                        result = false
                        message = '开始节点和结束节点不能直接相连！'
                    }
                }
                // 已存在相同的连线不能相连
                for (let i = 0; i < this.canvasData.lines.length; i++) {
                    if (sourceId === this.canvasData.lines[i].source.id && targetId === this.canvasData.lines[i].target.id) {
                        result = false
                        message = '已存在的连线相同连线！'
                    }
                }
                if (message) {
                    this.$bkMessage({
                        message,
                        theme: 'warning'
                    })
                }
                return result
            },
            onBeforeDrop (connection) {
                return this.checkLineValid(connection)
            },
            onConnection (connection) {
                const { sourceId, targetId, sourceEndpoint, targetEndpoint } = connection
                const line = {
                    source: {
                        id: sourceId,
                        anchor: sourceEndpoint.anchor.type
                    },
                    target: {
                        id: targetId,
                        anchor: targetEndpoint.anchor.type
                    }
                }
                this.createLine(line)
            },
            onOverlayClick (overlay) {
                if (!this.editable || this.disableEditLine) {
                    return
                }
                // 获取点击线条的实例
                const lineId = Number(overlay.id.split('_')[1])
                const crtLine = this.canvasData.lines.find(item => item.lineInfo.id === lineId)
                const sNode = this.canvasData.nodes.find(item => item.nodeInfo.id === crtLine.lineInfo.from_state)
                const tNode = this.canvasData.nodes.find(item => item.nodeInfo.id === crtLine.lineInfo.to_state)
                const sNodeLines = this.$refs.flowCanvas.getConnectorsByNodeId(sNode.id)
                const outgoingLines = sNodeLines.filter(item => item.sourceId === sNode.id)
                this.lineConfig = {
                    ...crtLine.lineInfo,
                    sNode,
                    tNode,
                    canSetCondition: outgoingLines.length > 1
                }
                this.showLineConfigPanel = true
            },
            onZoomIn () {
                this.$refs.flowCanvas.zoomIn(1.1, 0, 0)
            },
            onZoomOut () {
                this.$refs.flowCanvas.zoomOut(0.9, 0, 0)
            },
            onResetPosition () {
                this.$refs.flowCanvas.resetPosition()
            },
            async handleLineSave (data) {
                try {
                    this.lineSavePending = true
                    const res = await this.$store.dispatch('setting/updateLine', data)
                    const line = this.canvasData.lines.find(item => item.lineInfo.id === data.id)
                    this.$refs.flowCanvas.removeLineOverlay(
                        { source: { id: line.source.id }, target: { id: line.target.id } },
                        `label_${data.id}`
                    )
                    this.addOverlay({ id: data.id, name: res.data.name, sourceId: line.source.id, targetId: line.target.id })
                    const index = this.canvasData.lines.findIndex(item => item.lineInfo.id === data.id)
                    this.canvasData.lines.splice(index, 1, {
                        source: {
                            arrow: res.data.axis.start,
                            id: `node_${res.data.from_state}`
                        },
                        target: {
                            arrow: res.data.axis.end,
                            id: `node_${res.data.to_state}`
                        },
                        lineInfo: res.data,
                        options: {
                            paintStyle: {
                                fill: 'transparent',
                                stroke: res.data.lineStatus === 'SUCCESS' ? '#2dcb56' : '#a9adb6',
                                strokeWidth: 1
                            }
                        }
                    })
                    this.hanldeLineConfigPanelClose()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.lineSavePending = false
                }
            },
            async handleLineDelete () {
                try {
                    this.lineDeletePending = true
                    await this.$store.dispatch('setting/deleteLine', this.lineConfig.id)
                    this.$refs.flowCanvas.removeConnector({
                        source: { id: this.lineConfig.sNode.id },
                        target: { id: this.lineConfig.tNode.id }
                    })
                    const index = this.canvasData.lines.findIndex(item => item.lineInfo.id === this.lineConfig.id)
                    this.canvasData.lines.splice(index, 1)
                    this.hanldeLineConfigPanelClose()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.lineDeletePending = false
                }
            },
            hanldeLineConfigPanelClose () {
                this.showLineConfigPanel = false
            }
        }
    }
</script>
<style lang="postcss" scoped>
.process-canvas-wrapper {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  /deep/ .jsflow {
    border: none;
    .canvas-flow-wrap {
      background: #f5f7fa;
    }
    .palette-panel-wrap {
      height: auto;
      border-right: 1px solid #dde4eb;
      border-top: 1px solid #dde4eb;
      width: 60px;
      height: 100%;
      background-color: #fff;
    }
    .tool-panel-wrap {
      top: 76px;
      right: 24px;
      left: auto;
      padding: 0 14px;
      height: 32px;
      background: #ebedf0;
      border-radius: 18px;
      box-shadow: 0px 0px 4px 0px rgba(220, 222, 229, 0.8);
      overflow: hidden;
      z-index: 110;
    }
    .jtk-endpoint {
      z-index: 103;
      cursor: default;
    }
    .jsflow-node {
      z-index: 101;
    }
    .icon-choose-node {
      font-size: 20px;
    }
    .label-test {
      padding: 20px;
      &:hover {
        .bk-label-test-delete {
          opacity: 1;
        }
      }
    }
    .bk-label-test-name {
      padding: 0 20px;
      display: inline-block;
      border: 1px solid #c4c6cc;
      border-radius: 11px;
      color: #979ba5;
      font-size: 12px;
      padding: 0 8px;
      line-height: 22px;
      background-color: #fff;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        border: 1px solid #3a84ff;
        color: #3a84ff;
      }
    }
    .bk-label-test-delete {
      font-size: 14px;
      color: #ff5757;
      background: #ffffff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      background-color: #ff5757;
      line-height: 15px;
      color: #fff;
      float: left;
      opacity: 0;
      text-align: center;
      cursor: pointer;
    }
    .label-test {
      z-index: 20;
    }
    .label-success {
      border-color: #2dcb56;
      color: #2dcb56;
    }

    .canvas-flow-wrap .selected .common-node,
    .canvas-flow-wrap .selected .common-branch,
    .canvas-flow-wrap .selected .startpoint,
    .canvas-flow-wrap .selected .endpoint {
      border: 1px dashed #3a84ff;
    }
    .canvas-flow-wrap .bk-error-flow .common-node,
    .canvas-flow-wrap .bk-error-flow .common-branch,
    .canvas-flow-wrap .bk-error-flow .startpoint,
    .canvas-flow-wrap .bk-error-flow .endpoint {
      border: 1.5px dashed #ff5656;
    }
  }
}

.tip-box {
  position: absolute;
  top: 20px;
  left: 83px;
  display: flex;
  padding-right: 10px;
  border: 1px solid #C5DAFF;
  border-radius: 2px;
  background: #F0F8FF;
  font-size: 12px;
  color: #63656E;
  width: calc(100% - 108px);
  line-height: 32px;
  z-index: 100;
  justify-content: space-between;
  .info {
    top: 24px;
    margin: 0 8px 0 11px;
    color: #3A84FF;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    height: 32px;
  }

  .icon-close {
    display: inline-block;
    font-size: 16px;
    margin-top: 8px;
    &:hover{
      cursor: pointer;
    }
  }
}
</style>
