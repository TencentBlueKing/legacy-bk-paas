<template>
    <section class="advanced-config">
        <div class="advanced-config-form">
            <bk-form ref="advancedForm" form-type="vertical" :model="advancedData" :rules="rules">
                <div class="form-section">
                    <h4>撤回设置</h4>
                    <bk-form-item label="撤回方式" :class="{ 'half-row-form': advancedData.revoke_config.type === 3 }">
                        <bk-select
                            v-model="advancedData.revoke_config.type"
                            :clearable="false"
                            @selected="onSelectRevokeType"
                            :disabled="funcData.is_builtin">
                            <bk-option v-for="item in revokeTypeList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                        </bk-select>
                    </bk-form-item>
                    <!-- 指定可撤回节点 -->
                    <bk-form-item v-if="advancedData.revoke_config.type === 3" class="half-row-form">
                        <bk-select
                            v-model="advancedData.revoke_config.state"
                            :clearable="false"
                            :disabled="flowNodesLoading"
                            :loading="flowNodesLoading">
                            <bk-option v-for="item in flowNodes" :key="item.id" :id="item.id" :name="item.name || '新增节点'">
                            </bk-option>
                        </bk-select>
                    </bk-form-item>
                </div>
                <div class="form-section">
                    <h4>任务通知策略</h4>
                    <bk-form-item label="通知方式">
                        <bk-checkbox-group
                            :value="advancedData.notify.map(item => item.type)"
                            @change="onSelectNotifyType">
                            <bk-checkbox
                                v-for="item in notifyTypeList"
                                :key="item.type"
                                :value="item.type"
                                :disabled="funcData.is_builtin">
                                {{ item.name }}
                            </bk-checkbox>
                        </bk-checkbox-group>
                    </bk-form-item>
                    <bk-form-item
                        v-if="advancedData.notify.length > 0"
                        label="通知频率"
                        :class="{ 'half-row-form': advancedData.notify_rule === 'RETRY' }">
                        <bk-select v-model="advancedData.notify_rule" :clearable="false">
                            <bk-option v-for="item in notifyFrequencies" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                        </bk-select>
                    </bk-form-item>
                    <bk-form-item v-if="advancedData.notify_rule === 'RETRY'" class="half-row-form">
                        <bk-select v-model="advancedData.notify_freq" :clearable="false">
                            <bk-option v-for="item in frequencyList" :key="item.id" :id="item.id" :name="item.name"></bk-option>
                        </bk-select>
                    </bk-form-item>
                </div>
                <div class="extend-setting-btn">
                    <span class="trigger-area" @click="extendSettingOpen = !extendSettingOpen">
                        高级配置
                        <i :class="['bk-icon', 'icon-angle-double-down', { opened: extendSettingOpen }]"></i>
                    </span>
                </div>
                <div v-show="extendSettingOpen" class="form-section">
                    <h4>开放设置</h4>
                    <bk-form-item class="display-checkbox" label="显示设置">
                        <bk-checkbox
                            v-model="advancedData.show_all_workflow"
                            :disabled="funcData.is_builtin">
                            在【全部流程】中显示
                        </bk-checkbox>
                        <bk-checkbox
                            v-model="advancedData.show_my_create_workflow"
                            :disabled="funcData.is_builtin">
                            在【我发起的】中显示
                        </bk-checkbox>
                    </bk-form-item>
                </div>
            </bk-form>
        </div>
        <div class="action-wrapper">
            <bk-button
                size="large"
                @click="$router.push({ name: 'functionFlow', params: { appId: appId, funcId: funcData.id } })">
                上一步
            </bk-button>
            <bk-button
                theme="primary"
                size="large"
                :loading="advancedPending"
                @click="handleSave"
                :disabled="funcData.is_builtin">提交</bk-button>
        </div>
    </section>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    export default {
        name: 'AdvancedConfig',
        props: {
            appId: {
                type: String,
                default: ''
            },
            funcData: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                advancedData: cloneDeep(this.funcData),
                advancedDataLoading: false,
                advancedPending: false,
                flowNodesLoading: false,
                flowNodes: [],
                extendSettingOpen: false,
                revokeTypeList: [
                    { id: 0, name: '不支持撤回' },
                    { id: 1, name: '任何节点，提单人都可撤回单据' },
                    { id: 2, name: '提单后，单据未被处理流转前，提单人可以撤回' },
                    { id: 3, name: '指定节点前可以撤回' }
                ],
                notifyTypeList: [
                    { type: 'WEIXIN', name: '企业微信' },
                    { type: 'EMAIL', name: '邮件' },
                    { type: 'SMS', name: 'SMS短信' }
                ],
                notifyFrequencies: [
                    { id: 'ONCE', name: '首次通知，以后不再通知' },
                    { id: 'RETRY', name: '首次通知后，次日起每天定时通知' }
                ],
                frequencyList: this.getFrequencyList(),
                rules: {}
            }
        },
        created () {
            if (this.funcData.revoke_config.type === 3) {
                this.getFlowNodes()
            }
        },
        methods: {
            async getFlowNodes () {
                try {
                    this.flowNodesLoading = true
                    const res = await this.$store.dispatch('setting/getFlowNodes', { workflow: this.advancedData.workflow_id })
                    this.flowNodes = res.data.filter(node => !node.is_builtin && !['ROUTER-P', 'COVERAGE'].includes(node.type))
                } catch (e) {
                    console.error(e)
                } finally {
                    this.flowNodesLoading = false
                }
            },
            getFrequencyList () {
                const list = []
                for (let i = 0; i <= 23; i++) {
                    list.push({
                        id: i * 3600,
                        name: `${i < 10 ? '0' : ''}${i}:00`
                    })
                }
                return list
            },
            onSelectRevokeType (val) {
                if (val === 3) {
                    this.getFlowNodes()
                } else {
                    this.advancedData.revoke_config.state = 0
                }
            },
            onSelectNotifyType (val) {
                const notify = []
                val.forEach((type) => {
                    const notifyItem = this.notifyTypeList.find(item => item.type === type)
                    notify.push(notifyItem)
                })
                this.advancedData.notify = notify
                this.advancedData.notify_rule = val.length > 0 ? 'ONCE' : 'NONE'
            },
            handleSave () {
                this.$refs.advancedForm.validate(async (result) => {
                    if (!result) {
                        return
                    }
                    try {
                        this.advancedPending = true
                        const {
                            notify,
                            notify_freq,
                            notify_rule,
                            revoke_config,
                            show_all_workflow,
                            show_my_create_workflow
                        } = this.advancedData
                        const isRevocable = revoke_config.type !== 0
                        const params = {
                            id: this.funcData.id,
                            workflow_config: {
                                notify,
                                notify_freq,
                                notify_rule,
                                revoke_config,
                                is_revocable: isRevocable,
                                show_all_workflow,
                                show_my_create_workflow
                            }
                        }
                        await this.$store.dispatch('setting/updateAdvancedConfig', params)
                        this.$router.push({ name: 'functionList', params: { appId: this.appId } })
                    } catch (e) {
                        console.error(e)
                    } finally {
                        this.advancedPending = false
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
.advanced-config {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.advanced-config-form {
  height: calc(100% - 56px);
  overflow: auto;

  .form-section {
    margin: 24px auto 0;
    padding: 24px 200px 32px;
    width: 1000px;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(25, 25, 41, 0.05);
    border-radius: 2px;

    & > h4 {
      margin: 0 0 16px;
      height: 22px;
      line-height: 22px;
      font-size: 14px;
      color: #63656e;
    }

    & > h5 {
      margin: 0 0 16px;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      color: #979ba5;
    }
    .half-row-form {
      display: inline-block;
      width: 49%;
    }
  }

  .trigger-section{
    margin: 24px auto;
  }
  .extend-setting-btn {
    margin: 24px auto 0;
    width: 600px;

    .trigger-area {
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      color: #3a84ff;
      cursor: pointer;
      user-select: none;

      & > i {
        display: inline-block;
        font-size: 18px;
        transition: transform 0.2s ease-in-out;

        &.opened {
          transform: rotate(-180deg);
        }
      }
    }
  }

  .display-checkbox {
    /deep/ .bk-form-checkbox {
      margin-right: 24px;
    }
  }
}

.action-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 24px;
  height: 56px;
  line-height: 56px;
  text-align: right;
  background: #fafbfd;
  box-shadow: inset 0 1px 0 0 #dcdee5;

  .bk-button {
    margin-left: 4px;
    min-width: 100px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
