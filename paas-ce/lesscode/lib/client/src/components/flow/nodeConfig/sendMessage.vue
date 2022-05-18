<template>
    <div class="bk-send-message">
        <bk-tab :active="activeName" @tab-change="changPanel" v-if="show">
            <bk-tab-panel
                v-for="(panel, index) in itemInfo.sub_components"
                v-bind="panel"
                :key="index"
                :test-posi-id="panel.key">
                <template slot="label">
                    <bk-checkbox style="float: left; margin: 12px 8px 0 0;"
                        :true-value="trueStatus"
                        :false-value="falseStatus"
                        v-model="panel.checked">
                    </bk-checkbox>
                    <i class="bk-icon" :class="[panel.icon]"></i>
                    <span class="panel-name">{{panel.label}}</span>
                </template>
                <div v-for="(subPanel, subIndex) in itemInfo.sub_components"
                    :key="subIndex"
                    v-if="activeName === subPanel.name">
                    <div v-for="(field, fieldIndex) in subPanel.field_schema"
                        :key="fieldIndex"
                        class="mb20"
                        :test-posi-id="field.key">
                        <bk-form-item
                            :label="field.name"
                            :required="field.required"
                            :key="index"
                            :desc="field.tips">
                            <change-conductor
                                :index="index"
                                :item-info="field"
                                :origin="'message'"
                                @change-panel-status="changePanelStatus(subPanel, subIndex)">
                            </change-conductor>
                        </bk-form-item>
                    </div>
                </div>
            </bk-tab-panel>
        </bk-tab>
    </div>
</template>
<script>
    import changeConductor from './changeConductor.vue'

    export default {
        name: 'SendMessage',
        components: {
            changeConductor
        },
        props: {
            itemInfo: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                trueStatus: true,
                falseStatus: false,
                activeName: 'send_email_message',
                show: true
            }
        },
        computed: {

        },
        created () {
            this.itemInfo.sub_components.forEach((item) => {
                this.$set(item, 'checked', (item.checked || false))
                this.$set(item, 'label', item.name)
                this.$set(item, 'icon', '')
                switch (item.key) {
                    case 'send_email_message':
                        item.icon = 'icon-email'
                        break
                    case 'send_sms_message':
                        item.icon = 'icon-mobile'
                        break
                    case 'send_wechat_message':
                        item.icon = 'icon-weixin'
                        break
                }
                item.name = item.key
            })
        },
        mounted () {

        },
        methods: {
            changPanel (name) {
                this.activeName = name
            },
            changePanelStatus (panel, pIndex) {
                this.show = false
                this.$nextTick(() => {
                    panel.checked = true
                    this.itemInfo.sub_components.splice(pIndex, 1, panel)
                    this.show = true
                })
            }
        }
    }
</script>

<style lang='postcss' scoped>
.bk-send-message {
  /deep/ .bk-tab-section{
    border: none;
  }
  /deep/ .bk-tab-label-item{
    min-width: 200px;
  }
}
</style>
