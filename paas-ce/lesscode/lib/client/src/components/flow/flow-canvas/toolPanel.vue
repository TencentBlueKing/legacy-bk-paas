<template>
    <div class="tool-panel-container">
        <div v-bk-tooltips.top="'放大'" class="tool-item" @click="onZoomIn" title="放大">
            <i class="custom-icon-font icon-add-line"></i>
        </div>
        <div v-bk-tooltips.top="'缩小'" class="tool-item" @click="onZoomOut" title="缩小">
            <i class="custom-icon-font icon-reduce-line"></i>
        </div>
        <div v-bk-tooltips.top="'复位'" class="tool-item" @click="onResetPosition" title="复位">
            <i class="custom-icon-font icon-reduction"></i>
        </div>
    <!-- <div v-bk-tooltips.top="'全屏'" class="tool-item" @click="onZoomOut" title="全屏">
      <i class="custom-icon-font icon-fullscreen"></i>
    </div> -->
    </div>
</template>
<script>
    export default {
        name: 'ToolPanel',
        props: {},
        data () {
            return {}
        },
        methods: {
            onZoomIn () {
                this.$emit('onZoomIn')
            },
            onZoomOut () {
                this.$emit('onZoomOut')
            },
            onResetPosition () {
                this.$emit('onResetPosition')
            }
        }
    }
</script>
<style lang="postcss" scoped>
.tool-panel-container {
  display: flex;
  align-items: center;
  .tool-item {
    padding: 0 10px;
    line-height: 32px;
    font-size: 20px;
    color: #c4c6cc;
    cursor: pointer;
    &:hover {
      color: #979ba5;
      background: #e1e3e6;
    }
  }
}
</style>
