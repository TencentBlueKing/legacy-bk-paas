<template>
    <div class="processors-form">
        <div :class="['form-container', { 'half-row-form': !hideProcessorsForm }]">
            <bk-select
                v-model="formData.type"
                class="type-form-item"
                :clearable="false"
                :loading="roleGroupListLoading"
                :disabled="roleGroupListLoading || disableType || !editable"
                @selected="handleSelectGroup">
                <bk-option v-for="item in groupTypeList" :key="item.type" :id="item.type" :name="item.name"></bk-option>
            </bk-select>
            <div v-if="!hideProcessorsForm" class="role-form-item">
                <!-- 人员选择 -->
                <member-select
                    v-if="formData.type === 'PERSON'"
                    v-model="formData.processors"
                    :specify-id-list="specifyRuleList"
                    :disabled="!editable"
                    @change="handleSelectProcessor">
                </member-select>
                <!-- 组织架构 -->
                <bk-select
                    v-if="formData.type === 'ORGANIZATION'"
                    :clearable="false"
                    :disabled="!editable"
                    @toggle="orgSelectOpen = !orgSelectOpen">
                    <div :class="['org-selector-trigger', { unselected: formData.processors === '' }]" slot="trigger">
                        {{ formData.processors ? getOrganizationsPath(Number(formData.processors), organizationList) : '请选择' }}
                        <i :class="['select-angle-icon', 'bk-icon', 'icon-angle-down', { open: orgSelectOpen }]"></i>
                    </div>
                    <bk-big-tree
                        :data="organizationList"
                        :selectable="true"
                        :default-selected-node="formData.processors !== '' ? Number(formData.processors) : ''"
                        @node-click="handleSelectOrgan">
                    </bk-big-tree>
                </bk-select>
                <!-- 角色用户 -->
                <bk-select
                    v-if="['GENERAL', 'CMDB', 'IAM', 'API', 'ASSIGN_LEADER', 'VARIABLE'].includes(formData.type)"
                    v-model="formData.processors"
                    :key="formData.type"
                    :searchable="true"
                    :clearable="false"
                    :loading="roleListLoading"
                    :disabled="roleListLoading || !editable"
                    :multiple="formData.type !== 'ASSIGN_LEADER'"
                    @change="handleSelectProcessor">
                    <bk-option v-for="option in roleList" :key="option.id" :id="option.id" :name="option.name"> </bk-option>
                </bk-select>
            </div>
        </div>
        <p v-if="errorTips" class="common-error-tips">处理人不能为空</p>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import MemberSelect from '@/components/nocode-form/components/memberSelect.vue'

    export default {
        name: 'Processors',
        components: {
            MemberSelect
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            appId: {
                type: String,
                default: ''
            },
            flowId: Number,
            nodeId: Number,
            shortcut: {
                type: Boolean,
                default: false
            },
            specifyIds: {
                type: Array,
                default: () => []
            },
            disableType: {
                type: Boolean,
                default: false
            },
            excludeList: {
                type: Array,
                default: () => []
            },
            value: {
                type: Object,
                default () {
                    return {
                        type: '',
                        processors: ''
                    }
                }
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            const { type, processors } = this.value
            return {
                roleGroupListLoading: false,
                roleGroupList: [],
                roleListLoading: false,
                roleList: [],
                organizationsLoading: false,
                organizationList: [], // 组织架构
                memberFieldListLoading: false,
                preNodeListLoading: false,
                formData: {
                    type,
                    processors: this.transProcessorsToComp(type, processors)
                },
                orgSelectOpen: false,
                errorTips: false // 显示校验错误
            }
        },
        computed: {
            groupTypeList () {
                return this.roleGroupList.filter(item => !this.excludeList.includes(item.type))
            },
            hideProcessorsForm () {
                return ['EMPTY', 'OPEN', 'STARTER', 'BY_ASSIGNOR', 'STARTER_LEADER'].includes(this.formData.type)
            },
            specifyRuleList () {
                const target = this.specifyIds.find(rule => rule.type === this.formData.type)
                return target ? target.list : []
            }
        },
        watch: {
            value (val, oldVal) {
                const { type, processors } = val
                this.formData = {
                    type,
                    processors: this.transProcessorsToComp(type, processors)
                }
                if (val.type !== oldVal.type && val.type) {
                    this.getProcessorList()
                }
            }
        },
        mounted () {
            this.getRoleGroupList()
            if (!this.hideProcessorsForm && this.value.type) {
                this.getProcessorList()
            }
        },
        methods: {
            // 获取第一级角色分组列表
            async getRoleGroupList () {
                try {
                    this.roleGroupListLoading = true
                    const res = await this.$store.dispatch('setting/getRoleGroups', {
                        is_processor: true,
                        project_key: this.appId
                    })
                    this.roleGroupList = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.roleGroupListLoading = false
                }
            },
            // 获取第二级处理人列表
            async getRoleList () {
                try {
                    this.roleListLoading = true
                    let res
                    if (this.formData.type === 'ASSIGN_LEADER') {
                        this.getPreNodes()
                    } else if (this.formData.type === 'VARIABLE') {
                        this.getNodeVars()
                    } else {
                        res = await this.$store.dispatch('setting/getRoleGroupProcessors', {
                            role_type: this.formData.type,
                            project_key: this.appId
                        })
                        this.roleList = res.data
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    this.roleListLoading = false
                }
            },
            // 获取组织架构数据
            async getOrganizations () {
                try {
                    this.organizationsLoading = true
                    const res = await this.$store.dispatch('setting/getOrganizations')
                    this.organizationList = res.data
                } catch (e) {
                    console.error(e)
                } finally {
                    this.organizationsLoading = false
                }
            },
            // 获取节点中人员类型的字段
            async getNodeVars () {
                try {
                    this.memberFieldListLoading = true
                    const params = {
                        workflow: this.flowId,
                        state: this.nodeId,
                        exclude_self: true
                    }
                    const res = await this.$store.dispatch('setting/getNodeVars', params)
                    this.roleList = res.data
                        .filter(item => ['MEMBERS', 'MEMBER'].includes(item.type))
                        .map(item => ({ id: item.key, name: item.name }))
                } catch (e) {
                    console.error(e)
                } finally {
                    this.memberFieldListLoading = false
                }
            },
            // 获取前置节点列表
            async getPreNodes () {
                try {
                    this.preNodeListLoading = true
                    const res = await this.$store.dispatch('setting/getPreNodes', this.nodeId)
                    this.roleList = res.data.filter(node => !['ROUTER-P', 'COVERAGE'].includes(node.type))
                } catch (e) {
                    console.error(e)
                } finally {
                    this.preNodeListLoading = false
                }
            },
            getProcessorList () {
                if (this.formData.type === 'ORGANIZATION') {
                    this.getOrganizations()
                } else {
                    this.getRoleList()
                }
            },
            // 按照英文逗号拆开字符串数据，给对应组件
            transProcessorsToComp (type, processors) {
                if (['ORGANIZATION', 'ASSIGN_LEADER'].includes(type)) {
                    return cloneDeep(processors)
                }
                return processors ? processors.split(',') : []
            },
            // 将对应组件返回的数组数据拼接为字符串
            transCompValToProcessors (type, processors) {
                if (['ORGANIZATION', 'ASSIGN_LEADER'].includes(type)) {
                    return processors
                }
                return processors.join(',')
            },
            handleSelectGroup (val) {
                this.formData = {
                    type: val,
                    processors: ['ORGANIZATION', 'ASSIGN_LEADER'].includes(val) ? '' : []
                }
                this.change()
                if (this.hideProcessorsForm) {
                    this.validate()
                }
            },
            // 选择人员
            handleSelectProcessor () {
                this.change()
                this.validate()
            },
            // 选择组织架构
            handleSelectOrgan (node) {
                this.formData.processors = node.id
                this.change()
                this.validate()
            },
            // 获取组织架构完整路径
            getOrganizationsPath (id, list) {
                let pathStr = ''
                list.some((item) => {
                    if (item.id === id) {
                        pathStr = item.name
                        return true
                    }
                    if (item.children && item.children.length > 0) {
                        const subPath = this.getOrganizationsPath(id, item.children)
                        if (subPath) {
                            pathStr = `${item.name}/${subPath}`
                            return true
                        }
                    }
                })
                return pathStr
            },
            validate () {
                let result = true
                if (!this.hideProcessorsForm) {
                    result = ['ORGANIZATION', 'ASSIGN_LEADER'].includes(this.formData.type)
                        ? this.formData.processors !== ''
                        : this.formData.processors.length > 0
                }
                this.errorTips = !result
                return result
            },
            change () {
                const { type, processors } = this.formData
                const data = {
                    type,
                    processors: this.transCompValToProcessors(type, processors)
                }
                this.validate()
                this.$emit('change', data)
            }
        }
    }
</script>
<style lang="postcss" scoped>
.form-container {
  &.half-row-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .type-form-item {
      flex: 1;
      margin-right: 8px;
    }
    .role-form-item {
      flex: 1;
      height: 32px;
    }
  }
  .org-selector-trigger {
    position: relative;
    padding: 0 36px 0 10px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    &.unselected {
      color: #c3cdd7;
    }
    .select-angle-icon {
      position: absolute;
      right: 2px;
      top: 4px;
      color: #979ba5;
      font-size: 22px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      &.open {
        transform: rotate(-180deg);
      }
    }
  }
}
/deep/ .bk-big-tree-node .node-content {
  font-size: 12px;
}
</style>
