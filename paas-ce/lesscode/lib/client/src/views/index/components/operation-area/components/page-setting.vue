<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div
        :class="['page-setting']"
        v-bkloading="{
            isLoading: pageLoading,
            opacity: 1
        }">
        <section
            v-for="setting in settingGroup"
            :key="setting.title">
            <div
                class="title"
                v-show="!pageLoading">
                {{ setting.title }}
            </div>
            <div class="setting-list" v-show="!pageLoading">
                <div
                    v-for="(field, index) in setting.settingFields"
                    class="setting-item"
                    :key="index">
                    <div class="field-label">
                        <span
                            v-bk-tooltips="{
                                content: field.desc,
                                disabled: !field.desc
                            }"
                            class="field-display-name">
                            {{field.name}}
                        </span>：
                    </div>
                    <div
                        :class="[
                            'field-value',
                            {
                                'is-loading': loadingState.includes(field)
                            }
                        ]">
                        <template v-if="field !== editField.field">
                            <div class="field-content">
                                <div
                                    class="route"
                                    v-if="field.id === 'pageRoute'">
                                    <div v-if="pageRoute.id">{{layoutPath}}<span>{{pageRoute.path}}</span></div>
                                    <div v-else class="unset">未设置</div>
                                </div>
                                <span
                                    v-else
                                    class="field-display-value">
                                    {{getFieldDisplayValue(field) || '--'}}
                                </span>
                                <i
                                    v-if="field.editable"
                                    class="bk-icon icon-edit2 field-edit"
                                    @click="handleEdit(field)" />
                            </div>
                        </template>
                        <template v-else-if="!loadingState.includes(field)">
                            <div class="field-form">
                                <component
                                    :is="getEditComponent(field)"
                                    :placeholder="getPlaceholder(field)"
                                    :field="field" :value.sync="editField.value"
                                    :errors="errors"
                                    :class="[`form-component ${field.type}`, { error: (errors[field.id] || []).length }]"
                                    v-model.trim="editField.value"
                                    v-on="getEvents(field)"
                                    v-bind="field.props"
                                    :ref="`component-${field.id}`"></component>
                                <div class="buttons">
                                    <bk-button text size="small" theme="primary"
                                        :disabled="disabled"
                                        @click="handleConfirm">确定</bk-button>
                                    <span class="divider">|</span>
                                    <bk-button text size="small" theme="primary" @click="handleCancel">取消</bk-button>
                                </div>
                            </div>
                            <span
                                v-if="(errors[field.id] || []).length"
                                class="form-error">
                                {{errors[field.id][0].message}}
                            </span>
                        </template>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { getCurUsedFuncs } from '@/components/methods/function-helper.js'
    import pageRouterSelect from '@/components/project/page-router-select'

    export default {
        components: {
            pageRouterSelect
        },
        props: {
            project: {
                type: Object,
                default: () => ({})
            }
        },
        data () {
            return {
                editField: {
                    field: null,
                    value: null
                },
                loadingState: [],
                errors: {},
                pageLoading: false
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            ...mapGetters('page', {
                page: 'pageDetail',
                pageRoute: 'pageRoute',
                layoutList: 'layoutList',
                routeGroup: 'routeGroup'
            }),
            ...mapGetters('functions', ['funcGroups']),
            disabled () {
                const { errors, editField, getFieldValue } = this
                return (errors[editField.field.id] || []).length > 0 || editField.value === getFieldValue(editField.field)
            },
            projectId () {
                return this.$route.params.projectId
            },
            layoutPath () {
                const path = this.pageRoute.layoutPath || ''
                return path.endsWith('/') ? path : `${path}/`
            },
            settingGroup () {
                const baseSettings = {
                    title: '基本配置',
                    settingFields: [
                        {
                            id: 'pageName',
                            name: '页面名称',
                            type: 'input',
                            editable: true,
                            props: {
                                maxlength: 60
                            },
                            rules: [
                                {
                                    required: true,
                                    message: '必填项'
                                }
                            ]
                        },
                        {
                            id: 'pageCode',
                            name: '页面ID',
                            type: 'input',
                            editable: false
                        }
                    ]
                }

                const routeSelect = Object.keys(this.routeGroup).map((group, groupIndex) => {
                    const routeList = this.routeGroup[group] || []
                    const children = routeList.map((route) => {
                        return {
                            id: route.id,
                            type: 'option',
                            props: {
                                id: route.id,
                                name: route.path || '/',
                                pageId: route.pageId,
                                disabled: route.pageId !== -1 || Boolean(route.redirect)
                            }
                        }
                    })
                    return {
                        id: groupIndex,
                        type: 'option-group',
                        props: {
                            name: group
                        },
                        children
                    }
                })
                const pageSettings = {
                    title: '路由配置',
                    settingFields: [
                        {
                            id: 'layoutId',
                            name: '布局模板',
                            type: 'select',
                            props: {
                                clearable: false
                            },
                            editable: true,
                            children: this.layoutList.map((layout) => {
                                return {
                                    id: layout.id,
                                    type: 'option',
                                    props: {
                                        id: layout.id,
                                        name: `${layout.defaultName}（路由：${layout.routePath}）`
                                    }
                                }
                            })
                        },
                        {
                            id: 'pageRoute',
                            name: '页面路由',
                            type: 'select',
                            editable: true,
                            placeholder: '未设置',
                            props: {
                                clearable: false
                            },
                            children: routeSelect
                        }
                    ]
                }

                return [baseSettings, pageSettings]
            }
        },
        methods: {
            ...mapMutations('drag', ['setCurTemplateData']),
            async fetchData () {
                try {
                    this.pageLoading = true
                    await this.$store.dispatch('page/getPageSetting', {
                        pageId: this.page.id,
                        projectId: this.projectId,
                        versionId: this.versionId
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.pageLoading = false
                }
            },
            handleEdit (field) {
                this.editField.field = field
                this.editField.value = this.getFieldValue(field)
                field.type === 'input' && this.$nextTick(() => {
                    const component = this.$refs[`component-${field.id}`]
                    component[0] && component[0].focus && component[0].focus()
                })
            },
            getEditComponent (field) {
                return field.type === 'input' ? 'bk-input' : 'pageRouterSelect'
            },
            handleCancel () {
                this.$delete(this.errors, this.editField.field.id)
                this.unsetEditField()
            },
            async handleConfirm () {
                const { field } = this.editField
                if (field.id === 'layoutId') {
                    this.$bkInfo({
                        title: '确认修改？',
                        subTitle: '当前使用的布局模板未保存的配置会丢失',
                        theme: 'primary',
                        confirmFn: async () => {
                            await this.handleConfirmSave()
                        }
                    })
                    return
                }

                this.handleConfirmSave()
            },
            async handleConfirmSave () {
                const { field, value } = this.editField
                this.loadingState.push(field)
                try {
                    if (field.id === 'pageRoute' || field.id === 'layoutId') {
                        await this.savePageRoute(field, value)
                        this.fetchData()
                        // 导航模板切换后需要获取当前模板的导航数据，并更新更新本地curTemplateData
                        await this.$store.dispatch('layout/getPageLayout', { pageId: this.page.id })
                    } else {
                        const pageData = await this.saveField(field, value)

                        this.$store.commit('page/updatePageDetail', pageData)
                        this.$store.commit('page/updatePageList', pageData)
                    }

                    this.unsetEditField()
                } catch (e) {
                    console.error(e)
                } finally {
                    this.loadingState = this.loadingState.filter(exist => exist !== field)
                }
            },
            async saveField (field, value) {
                if (field.id === 'pageName') {
                    await this.$store.dispatch('page/checkName', {
                        data: {
                            pageName: value,
                            currentName: this.page.pageName,
                            projectId: this.project.id,
                            versionId: this.versionId,
                            from: 'setting'
                        }
                    })
                }
                const fieldData = { [field.id]: value }
                // 获取当前页面使用中的函数
                const [usedFuncMap] = getCurUsedFuncs()
                // 调用更新方法
                const pageData = {
                    ...this.page,
                    ...fieldData
                }
                pageData.lifeCycle = JSON.stringify(pageData.lifeCycle)
                const res = await this.$store.dispatch('page/update', {
                    data: {
                        pageData,
                        projectId: this.project.id,
                        versionId: this.versionId,
                        functionData: Object.keys(usedFuncMap),
                        from: 'setting'
                    }
                })
                return res
            },
            async savePageRoute (field, value) {
                const data = {
                    pageRoute: {},
                    projectId: this.project.id,
                    versionId: this.versionId,
                    pageId: this.page.id
                }
                if (field.id === 'layoutId') {
                    const layout = this.layoutList.find(item => item.id === value)
                    data.pageRoute = {
                        layoutId: layout.id,
                        layoutPath: layout.routePath,
                        path: this.pageRoute.path
                    }
                } else if (field.id === 'pageRoute') {
                    const routeList = Object.values(this.routeGroup).reduce((pre, cur) => pre.concat(cur), [])
                    const route = routeList.find(item => item.id === value)
                    data.pageRoute = {
                        routeId: route.id,
                        layoutPath: this.pageRoute.layoutPath,
                        path: route.path
                    }
                }
                const res = await this.$store.dispatch('route/updatePageRoute', { data })
                return res
            },
            getFieldDisplayValue (field) {
                if (field.id === 'layoutId') {
                    const { layoutId } = this.pageRoute
                    const layout = this.layoutList.find(item => item.id === layoutId) || {}
                    const layoutName = layout.defaultName || ''
                    const layoutRoutePath = layout.routePath || ''
                    return `${layoutName}（路由：${layoutRoutePath}）`
                }
                return this.page[field.id]
            },
            getFieldValue (field) {
                if (field.id === 'pageRoute') {
                    return this.pageRoute.id || ''
                } else if (field.id === 'layoutId') {
                    return this.pageRoute.layoutId
                }
                return this.page[field.id]
            },
            getPlaceholder (field) {
                if (field.placeholder) {
                    return field.placeholder
                }
                return ['input'].includes(field.type) ? '请输入' : '请选择'
            },
            getEvents (field) {
                const events = {
                    'goPage': (value) => {
                        this.goToPage(value, true)
                    }
                }
                if (field.type === 'input') {
                    events['input'] = (value) => {
                        this.validate(field, value)
                    }
                    events['enter'] = (value) => {
                        if (!this.disabled) {
                            this.handleConfirm()
                        }
                    }
                }
                return events
            },
            validate (field, value) {
                const { rules, id } = field
                rules.forEach(async rule => {
                    if (!await this.checkRule(rule, value)) {
                        let errRules = this.errors[id]
                        if (errRules && errRules.findIndex(r => r === rule) === -1) {
                            errRules.push(rule)
                        } else {
                            errRules = [rule]
                        }
                        this.$set(this.errors, id, errRules)
                    } else {
                        const errRules = (this.errors[id] || []).filter(r => r !== rule)
                        this.$set(this.errors, id, errRules)
                    }
                })
            },
            async checkRule (rule, value) {
                // 如果必填，并且内容为空
                if (rule.required && !value) {
                    return false
                }

                // 如果配置正则，优先用正则匹配
                if (rule.regex && !rule.regex.test(value)) {
                    return false
                }

                // 通过自定义方法来检测
                if (rule.validator && (typeof rule.validator === 'function')) {
                    const result = await rule.validator(value)
                    return result
                }

                return true
            },
            unsetEditField () {
                this.editField = this.$options.data().editField
            },
            goToPage (name, newTab) {
                const route = this.$router.resolve({
                    name,
                    params: {
                        projectId: this.projectId
                    }
                })
                if (newTab) {
                    window.open(route.href, '_blank')
                } else {
                    this.$router.push(route.location)
                }
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .page-setting {
        padding: 5px 40px 30px;
        height: 100%;

        .title {
            font-size: 14px;
            font-weight: 700;
            color: #63656E;
            padding: 20px 0 12px;
        }

        .setting-list {
            padding-left: 24px;

            .setting-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 10px;
                line-height: 32px;

                .field-label {
                    flex: none;
                    width: 110px;
                    margin-right: 4px;
                    font-size: 12px;
                    color: #63656E;
                }
                .field-value {
                    position: relative;
                    flex: none;
                    width: 410px;

                    .field-content {
                        display: flex;
                        font-size: 12px;

                        .route {
                            .unset {
                                color: #FF9C01;
                            }
                        }
                    }
                    .field-display-value {
                        word-break: break-all;
                    }

                    &.is-loading {
                        font-size: 0;
                        .field-content {
                            display: none;
                        }
                        &:before {
                            content: "";
                            display: inline-block;
                            position: absolute;
                            width: 16px;
                            height: 16px;
                            top: 8px;
                            background-image: url("../../../../../images/svg/loading.svg");
                        }
                    }

                    .form-error {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        font-size: 12px;
                        color: #ff5656;
                        line-height: 18px;
                        margin: 2px 0px 0px;
                    }
                }

                .field-edit {
                    position: relative;
                    font-size: 22px;
                    top: 5px;
                    cursor: pointer;
                    &:hover {
                        color: #3A84FF;
                    }
                }
            }
        }

        .field-form {
            display: flex;
            align-items: center;
            .form-component {
                width: 100%;
            }
            .buttons {
                display: flex;
                align-items: center;
                margin-left: 4px;

                .bk-button-text {
                    width: 36px;
                    padding: 0 6px;
                }
                .divider {
                    color: #979BA5;
                    line-height: 26px;
                    margin-top: -2px;
                }
            }
        }

        &.function {
            .field-form {
                align-items: flex-start;
            }
            .field-display-name {
                cursor: pointer;
                border-bottom: 1px dashed #999;
            }
        }
    }
    .bk-option-name {
        .bound {
            color: #c4c6cc;
        }
    }
</style>
