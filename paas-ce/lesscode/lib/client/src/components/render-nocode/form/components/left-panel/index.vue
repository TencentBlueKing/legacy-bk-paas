<template>
    <!--    <div>form-material</div>-->
    <div class="side-panel">
        <div class="fields-list-container">
            <div v-for="(group, index) in list" class="field-group" :key="index">
                <h4 class="group-name">{{ group.name }}</h4>
                <draggable
                    class="list-wrap"
                    handle=".field-item"
                    tag="p"
                    :sort="false"
                    :group="{
                        name: 'menu',
                        pull: 'clone',
                        put: false
                    }"
                    :list="group.items"
                    :move="handleMove"
                    @end="handleEnd">
                    <li v-for="field in group.items" class="field-item drag-entry" :data-type="field.type" :key="field.type">
                        {{ field.name }}
                    </li>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import { FIELDS_TYPES } from '../../constant/forms'
    export default {
        components: {
            draggable
        },
        data () {
            return {
                list: this.getGroupedFields()
            }
        },
        methods: {
            getGroupedFields () {
                const layout = ['DESC', 'DIVIDER']
                const group = [
                    {
                        name: '基础控件',
                        items: []
                    },
                    {
                        name: '布局控件',
                        items: []
                    }
                ]
                FIELDS_TYPES.forEach(item => {
                    if (layout.includes(item.type)) {
                        group[1].items.push(item)
                    } else {
                        group[0].items.push(item)
                    }
                })
                return group
            },
            handleMove () {
                this.$emit('move')
            },
            handleEnd () {
                this.$emit('end')
            }
        }
    }
</script>
<style lang="postcss" scoped>
.side-panel {
  position: relative;
  width: 340px;
  height: 100%;
  background: #fcfcfc;
  z-index: 1;
}

.panel-title {
  padding: 0 16px;
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  background: #ffffff;
  border-top: 1px solid #dcdee5;
  border-bottom: 1px solid #dcdee5;
}

.fields-list-container {
  padding: 8px 16px 0;
  height: calc(100% - 44px);
  overflow: auto;
}

.group-name {
  line-height: 20px;
  color: #c4c6cc;
  font-size: 12px;
  font-weight: normal;
}

.list-wrap {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
}

.field-item {
  margin-bottom: 8px;
  padding: 0 4px 0 16px;
  width: 140px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: #63656e;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  cursor: move;
  user-select: none;

  &:hover {
    color: #3a84ff;
    border-color: #3a84ff;
  }
}
</style>
