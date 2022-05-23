<template>
    <!--    <div>form-setting</div>-->
    <div class="config-panel">
        <div class="panel-title">{{ fieldType[configData.type] || '组件名称'}}</div>
        <div class="config-wrapper">
            <field-edit
                v-if="field.type"
                v-model="configData"
                :list="list"
                @change="$emit('update', $event)">
            </field-edit>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import { FIELDS_TYPES_MAPS } from '../../constant/forms'
    import fieldEdit from '../form-edit/fieldEdit.vue'
    export default {
        name: 'FormSetting',
        components: {
            fieldEdit
        },
        props: {
            appId: String,
            field: {
                type: Object,
                default: () => ({})
            },
            list: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                configData: cloneDeep(this.field),
                fieldType: FIELDS_TYPES_MAPS
            }
        },
        watch: {
            field (val) {
                this.configData = cloneDeep(val)
            }
        }
    }
</script>

<style lang="postcss" scoped>
@import "@/css/mixins/scroller";
.config-panel {
  position: relative;
  width: 320px;
  height: calc(100vh - 126px);
  //overflow: auto;
  background: #ffffff;
  z-index: 1;
}

.panel-title {
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #313238;
  background: #ffffff;
  border-top: 1px solid #dcdee5;
  border-bottom: 1px solid #dcdee5;
}

.config-wrapper {
  padding: 16px 24px;
  height: calc(100% - 40px);
  overflow: auto;
  @mixin scroller;
}
</style>
