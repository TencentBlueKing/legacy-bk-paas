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
                            <template v-if="field.type === 'distance'">
                                <div class="distance-tag">
                                    <bk-tag v-for="distance in styleValue[field.id]" :key="distance.key">
                                        <span class="distance-key">{{`${distance.key}: `}}</span>
                                        <span :class="{ 'distance-value': distance.value !== '--' }">{{distance.value}}</span>
                                    </bk-tag>
                                    <i v-if="field.editable" class="bk-icon icon-edit2 field-edit" @click="handleEdit(field)"></i>
                                </div>
                            </template>
                            <template v-else-if="field.type === 'background'">
                                <div class="style-background">
                                    <span v-if="page.styleSetting.backgroundColor" class="color-icon"
                                        :style="{
                                            backgroundColor: page.styleSetting.backgroundColor
                                        }">
                                    </span>
                                    <span class="color-value">{{ page.styleSetting.backgroundColor || '--' }}</span>
                                    <i v-if="field.editable" class="bk-icon icon-edit2 field-edit" @click="handleEdit(field)"></i>
                                </div>
                            </template>
                            <template v-else-if="field.type === 'custom'">
                                <div class="style-custom">
                                    <span class="custom-status">{{styleValue.hasCustomStyle ? '已配置' : '--'}}</span>
                                    <component
                                        class="style-setting"
                                        :is="field.id"
                                        :key="field.id"
                                        :is-page-setting="true"
                                        :component-id="'pageStyleSetting'"
                                        :value="page.styleSetting"
                                        :change="changeStyle" />
                                </div>
                            </template>
                            <div v-else class="field-content">
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
                                    v-if="field.from === 'style'"
                                    :is="field.id"
                                    :key="field.id"
                                    class="style-setting"
                                    :value="page.styleSetting"
                                    :change="changeStyle" />
                                <component
                                    v-else
                                    :is="getEditComponent(field)"
                                    :placeholder="getPlaceholder(field)"
                                    :field="field"
                                    :value.sync="editField.value"
                                    :errors="errors"
                                    :class="[`form-component ${field.type}`, { error: (errors[field.id] || []).length }, 'style-setting']"
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
    import LC from '@/element-materials/core'
    import pageRouterSelect from '@/components/project/page-router-select'
    import StylePadding from '@/element-materials/modifier/component/styles/strategy/padding'
    import StyleMargin from '@/element-materials/modifier/component/styles/strategy/margin'
    import StyleCustom from '@/element-materials/modifier/component/styles/strategy/custom-style'
    import StyleBackgroundColor from './common/background-color'
    import StyleMinWidth from './common/min-width'

    const styleSettingMap = {
        marginTop: 'Top',
        marginRight: 'Right',
        marginBottom: 'Bottom',
        marginLeft: 'Left',
        paddingTop: 'Top',
        paddingRight: 'Right',
        paddingBottom: 'Bottom',
        paddingLeft: 'Left'
    }
    const components = {
        pageRouterSelect,
        StyleCustom,
        minWidth: StyleMinWidth,
        padding: StylePadding,
        margin: StyleMargin,
        backgroundColor: StyleBackgroundColor
    }

    export default {
        components: components,
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
                pageLoading: false,
                styleData: {}
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            ...mapGetters('page', {
                platform: 'platform',
                page: 'pageDetail',
                pageRoute: 'pageRoute',
                layoutList: 'layoutList',
                routeGroup: 'routeGroup',
                styleSetting: 'styleSetting'
            }),
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
                            children: this.layoutList.filter(item => item.layoutType === this.platform).map((layout) => {
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
                const styleSettings = {
                    title: '页面样式设置',
                    settingFields: [
                        {
                            id: 'minWidth',
                            name: '最小宽度',
                            type: 'size',
                            from: 'style',
                            editable: true
                        },
                        {
                            id: 'margin',
                            name: '外边距',
                            type: 'distance',
                            from: 'style',
                            editable: true
                        },
                        {
                            id: 'padding',
                            name: '内边距',
                            type: 'distance',
                            from: 'style',
                            editable: true
                        },
                        {
                            id: 'backgroundColor',
                            name: '背景色',
                            from: 'style',
                            type: 'background',
                            editable: true
                        }
                        // {
                        //     id: 'StyleCustom',
                        //     name: '自定义样式',
                        //     from: 'style',
                        //     type: 'custom'
                        // }
                    ]
                }

                return [baseSettings, pageSettings, styleSettings]
            },
            styleValue () {
                const style = this.page.styleSetting
                const margin = []
                const padding = []
                for (const i in style) {
                    if (i.startsWith('margin') && i !== 'margin') {
                        margin.push({ key: styleSettingMap[i], value: style[i] ? style[i] : '--' })
                    } else if (i.startsWith('padding') && i !== 'padding') {
                        padding.push({ key: styleSettingMap[i], value: style[i] ? style[i] : '--' })
                    }
                }
                return {
                    minWidth: this.page.styleSetting.minWidth,
                    margin: margin,
                    padding: padding,
                    backgroundColor: this.page.styleSetting.backgroundColor,
                    hasCustomStyle: Object.keys(this.page.styleSetting.customStyle || {}).length !== 0
                }
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
                if (field.from === 'style') {
                    this.styleData = JSON.parse(JSON.stringify(this.page.styleSetting))
                } else {
                    field.type === 'input' && this.$nextTick(() => {
                        const component = this.$refs[`component-${field.id}`]
                        component[0] && component[0].focus && component[0].focus()
                    })
                }
            },
            getEditComponent (field) {
                if (field.from && field.from === 'style') {
                    return field.id
                }
                return field.type === 'input' ? 'bk-input' : 'pageRouterSelect'
            },
            handleCancel () {
                if (this.editField.field.from === 'style') this.page.styleSetting = JSON.parse(JSON.stringify(this.styleData))
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
                        await Promise.all([
                            this.fetchData(),
                            // 导航模板切换后需要获取当前模板的导航数据，并更新更新本地curTemplateData
                            this.$store.dispatch('layout/getPageLayout', { pageId: this.page.id }),
                            this.$store.dispatch('route/getProjectPageRoute', {
                                projectId: this.projectId,
                                versionId: this.versionId
                            })
                        ])
                    } else {
                        let pageData = {}
                        if (field.from === 'style') {
                            pageData = await this.saveStyle()
                        } else {
                            pageData = await this.saveField(field, value)
                        }
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
                            projectId: this.projectId,
                            versionId: this.versionId,
                            from: 'setting'
                        }
                    })
                }
                const fieldData = { [field.id]: value }
                // 调用更新方法
                const pageData = {
                    id: this.page.id,
                    ...fieldData
                }
                const res = await this.$store.dispatch('page/update', {
                    data: {
                        pageData,
                        projectId: this.project.id,
                        versionId: this.versionId,
                        from: 'setting'
                    }
                })
                return res
            },
            async changeStyle (key, value) {
                if (value) {
                    this.page.styleSetting[key] = value
                } else {
                    this.page.styleSetting[key] = ''
                }
                if (key === 'customStyle') {
                    await this.saveStyle()
                }
            },
            async saveStyle () {
                const pageData = {
                    id: this.page.id
                }
                pageData.styleSetting = JSON.stringify(this.page.styleSetting)
                const res = await this.$store.dispatch('page/update', {
                    data: {
                        pageData,
                        projectId: this.project.id,
                        versionId: this.versionId,
                        from: 'setting'
                    }
                })
                LC.pageStyle = res.styleSetting
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
                if (field.id in this.styleValue) {
                    return this.styleValue[field.id]
                }
                return this.page[field.id]
            },
            getFieldValue (field) {
                if (field.id === 'pageRoute') {
                    return this.pageRoute.id || ''
                } else if (field.id === 'layoutId') {
                    return this.pageRoute.layoutId
                } else if (field.id in this.styleValue) {
                    return this.styleValue[field.id]
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
        overflow: auto;
        /* border: 1px solid #DCDEE5; */

        .title {
            font-size: 14px;
            font-weight: 700;
            color: #63656E;
            padding: 20px 0 12px;
        }

        /deep/ .style-setting {
            margin-left: 0;
            padding: 0 0;
            .style-title{
                display: none;
              }
            .style-item{
                margin-top: 0;
              }
            .item-label{
                display: none;
              }
            .margin-style-col-container :nth-child(1){
                margin-top: 0;
              }
            .modifier-style {
                margin-left: 0;
                padding: 0 0;
              }
            .item-content div {
                text-align: left !important;
              }
            .common-input-slot-text {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 100%;
                font-size: 14px;
                line-height: 20px;
                background: #fafbfd;
            }
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

                                        .distance-tag{
                        margin-left: -5px;

                        .distance-value {
                            font-family: Helvetica, Arial, sans-serif;
                            font-weight: 700;
                        }
                    }

                    .style-background {
                        display: flex;
                        align-items: center;

                        .color-icon {
                            width: 14px;
                            height: 14px;
                            border: 1px solid #f0f1f5;
                            margin-right: 10px;
                        }

                        i{
                            margin-top: -10px;
                        }
                    }

                    .style-custom{
                        display: flex;
                        align-items: center;

                        .custom-status {
                            margin-right: 20px;
                        }
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
