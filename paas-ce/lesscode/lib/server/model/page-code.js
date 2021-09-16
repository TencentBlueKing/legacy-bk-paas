/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
import { paramCase, camelCase, camelCaseTransformMerge } from 'change-case'

import { uuid, replaceFuncKeyword } from '../util'
import VueCodeModel from './vue-code'
import { RequestContext } from '../middleware/request-context'
import slotRenderConfig from '../../client/src/element-materials/modifier/component/slots/render-config'
import safeStringify from '../../client/src/common/json-safe-stringify'

const httpConf = require('../conf/http')
// npm.js配置文件不存在时赋值空对象
let npmConf
try {
    npmConf = require('../conf/npm')
} catch (_) {
    npmConf = {}
}

function transformToString (val) {
    const type = typeof val
    let res
    switch (type) {
        case 'object':
            res = safeStringify(val)
            break
        case 'string':
            res = `'${val}'`
            break
        default:
            res = val
            break
    }
    return res
}

class PageCode {
    targetData = []
    /**
     * 1. vueCode: 单页面代码
     * 2. preview: 预览代码
     * 3. projectCode: 生成整个项目代码
     */
    pageType = ''
    allCustomMap = {}
    funcGroups = []
    code = ''
    scriptStr = ''
    cssStr = ''
    dataStr = ''
    remoteDataStr = ''
    lifeCircleStr = ''
    existFunc = []
    // slotTagMap = {
    //     'bk-table': 'bk-table-column',
    //     'bk-select': 'bk-option',
    //     'bk-checkbox-group': 'bk-checkbox',
    //     'bk-radio-group': 'bk-radio',
    //     'bk-tab': 'bk-tab-panel',
    //     'bk-breadcrumb': 'bk-breadcrumb-item',
    //     'search-table': 'bk-table-column',
    //     'folding-table': 'bk-table-column',
    //     'el-select': 'el-option',
    //     'el-radio-group': 'el-radio',
    //     'el-checkbox-group': 'el-checkbox',
    //     'el-table': 'el-table-column',
    //     'el-tabs': 'el-tab-pane',
    //     'el-breadcrumb': 'el-breadcrumb-item',
    //     'el-steps': 'el-step',
    //     'el-timeline': 'el-timeline-item',
    //     'el-carousel': 'el-carousel-item'
    // }
    // slotContentArray = [
    //     'bk-checkbox',
    //     'bk-radio',
    //     'bk-breadcrumb-item',
    //     'el-breadcrumb-item',
    //     'el-timeline-item'
    // ]
    chartTypeArr = [] // echarts 相关，要引入echarts依赖
    useBkCharts = false // 是否使用bkcharts标志位
    usingCustomArr = []
    usingFuncCodes = []
    usingVariables = []
    projectVariables = []
    pageDataVariables = []
    pageComputedVariables = []
    methodStrList = [] // 使用到的函数字符串列表
    codeErrMessage = '' // 记录函数里的错误信息
    selfClosingTags = ['img', 'input', 'link', 'hr', 'br']
    lifeCycle = {} // 页面的生命周期
    projectId = ''
    pageId = ''
    layoutContent = ''
    hasLayOut = false
    isGenerateNav = false
    layoutType = ''
    isUseElementComponentLib = false

    constructor (targetData = [], pageType = 'vueCode', allCustomMap = {}, funcGroups = [], lifeCycle = '', projectId, pageId, layoutContent, isGenerateNav = false, isEmpty = false, layoutType, variableList) {
        this.targetData = targetData || []
        this.pageType = pageType
        this.allCustomMap = allCustomMap || {}
        this.funcGroups = funcGroups || []
        this.uniqueKey = uuid()
        this.lifeCycle = lifeCycle || {}
        this.projectId = projectId
        this.pageId = pageId
        this.layoutContent = layoutContent || {}
        this.hasLayOut = layoutContent && ((layoutContent.menuList && layoutContent.menuList.length) || (layoutContent.topMenuList && layoutContent.topMenuList.length))
        this.isGenerateNav = isGenerateNav
        this.isEmpty = isEmpty
        this.layoutType = layoutType
        this.variableList = variableList || []
    }

    getCode () {
        return this.generateTemplate() + this.generateScript() + this.generateCss()
    }

    handleVariable () {
        this.projectVariables = this.usingVariables.filter((variable) => (this.pageType !== 'vueCode' && variable.effectiveRange === 0))
        const pageVariables = this.usingVariables.filter((variable) => (this.pageType === 'vueCode' || variable.effectiveRange === 1))
        this.pageDataVariables = pageVariables.filter((variable) => (variable.variableType !== 1))
        this.pageComputedVariables = pageVariables.filter((variable) => (variable.variableType === 1))
        this.pageDataVariables.forEach((variable) => {
            const { defaultValue = {}, variableCode, defaultValueType } = variable
            if ([3, 4].includes(variable.valueType)) {
                ['all', 'prod', 'stag'].forEach((key) => {
                    const val = defaultValue[key]
                    if (typeof val === 'string') {
                        defaultValue[key] = JSON.parse(val)
                    }
                })
            }
            this.dataTemplate(variableCode, `getInitVariableValue(${JSON.stringify(defaultValue)}, ${defaultValueType})`)
        })
    }

    getValueType (val) {
        const Fn = Function
        let type = 'undefined'
        // 用户输入的不符合规范的json，按照字符串处理
        try {
            type = new Fn(`return typeof ${val}`)()
        } catch (error) {
        }
        return type
    }

    getValue (val) {
        let value = val
        const type = this.getValueType(val)
        switch (type) {
            case 'undefined':
                value = `'${val}'`
                if (val === 'undefined') value = 'undefined'
                break
        }
        if (/[^\.\=><]+[\.\=><\']+[^\.\=><\']+/.test(val)) value = val
        return value
    }

    getMethodByCode (methodCode) {
        let params = []

        if (typeof methodCode === 'object') {
            params = (methodCode.params || []).filter(param => param.value).map(param => this.getValue(param.value))
            methodCode = methodCode.methodCode
        }
        let res
        this.funcGroups.forEach((group) => {
            const funChildren = group.functionList || []
            const method = funChildren.find(x => x.funcCode === methodCode)
            if (method) res = method
        })
        return [res || {}, params]
    }

    generateComponment (item, vueDirective, propDirective) {
        item = Object.assign({}, item, { componentId: camelCase(item.componentId, { transform: camelCaseTransformMerge }) })
        const inFreeLayout = item.renderProps && item.renderProps.inFreeLayout && item.renderProps.inFreeLayout.val
        let css = ''
        if (inFreeLayout) {
            css += 'position: absolute;'
            if (item.renderStyles.top) {
                css += ` top: ${item.renderStyles.top};`
            }
            if (item.renderStyles.left) {
                css += ` left: ${item.renderStyles.left};`
            }
        }
        if (item.name.startsWith('chart-')) {
            this.generateCharts(item)
            const widthStr = item.renderProps.width && item.renderProps.width.val ? `width: ${item.renderProps.width.val}px;` : ''
            const heightStr = `height:${item.renderProps.height.val || 0}px;`
            const displayStr = item.renderStyles.display ? `display: ${item.renderStyles.display};vertical-align: middle;` : ''

            let componentCode = ''
            if (inFreeLayout) {
                componentCode = `
                    <div style="${css}" ${vueDirective}>
                        <div style="${widthStr}${heightStr}${displayStr}">
                            <chart :options="${item.componentId}" ${propDirective} autoresize></chart>
                        </div>
                    </div>`
            } else {
                componentCode = `
                    <div style="${widthStr}${heightStr}${displayStr}" ${vueDirective}>
                        <chart :options="${item.componentId}" ${propDirective} autoresize></chart>
                    </div>`
            }
            return componentCode
        } else if (item.type === 'widget-form') {
            let componentCode = ''
            const { itemClass = '' } = this.getItemStyles(item.componentId, item.renderStyles, item.renderProps)
            const itemProps = this.getItemProps(item.type, item.renderProps, item.componentId, item.renderDirectives, item.renderSlots)
            componentCode = `
                    <div ${itemClass} style="${css}">
                        <bk-form ${vueDirective} ${propDirective} ${itemProps}>
                            ${this.generateCode(item.renderSlots.default.val)}
                        </bk-form>
                    </div>
                 `
            return componentCode
        } else {
            // 使用了 element 组件库
            if (item.name.startsWith('el-')) {
                this.isUseElementComponentLib = true
            }
            // 使用了bkcharts
            if (item.name.startsWith('bk-charts')) {
                this.useBkCharts = true
            }
            // item.componentId = item.componentId.replace('_', '')
            // 记录是否为自定义组件
            if (this.allCustomMap && this.allCustomMap[item.type] && this.usingCustomArr.indexOf(item.type) === -1) {
                const prefix = process.env.BKPAAS_ENVIRONMENT === 'prod' ? '' : 'test-'
                const type = prefix + item.type
                if (this.usingCustomArr.indexOf(type) < 0) {
                    this.usingCustomArr.push(type)
                }
            }

            // icon 组件，样式中设置字体大小不生效，是因为 bk-icon 组件通过 size 属性来设置 font-size，默认值为 inherit
            if (item.type === 'bk-icon') {
                item.renderProps['size'] = {
                    type: 'string',
                    val: item.renderStyles.fontSize
                }
            }

            const itemProps = this.getItemProps(item.type, item.renderProps, item.componentId, item.renderDirectives, item.renderSlots)
            const { itemStyles = '', itemClass = '' } = this.getItemStyles(item.componentId, item.renderStyles, item.renderProps)
            const itemEvents = this.getItemEvents(item.renderEvents)
            let componentCode = ''
            if (inFreeLayout) {
                if (item.renderStyles.width) {
                    css += ` width: ${item.renderStyles.width};`
                } else {
                    // 自由布局中的表格，如果不设置宽度，那么宽度会一直增大，表格组件本身的缺陷
                    if (item.type === 'bk-table' || item.type === 'el-table') {
                        let width = 0
                        const colConf = item.renderSlots.default.val || []
                        colConf.forEach(col => {
                            if (col.width === null || col.width === undefined || col.width === '') {
                                width = parseFloat(width) + 80
                            } else {
                                // remote 中，如果返回的 col 配置中的 width 是非数字字符串的话，那么就会是 NaN
                                width = parseFloat(width) + (isNaN(col.width) ? 80 : parseFloat(col.width))
                            }
                        })
                        css += ` width: ${width}px;`
                    }
                }

                if (this.selfClosingTags.includes(item.type)) {
                    componentCode += `
                        <div style="${css}" ${vueDirective}>
                            <${item.type} ${itemProps} ${itemStyles} ${itemClass} ${itemEvents} ${propDirective} />
                        </div>`
                } else {
                    /** 段落组件对返回的html格式有要求，因此去掉换行和空格，此处模板不可以随意添加换行和空格 */
                    const slotStr = this.renderSlot(item.type, item.renderSlots, item.componentId)
                    if (item.type === 'p') {
                        // premitter 格式化代码，但是格式化代码带来的问题是，会把 p 标签内部的 inntertext 也做换行，这就导致最终 p 标签效果和预期效果不一致
                        // eslint-disable 要在 prettier-ignore 前面
                        componentCode += `
                            <div style="${css}" ${vueDirective}>
                                <!-- eslint-disable -->
                                <!-- prettier-ignore -->
                                <${item.type} ${itemProps} ${itemStyles} ${itemClass} ${itemEvents} ${propDirective}
                                    >${slotStr}
                                </${item.type}>
                                <!-- eslint-enable -->
                            </div>`
                    } else {
                        componentCode += `
                            <div style="${css}" ${vueDirective}>
                                <${item.type} ${itemProps} ${itemStyles} ${itemClass} ${itemEvents} ${propDirective}>${slotStr}</${item.type}>
                            </div>`
                    }
                }
            } else {
                if (this.selfClosingTags.includes(item.type)) {
                    componentCode += `
                        <${item.type} ${itemProps} ${itemStyles} ${itemClass} ${itemEvents} ${vueDirective} ${propDirective} />`
                } else {
                    /** 段落组件对返回的html格式有要求，因此去掉换行和空格，此处模板不可以随意添加换行和空格 */
                    const slotStr = this.renderSlot(item.type, item.renderSlots, item.componentId)
                    if (item.type === 'p') {
                        // premitter 格式化代码，但是格式化代码带来的问题是，会把 p 标签内部的 inntertext 也做换行，这就导致最终 p 标签效果和预期效果不一致
                        // eslint-disable 要在 prettier-ignore 前面
                        componentCode += `
                            <!-- eslint-disable -->
                            <!-- prettier-ignore -->
                            <${item.type} ${itemProps} ${itemStyles} ${itemClass} ${itemEvents} ${vueDirective} ${propDirective}
                                >${slotStr}
                            </${item.type}>
                            <!-- eslint-enable -->`
                    } else {
                        componentCode += `
                            <${item.type} ${itemProps} ${itemStyles} ${itemClass} ${itemEvents} ${vueDirective} ${propDirective}
                                >${slotStr}
                            </${item.type}>`
                    }
                }
            }
            return componentCode
        }
    }

    generateCss () {
        let head = `<style lang="css" scoped>
            .container-${this.uniqueKey} {
                margin: ${this.hasLayOut ? '0' : '10'}px;
            }
            .bk-layout-row-${this.uniqueKey} {
                display: flex;
            }
            .bk-layout-row-${this.uniqueKey}:after {
                display: block;
                clear: both;
                content: "";
                font-size: 0;
                height: 0;
                visibility: hidden;
            }
            .bk-layout-col-${this.uniqueKey} {
                float: left;
                position: relative;
                min-height: 1px;
            }
            .bk-free-layout-${this.uniqueKey} {
                height: 500px;
                width: 100%;
                display: inline-block;
                position: relative;
                z-index: 10;
            }
            .bk-free-layout-item-inner-${this.uniqueKey} {
                height: 100%;
                position: relative;
            }
            .bk-form-radio {
                margin-right: 20px;
            }
            .bk-form-checkbox {
                margin-right: 20px;
            }
            .echarts {
                width: 100%;
                height: 100%;
            }
            /* 设置 bk-exception 组件宽度为 100% */
            .bk-layout-col-${this.uniqueKey} .bk-exception-img {
                width: 100%;
            }
            /* 每个组件之间默认外边距 5px */
            .bk-layout-component-${this.uniqueKey} {
                margin: 5px;
                vertical-align: middle;
            }
            .bk-form-item {
                margin: 10px;
            }
            .bk-sideslider {
                margin: 0;
            }
            /* 设置 .bk-form-control 组件宽度为 auto */
            .bk-form-control {
                width: auto;
            }
            .bk-form-control .bk-input-text {
                font-size: 12px;
            }
        `
        if (this.isEmpty) {
            head += `.bk-exception {
                    margin-top:50px;
                }
            `
        }
        if (this.hasLayOut) {
            head += `
                .bk-navigation {
                    width:auto;
                    height:100vh;
                    outline:1px solid #ebebeb;
                }
                .bk-navigation .bk-navigation-wrapper {
                    height:calc(100vh - 252px)!important;
                }
                .navigation-header {
                    -webkit-box-flex:1;
                    -ms-flex:1;
                    flex:1;
                    height:100%;
                    display:-webkit-box;
                    display:-ms-flexbox;
                    display:flex;
                    -webkit-box-align:center;
                    -ms-flex-align:center;
                    align-items:center;
                    font-size:14px;
                }
                .navigation-header .header-nav {
                    display:-webkit-box;
                    display:-ms-flexbox;
                    display:flex;
                    padding:0;
                    margin:0;
                }
                .navigation-header .header-title {
                    font-size:16px;
                }
                .navigation-header .header-nav-item {
                    list-style:none;
                    height:50px;
                    display:-webkit-box;
                    display:-ms-flexbox;
                    display:flex;
                    -webkit-box-align:center;
                    -ms-flex-align:center;
                    align-items:center;
                    margin-right:40px;
                    color:#96A2B9;
                    min-width:56px
                }
                .navigation-header .header-nav-item:hover {
                    cursor:pointer;
                    color:#D3D9E4;
                }
                .navigation-header .header-nav-item.item-active {
                    color:#FFFFFF !important;
                }
                .navigation-head-nav {
                    width:150px;
                    display:-webkit-box;
                    display:-ms-flexbox;
                    display:flex;
                    -webkit-box-orient:vertical;
                    -webkit-box-direction:normal;
                    -ms-flex-direction:column;
                    flex-direction:column;
                    background:#FFFFFF;
                    border:1px solid #E2E2E2;
                    -webkit-box-shadow:0px 3px 4px 0px rgba(64,112,203,0.06);
                    box-shadow:0px 3px 4px 0px rgba(64,112,203,0.06);
                    padding:6px 0;
                    margin:0;
                    color:#63656E;
                }
                .navigation-head-nav .nav-item {
                    -webkit-box-flex:0;
                    -ms-flex:0 0 32px;
                    flex:0 0 32px;
                    display:-webkit-box;
                    display:-ms-flexbox;
                    display:flex;
                    -webkit-box-align:center;
                    -ms-flex-align:center;
                    align-items:center;
                    padding:0 20px;
                    list-style:none
                }
                .navigation-head-nav .nav-item:hover {
                    color:#3A84FF;
                    cursor:pointer;
                    background-color:#F0F1F5;
                }
                .tippy-popper .tippy-tooltip.navigation-message-theme {
                    padding:0;
                    border-radius:0;
                    -webkit-box-shadow:none;
                    box-shadow:none;
                }
                .nav-sign-out {
                    display: inline-block;
                    cursor: pointer;
                    background: #FFFFFF;
                    border: 1px solid #E2E2E2;
                    box-shadow: 0px 3px 4px 0px rgb(64 112 203 / 6%);
                    padding: 0 25px;
                    line-height: 30px;
                }
                .nav-sign-out:hover {
                    color:#3A84FF;
                    background-color:#F0F1F5;
                }
                .header-user {
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:#96A2B9;
                }
                .header-user:hover {
                    color:#D3D9E4;
                }
                .header-user .bk-icon {
                    margin-left:5px;
                    font-size:12px;
                }
                .white-theme .header-user {
                    color: #63656e;
                }
                .white-theme .header-user:hover {
                    color: #3a84ff;
                }
                .nav-head-right {
                    color: #d3d9e4;
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
            `
        }
        if (this.isGenerateNav) {
            head += `.bk-layout-custom-component-wrapper .page-container {
                    margin: 0px
                }
            `
        }
        const end = '</style>\n'

        return head + this.cssStr + end
    }

    generateTemplate () {
        let pageCode = this.isGenerateNav ? '<router-view class="page-container"></router-view>' : `\n<section class="bk-layout-custom-component-wrapper container-${this.uniqueKey}">\n${this.generateCode(this.targetData)}\n</section>\n`
        if (this.isEmpty) pageCode = `<bk-exception class="exception-wrap-item" type="404"></bk-exception>`
        let source = pageCode
        if (this.hasLayOut) source = this.getLayout(pageCode)
        // bk-layout-custom-component-wrapper 打包自定义组件时添加此类作为最上层父类，避免自定义组件的类污染画布页面的东西
        // 预览时最顶层容器也要加上此类，让自定义组件的样式生效
        return `<template>\n` + source + '\n</template>'
    }

    getLayout (navContent) {
        const { layoutContent } = this
        const hasTopMenu = layoutContent.topMenuList && layoutContent.topMenuList.length
        const hasLeftMenu = layoutContent.menuList && layoutContent.menuList.length
        if (!hasLeftMenu && !hasTopMenu) return navContent

        this.dataTemplate('curNav', '{}')
        if (['preview'].includes(this.pageType)) {
            const user = JSON.stringify(RequestContext.getCurrentUser())
            this.dataTemplate('user', user)
        }

        const renderProps = layoutContent.renderProps || {}
        const propArray = []
        for (const prop in renderProps) {
            const value = renderProps[prop]
            const isString = typeof value === 'string'
            const perStr = isString ? '' : ':'
            propArray.push(`${perStr}${prop}="${value}"`)
        }
        const componentProps = propArray.join(' ')
        switch (this.layoutType) {
            case 'top-bottom':
                return this.getTopBottomLayout(navContent, componentProps)
            case 'left-right':
                return this.getLeftRightLayout(navContent, componentProps)
            case 'complex':
                return this.getComplexLayout(navContent, componentProps)
        }
    }

    getTopBottomLayout (navContent, componentProps) {
        const topMenuKey = `topMenu${this.uniqueKey}`
        const { layoutContent } = this
        this.dataTemplate(topMenuKey, JSON.stringify(layoutContent.topMenuList))

        return `
            <bk-navigation ${componentProps} navigation-type="top-bottom" :need-menu="false" class="bk-layout-custom-component-wrapper">
                <template slot="side-header">
                    <span class="title-icon">
                        <img src="${layoutContent.logo}" style="width: 28px; height: 28px;">
                    </span>
                    <span class="title-desc">${layoutContent.siteName}</span>
                </template>
                <div class="navigation-header" slot="header">
                    <ol class="header-nav">
                        <bk-popover v-for="item in  ${topMenuKey}" :disabled="!item.children || item.children.length <= 0" :key="item.id" theme="light navigation-message" :arrow="false" offset="0, -5" placement="bottom" :tippy-options="{ flipBehavior: ['bottom'], appendTo: 'parent' }">
                            <li class="header-nav-item" :class="{ 'item-active': item.id === curNav.id }" @click="goToPage(item)">
                                {{item.name}}
                            </li>
                            <template slot="content">
                                <ul class="navigation-head-nav">
                                    <li class="nav-item" v-for="headerNavItem in item.children" :key="headerNavItem.id" @click="goToPage(headerNavItem)">
                                        {{headerNavItem.name}}
                                    </li>
                                </ul>
                            </template>
                        </bk-popover>
                    </ol>
                    <bk-popover class="nav-head-right" theme="light navigation-message" :arrow="false" offset="-10, 0" placement="bottom-start" :tippy-options="{ 'hideOnClick': false, appendTo: 'parent' }">
                        <div class="header-user">
                            <span>{{ user.username }}</span>
                            <i class="bk-icon icon-down-shape"></i>
                        </div>
                        <template slot="content">
                            <span @click="signOut" class="nav-sign-out">退出</span>
                        </template>
                    </bk-popover>
                </div>
                ${navContent}
            </bk-navigation>
        `
    }

    getLeftRightLayout (navContent, componentProps) {
        const leftMenuKey = `leftMenu${this.uniqueKey}`
        const { layoutContent } = this

        this.dataTemplate(leftMenuKey, JSON.stringify(layoutContent.menuList))
        this.dataTemplate('toggleActive', 'false')

        return `
            <bk-navigation ${componentProps} navigation-type="left-right" need-menu class="bk-layout-custom-component-wrapper" @toggle="v => toggleActive=v">
                <template slot="side-header">
                    <span class="title-icon">
                        <img src="${layoutContent.logo}" style="width: 28px; height: 28px;">
                    </span>
                    <span class="title-desc">${layoutContent.siteName}</span>
                </template>
                <div class="navigation-header" slot="header">
                    <div class="header-title">
                        {{curNav.name}}
                    </div>
                    <bk-popover class="nav-head-right white-theme" theme="light navigation-message" :arrow="false" offset="-10, 0" placement="bottom-start" :tippy-options="{ 'hideOnClick': false, appendTo: 'parent' }">
                        <div class="header-user">
                            <span>{{ user.username }}</span>
                            <i class="bk-icon icon-down-shape"></i>
                        </div>
                        <template slot="content">
                            <span @click="signOut" class="nav-sign-out">退出</span>
                        </template>
                    </bk-popover>
                </div>
                <bk-navigation-menu slot="menu" :default-active="curNav.id" :toggle-active="toggleActive">
                    <bk-navigation-menu-item
                        @click="goToPage(child)"
                        :key="child.id"
                        v-for="child in ${leftMenuKey}"
                        :id="child.id"
                        :icon="child.icon"
                        :has-child="child.children && !!child.children.length">
                        <span>{{child.name}}</span>
                        <div slot="child">
                            <bk-navigation-menu-item
                                @click="goToPage(set)"
                                :key="set.id"
                                v-for="set in child.children"
                                :id="set.id">
                                <span>{{set.name}}</span>
                            </bk-navigation-menu-item>
                        </div>
                    </bk-navigation-menu-item>
                </bk-navigation-menu>
                ${navContent}
            </bk-navigation>
        `
    }

    getComplexLayout (navContent, componentProps) {
        const complexMenuKey = `complexMenu${this.uniqueKey}`
        const curLeftMenuKey = `leftMenu${this.uniqueKey}`
        const { layoutContent } = this

        this.dataTemplate('toggleActive', 'false')
        this.dataTemplate(complexMenuKey, JSON.stringify(layoutContent.topMenuList))
        this.dataTemplate(curLeftMenuKey, '[]')

        return `
            <bk-navigation ${componentProps} navigation-type="top-bottom" :need-menu="${curLeftMenuKey}.length > 0" class="bk-layout-custom-component-wrapper" @toggle="v => toggleActive=v">
                <template slot="side-header">
                    <span class="title-icon">
                        <img src="${layoutContent.logo}" style="width: 28px; height: 28px;">
                    </span>
                    <span class="title-desc">${layoutContent.siteName}</span>
                </template>
                <div class="navigation-header" slot="header">
                    <ul class="header-nav">
                        <li v-for="(item) in ${complexMenuKey}" :class="{ 'item-active': item.id === curNav.id }" :key="item.id" theme="light navigation-message" class="header-nav-item" @click="goToPage(item)">
                            {{item.name}}
                        </li>
                    </ul>
                    <bk-popover class="nav-head-right" theme="light navigation-message" :arrow="false" offset="-10, 0" placement="bottom-start" :tippy-options="{ 'hideOnClick': false, appendTo: 'parent' }">
                        <div class="header-user">
                            <span>{{ user.username }}</span>
                            <i class="bk-icon icon-down-shape"></i>
                        </div>
                        <template slot="content">
                            <span @click="signOut" class="nav-sign-out">退出</span>
                        </template>
                    </bk-popover>
                </div>
                <bk-navigation-menu slot="menu" :default-active="curNav.id" :toggle-active="toggleActive">
                    <bk-navigation-menu-item
                        @click="goToPage(child)"
                        :key="child.id"
                        v-for="child in ${curLeftMenuKey}"
                        :id="child.id"
                        :icon="child.icon"
                        :has-child="child.children && !!child.children.length">
                        <span>{{child.name}}</span>
                        <div slot="child">
                            <bk-navigation-menu-item
                                @click="goToPage(set)"
                                :key="set.id"
                                v-for="set in child.children"
                                :id="set.id">
                                <span>{{set.name}}</span>
                            </bk-navigation-menu-item>
                        </div>
                    </bk-navigation-menu-item>
                </bk-navigation-menu>
                ${navContent}
            </bk-navigation>
        `
    }

    generateScript () {
        const lifeCycle = typeof this.lifeCycle === 'string' ? JSON.parse(this.lifeCycle) : this.lifeCycle
        const lifeCycleValues = Object.values(lifeCycle)
        const exisLifyCycle = lifeCycleValues.filter(x => x)
        const lifeCircleStr = this.getLifeCycle()
        const methodsStr = this.getMethods()
        this.handleVariable()

        const importContent = this.getImportContent()
        let scriptContent = `${this.getComponents() ? `${this.getComponents()},` : ''}
                        ${this.pageType === 'projectCode' && (this.usingFuncCodes.length > 0 || exisLifyCycle.length > 0) ? `mixins: [methodsMixin],` : ''}
                        ${this.getData() ? `${this.getData()},` : ''}
                        ${this.getComputed()}
                        ${this.getWatch()}
                        ${lifeCircleStr}
                        ${methodsStr}`
        if (scriptContent.endsWith(',')) {
            scriptContent = scriptContent.substr(0, scriptContent.length - 1)
        }
        return `<script>
            ${importContent}
            export default {
                ${scriptContent}
            }
            <\/script>\n`
    }

    getWatch () {
        let watch = ''
        if (this.hasLayOut) {
            watch += `watch: {
                '$route' () {
                    this.setNav()
                }
            },`
        }
        return watch
    }

    getComputed () {
        let computed = ''
        if ((['vueCode', 'projectCode'].includes(this.pageType) && this.hasLayOut) || this.projectVariables.length || this.pageComputedVariables.length) {
            computed += 'computed: {\n'
            if (['vueCode', 'projectCode'].includes(this.pageType) && this.hasLayOut) {
                computed += `...mapGetters(['user']),\n`
            }
            this.projectVariables.forEach((variable) => {
                computed += `${variable.variableCode}: {
                    get () {
                        return this.$store.state.variable.${variable.variableCode}
                    },
                    set (val) {
                        this.$store.dispatch('variable/setBkProjectVariable', { code: '${variable.variableCode}', val })
                    }
                },
                `
            })
            this.pageComputedVariables.forEach((variable) => {
                computed += `${variable.variableCode} () {
                    ${this.processFuncBody(variable.defaultValue.all)}
                },
                `
            })
            computed += '},'
        }
        return computed
    }

    generateCode (v) {
        const len = v.length
        let code = ''
        for (let i = 0; i < len; i++) {
            const item = v[i]
            const { vueDirectives, propDirectives, templateDirectives } = this.getDirectives(item.renderDirectives, item.renderProps, item.componentId)
            const vueDirective = vueDirectives.join(' ')
            const templateDirective = templateDirectives.join(' ')
            const propDirective = propDirectives.join(' ')
            if (templateDirective) code += `\n<template ${templateDirective}>`
            if (item.type === 'render-grid') {
                /* eslint-disable no-unused-vars, indent */
                const { itemStyles = '', itemClass = '' } = this.getItemStyles(item.componentId, item.renderStyles, item.renderProps)
                const gutterVal = item.renderProps.gutter ? item.renderProps.gutter.val : 0
                const paddingStyleStr = `padding-right: ${gutterVal / 2}px;padding-left: ${gutterVal / 2}px;`
                code += `
                    ${itemClass ? `\n<div class="bk-layout-row-${this.uniqueKey} ${item.componentId}" ${vueDirective} ${propDirective}>` : `<div class="bk-layout-row-${this.uniqueKey}" ${vueDirective} ${propDirective}>`}
                        ${item.renderSlots && item.renderSlots.default && item.renderSlots.default.val && item.renderSlots.default.val.map(col => {
                    return `<div class="bk-layout-col-${this.uniqueKey}" style="width: ${col.width || ''};${paddingStyleStr}">
                                        ${col.children.length ? `${this.generateCode(col.children)}` : ''}
                                    </div>`
                }).join('\n')}
                    </div>
                `
            } else if (item.type === 'free-layout') {
                const { itemStyles = '', itemClass = '' } = this.getItemStyles(item.componentId, item.renderStyles, item.renderProps)
                code += `
                    ${itemClass ? `\n<div class="bk-free-layout-${this.uniqueKey} ${item.componentId}" ${vueDirective} ${propDirective}>` : `<div class="bk-free-layout-${this.uniqueKey}" ${vueDirective} ${propDirective}>`}
                        ${item.renderSlots && item.renderSlots.default && item.renderSlots.default.val && item.renderSlots.default.val.map(slotData => {
                    return `<div class="bk-free-layout-item-inner-${this.uniqueKey}">
                                        <div style="height: ${item.renderStyles.height || '500px'}">
                                            ${slotData.children.length ? `${this.generateCode(slotData.children)}` : ''}
                                        </div>
                                    </div>`
                }).join('\n')}
                    </div>
                `
                /* eslint-enable no-unused-vars, indent */
            } else {
                code += this.generateComponment(item, vueDirective, propDirective)
            }
            if (templateDirective) code += `\n</template>`
        }
        return code
    }

    getItemProps (type, props, compId, directives, slots) {
        const hasProps = props && typeof props === 'object' && Object.keys(props).length > 0
        const dirProps = (directives || []).filter((directive) => (directive.val !== '' && directive.prop !== ''))
        let itemProps = ''
        if (hasProps || slots) {
            itemProps = this.getPropsStr(type, props, compId, dirProps, slots)
        }
        return itemProps
    }

    getPropsStr (type, props, compId, dirProps, slots) {
        let propsStr = ''
        const preCompId = camelCase(compId, { transform: camelCaseTransformMerge })
        let elementComId = ''
        const componentType = type
        for (const i in props) {
            if (dirProps.find((directive) => (directive.prop === i)) && props[i].type !== 'remote') continue

            if (i !== 'slots' && i !== 'class') {
                compId = `${preCompId}${camelCase(i, { transform: camelCaseTransformMerge })}`
                if (i === 'value') elementComId = compId
                const { 'v-bind': vBind, 'v-model': vModel, val, type, modifiers = [] } = props[i]

                const propVar = vBind || vModel || compId
                const hasVBind = ![undefined, ''].includes(vBind)
                const hasVModel = ![undefined, ''].includes(vModel)
                const propName = vBind && modifiers && modifiers.length ? `${i}.${modifiers.join('.')}` : i
                let curPropStr = `${val === undefined ? '' : ':'}${propName}="${propVar}" `
                if (hasVModel) curPropStr = `v-model=${propVar} `

                if (type === 'remote') {
                    const curDir = dirProps.find((directive) => (directive.prop === i))
                    const key = (curDir || {}).val || propVar
                    this.remoteMethodsTemplate(key, props[i].payload || {})
                    if (!curDir) {
                        this.dataTemplate(propVar, JSON.stringify([]))
                        propsStr += curPropStr
                    }
                    continue
                }

                if (type === 'array' || typeof val === 'object') {
                    if (componentType === 'widget-form' && i === 'rules') {
                        this.handleFormRules(propVar, val)
                    } else {
                        this.dataTemplate(propVar, JSON.stringify(val))
                    }
                    propsStr += curPropStr
                    continue
                }

                if (type === 'function') {
                    const [method] = this.getMethodByCode(props[i].payload || {})
                    if (method.funcName && method.funcCode) {
                        // 这个属性 不用支持参数
                        // let funcParamsStr = ''
                        // if (params.length > 0) {
                        //     funcParamsStr = `(${params.join(', ')}, ...arguments)`
                        // }
                        // propsStr += (`:${propName}="${method.funcName}${funcParamsStr}" `)
                        propsStr += (`:${propName}="${method.funcName}" `)

                        this.usingFuncCodes.push(method.funcCode)
                    }
                    continue
                }

                if (val !== undefined) {
                    if (hasVBind || hasVModel) {
                        if (typeof val === 'string') {
                            this.dataTemplate(propVar, `'${val}'`)
                        } else {
                            const v = (typeof val === 'object' ? JSON.stringify(val).replace(/\"/g, '\'') : val)
                            this.dataTemplate(propVar, v)
                        }
                        propsStr += curPropStr
                    } else {
                        const v = (typeof val === 'object' ? JSON.stringify(val).replace(/\"/g, '\'') : val)
                        propsStr += `${typeof val === 'string' ? '' : ':'}${propName}="${v}" `
                    }
                }
            }
            // } else {
            //     const hasVModel = dirProps.filter(item => item.type === 'v-model').length
            //     if (type === 'bk-checkbox-group' && !hasVModel) {
            //         const checkedValue = slots.default.val.filter(c => c.checked === true).map(c => c.value)
            //         this.dataTemplate(compId, JSON.stringify(checkedValue))
            //         propsStr += `v-model="${compId}"`
            //     }
            // }
        }
        const hasVModel = dirProps.filter(item => item.type === 'v-model').length
        if (type === 'bk-checkbox-group' && !hasVModel) {
            const checkedValue = slots.default.val.filter(c => c.checked === true).map(c => c.value)
            this.dataTemplate(compId, JSON.stringify(checkedValue))
            propsStr += `v-model="${compId}"`
        }
        // element组件添加vmodel
        if (type.startsWith('el-')) {
            if (!hasVModel && elementComId !== '') {
                const valueType = typeof props['value'].val
                if (valueType !== 'array' && valueType !== 'object') {
                    let vModelValue = props['value'].val.toString()
                    if (valueType === 'string') vModelValue = `'${props['value'].val}'`
                    this.dataTemplate(elementComId, vModelValue)
                }
                propsStr += `v-model="${elementComId}"`
            }
        }
        return propsStr
    }

    // 生成formRules部分
    handleFormRules (propVar, val) {
        const notStringType = ['required', 'validator', 'regex']
        const reg = /,$/gi
        let jsonStr = '{'
        try {
            if (typeof val === 'object' && Object.keys(val).length > 0) {
                for (const i in val) {
                    jsonStr += `${i}: [`
                    if (val[i] && val[i].length) {
                        const funcItems = val[i].filter(item => item.validator)

                        funcItems.map(item => {
                            const [method] = this.getMethodByCode({ methodCode: item.validator })
                            if (method.funcCode) {
                                this.usingFuncCodes.push(method.funcCode)
                            }
                            item.validator = `this.${item.validator}`
                        })
                        val[i].map(rule => {
                            jsonStr += '{'
                            for (const j in rule) {
                                if (notStringType.indexOf(j) === -1) {
                                    jsonStr += `${j}: '${rule[j]}',`
                                } else {
                                    jsonStr += `${j}: ${rule[j]},`
                                }
                            }
                            jsonStr += '},'
                        })
                        jsonStr = jsonStr.replace(reg, '')
                    }
                    jsonStr += `],`
                }
                jsonStr = jsonStr.replace(reg, '')
                jsonStr += '}'
            } else {
                jsonStr = '{}'
            }
        } catch (err) {
            console.log(err, 'ruleError')
            jsonStr = '{}'
        }
        this.dataTemplate(propVar, jsonStr)
    }

    getItemStyles (compId, styles, props) {
        // 分离class和其它style属性
        let className = compId
        className += (props && props.hasOwnProperty('class') && ` ${props.class.val}`) || '' // 添加原生标签的用户自定义class

        let hasStyle = false
        if (styles && typeof styles === 'object') {
            if (Object.keys(styles).length > 0) {
                for (const key in styles) {
                    if (!styles[key]) {
                        delete styles[key]
                    }
                    // 合并样式面板和自定义class样式
                    if (key === 'customStyle' && styles[key] && Object.keys(styles[key]).length) {
                        Object.assign(styles, styles[key])
                        delete styles[key]
                    }
                }
                hasStyle = true
            }
        }
        // 有设置class的话，将样式写至<style>
        if (hasStyle) {
            let tmpStr = ''
            for (const i in styles) {
                // 自由布局的组件由父元素来绝对定位，left 和 top 也由父元素控制，因此组件本身的 top 和 left 设置为 0
                if (i === 'top' || i === 'left') {
                    tmpStr += `${i}: 0px;\n`
                } else {
                    tmpStr += `${paramCase(i)}: ${styles[i]};\n`
                }
            }

            this.cssStr += compId.startsWith('elIcon') ? `\n.${compId}` : `\n.${className}`
            this.cssStr += ` {\n${tmpStr}}`
        }

        // const itemStyles = `${(!hasStyle || className) ? '' : `:style='${JSON.stringify(styles)}'`}`
        const itemStyles = ''
        const itemClass = `${!hasStyle ? `class='bk-layout-component-${this.uniqueKey}'` : `class='bk-layout-component-${this.uniqueKey} ${className}'`}`

        return { itemStyles, itemClass }
    }

    getItemEvents (events = {}) {
        let eventStr = ''
        if (typeof events === 'object' && Object.keys(events).length) {
            for (const key in events) {
                const [fun, params] = this.getMethodByCode(events[key])
                if (fun.id) {
                    let curEventStr = `@${key}="${fun.funcName}" `
                    if (params.length > 0) curEventStr = `@${key}="${fun.funcName}(${params.join(', ')}, ...arguments)" `
                    eventStr += curEventStr
                    this.usingFuncCodes.push(fun.funcCode)
                }
            }
        }
        return eventStr
    }

    handleUsedVariable (valType, val, componentId) {
        let disPlayVal = val
        switch (valType) {
            case 'value':
                disPlayVal = this.getValue(val)
                break
            case 'variable':
                const variable = this.variableList.find(x => x.variableCode === val)
                const hasUsed = this.usingVariables.find(x => x.variableCode === val)
                // form表单内的v-model绑定值忽略这个判断
                if (!variable && !(val.startsWith('form') && val.indexOf('.') > 0)) {
                    this.codeErrMessage = `组件【${componentId}】使用了不存在的变量【${val}】，请修改后重试`
                }
                if (!hasUsed && variable) {
                    this.usingVariables.push(variable)
                }
                break
            case 'expression':
                this.variableList.forEach((variable) => {
                    if (val.includes(variable.variableCode) && !this.usingVariables.find(x => x.variableCode === variable.variableCode)) {
                        this.usingVariables.push(variable)
                    }
                })
                break
        }
        return disPlayVal
    }

    getDirectives (renderDirectives, renderProps, componentId) {
        // 过滤
        const exisDirectives = (renderDirectives || []).filter((directive) => (directive.val !== ''))
        const vueDirectives = []
        const templateDirectives = []
        const propDirectives = []
        const id = componentId.replace(/\-(.)/g, x => (x.slice(1)).toUpperCase())

        exisDirectives.forEach((directive) => {
            const { type, modifiers = [], prop = '', valType, val } = directive
            const modifierStr = (modifiers || []).map((modifier) => `.${modifier}`).join('')
            const disPlayVal = this.handleUsedVariable(valType, val, componentId)
            switch (type) {
                case 'v-if':
                    const exitsVFor = exisDirectives.find((dir) => (dir.type === 'v-for'))
                    const expression = `v-if="${disPlayVal}"`
                    if (exitsVFor) templateDirectives.push(expression)
                    else vueDirectives.push(expression)
                    break
                case 'v-for':
                    vueDirectives.push(`v-for="(${id}Item, ${id}Index) in ${disPlayVal}" :key="${id}Index"`)
                    break
                case 'v-model':
                case 'v-show':
                case 'v-html':
                    propDirectives.push(`${type}="${disPlayVal}"`)
                    break
                default:
                    propDirectives.push(`${type}${prop ? `:${prop}` : ''}${modifierStr}="${disPlayVal}"`)
                    break
            }
        })
        return { vueDirectives, propDirectives, templateDirectives }
    }

    renderSlot (type, slots, compId) {
        if (!slots) {
            return ''
        }

        let slotStr = ''
        compId = `${compId}`.replace('-', '')
        compId = `${camelCase(compId, { transform: camelCaseTransformMerge })}Slot`
        const slotKeys = Object.keys(slots)
        slotKeys.forEach((key) => {
            const slot = slots[key]
            const isDefaultSlot = key === 'default'
            compId = compId + key
            slotStr += '\n'
            if (!isDefaultSlot) slotStr += `<template slot="${key}">\n`
            if (['render-grid', 'render-row', 'render-col', 'free-layout'].includes(slot.type)) {
                const codeArr = []
                // card, dialog, sideslider 组件的 slots 配置中 val 没有 componentId
                // 会导致在 getDirectives 方法中 componentId.replace 报错
                if (!slot.val.componentId) {
                    slot.val.componentId = `${slot.val.name}-${uuid()}`
                }
                codeArr.push(slot.val)
                slotStr += this.generateCode(codeArr)
            } else if (slot.type === 'form-item-content') {
                slotStr += this.generateCode(slot.val)
            } else {
                const render = slotRenderConfig[slot.name] || (() => {})
                const slotRenderParams = []
                let curSlot = slot
                do {
                    const defaultValMap = {
                        '[object Array]': [],
                        '[object Object]': {},
                        '[object Number]': 0,
                        '[object Boolean]': false,
                        '[object String]': ''
                    }
                    const { variableData = {}, methodData = {} } = slot.payload || {}
                    const type = Object.prototype.toString.call(slot.val)
                    let disPlayVal = defaultValMap[type] || ''
                    const param = { val: disPlayVal, type: 'variable' }

                    if (variableData.val) {
                        disPlayVal = this.handleUsedVariable(variableData.valType, variableData.val, compId)
                    } else if (methodData.methodCode) {
                        this.dataTemplate(compId, transformToString(disPlayVal))
                        this.remoteMethodsTemplate(compId, methodData || {})
                        disPlayVal = compId
                    } else {
                        if (typeof slot.val === 'object') {
                            this.dataTemplate(compId, transformToString(slot.val))
                            disPlayVal = compId
                        } else {
                            disPlayVal = slot.val
                            param.type = 'value'
                        }
                    }
                    // table slot 可能会用到fun，需要特殊处理一下。其他情况也可以在slot value 里面加上 methodCode 字段来处理
                    if (Array.isArray(slot.val)) {
                        (slot.val || []).forEach((item) => {
                            item.methodCode && (this.usingFuncCodes = this.usingFuncCodes.concat(item.methodCode))
                        })
                    }
                    param.val = disPlayVal
                    slotRenderParams.push(param)
                    curSlot = curSlot.renderSlots
                } while (curSlot && Object.keys(curSlot).length > 0)
                slotStr += render(...slotRenderParams)
            }
            if (!isDefaultSlot) slotStr += `\n</template>\n`
        })
        return slotStr

        // if (slot.type === 'layout') {
        //     const codeArr = []
        //     // card, dialog, sideslider 组件的 slots 配置中 val 没有 componentId
        //     // 会导致在 getDirectives 方法中 componentId.replace 报错
        //     if (!slot.val.componentId) {
        //         slot.val.componentId = `${slot.val.name}-${uuid()}`
        //     }
        //     codeArr.push(slot.val)
        //     const slotName = slot.val.slotName || 'default'
        //     slotStr += `
        //     <template slot="${slotName}">
        //         ${this.generateCode(codeArr)}
        //     </template>`
        // } else if (slot.type === 'form-item-content') {
        //     slotStr += this.generateCode(slot.val)
        // } else if (slot.payload && slot.payload.variableData && slot.payload.variableData.val) {
        //     const variableData = slot.payload.variableData
        //     const disPlayVal = this.handleUsedVariable(variableData.valType, variableData.val, compId)
        //     if (slot.type === 'html') {
        //         slotStr += `<div v-html="${disPlayVal}"></div>`
        //     }
        //     if (slot.name === 'text') {
        //         slotStr += `{{${disPlayVal}}}`
        //     }
        // } else if (typeof slot.val === 'string') {
        //     slotStr = slot.val
        // } else if (typeof slot === 'object') {
        //     let slotType = this.slotTagMap[type] ? this.slotTagMap[type] : ''
        //     if (type === 'bk-radio-group' && slot.name === 'bk-radio-button') {
        //         slotType = slot.name
        //     }
        //     if (slotType) {
        //         if (slot.type === 'remote') {
        //             this.dataTemplate(compId, JSON.stringify([]))
        //             this.remoteMethodsTemplate(compId, slot.payload || {})
        //             let content = this.slotContentArray.includes(slotType) ? '{{item.label}}' : ''
        //             content = slotType === 'el-carousel-item' ? '{{item.content}}' : content
        //             const attrStr = (slot.attrs && slot.attrs.map((item, index) => `:${item.key}="item.${item.value}"`).join('\n')) || ''

        //             slotStr += `<${slotType} v-for="item in ${compId}" ${attrStr}>
        //                 ${content}
        //             </${slotType}>`
        //         } else {
        //             slot.val && slot.val.map(item => {
        //                 if ((slotType === 'bk-table-column' || slotType === 'el-table-column') && item.type === 'customCol') {
        //                     // const scopeName = slotType === 'bk-table-column' ? 'props' : 'scope'
        //                     slotStr += `<${slotType} label="${item.label}" width="${item.width}">
        //                         <template slot-scope="props">
        //                             ${item.templateCol}
        //                         </template>
        //                     </${slotType}>`
        //                     item.methodCode && (this.usingFuncCodes = this.usingFuncCodes.concat(item.methodCode))
        //                 } else {
        //                     let content = this.slotContentArray.includes(slotType) ? item.label : ''
        //                     content = slotType === 'el-carousel-item' ? item.content : content
        //                     const itemProps = this.getSlotPropsStr(item, slot.attrs, slotType)
        //                     slotStr += ''
        //                         + `<${slotType} ${itemProps}>`
        //                         + content
        //                         + `</${slotType}>`
        //                         + '\n'
        //                 }
        //             })
        //         }
        //     }
        //     if (type === 'search-table' || type === 'folding-table') {
        //         slotStr = `<template slot="table-column">${slotStr}</template>`
        //     }
        // }
    }

    // getSlotPropsStr (props, attrs, slotType) {
    //     let propsStr = ''
    //     for (const i in props) {
    //         if (slotType === 'el-carousel-item' && i === 'content') {
    //             continue
    //         }
    //         if (i !== 'slots') {
    //             const propsValue = typeof props[i] === 'object' ? JSON.stringify(props[i]).replace(/\"/g, '\'') : props[i]
    //             const propsKey = (attrs && attrs.find(item => item.value === i)) ? attrs.find(item => item.value === i).key : i
    //             propsStr += `${typeof props[i] === 'string' ? '' : ':'}${propsKey}="${propsValue}" `
    //         }
    //     }
    //     return propsStr
    // }

    getData () {
        let data = ''
        if (this.dataStr || this.pageDataVariables.length) {
            data += `data () {
                ${this.pageDataVariables.length ? `function getInitVariableValue (defaultValue, defaultValueType) {
                    let val = defaultValue.all
                    if (defaultValueType === 1) val = defaultValue[window.BKPAAS_ENVIRONMENT]
                    return val
                }` : ''}
                return {
                    ${this.dataStr}
                }
            }`
        }
        return data
    }

    handleVarInFunc (dirKey, funcCode) {
        if (funcCode) {
            const [curFunc] = this.getMethodByCode(funcCode)
            if (curFunc.id) {
                this.usingFuncCodes.push(funcCode)
            } else {
                this.codeErrMessage = `函数【${funcCode}】不存在，函数执行可能存在异常，请修改后再试`
            }
            return `this.${curFunc.funcName}`
        }
        if (dirKey) {
            const curDir = this.variableList.find((variable) => (variable.variableCode === dirKey))
            if (curDir) {
                const hasUsed = this.usingVariables.find((variable) => (variable.id) === curDir.id)
                if (!hasUsed) {
                    this.usingVariables.push(curDir)
                }
            } else {
                this.codeErrMessage = `指令【${dirKey}】不存在，函数执行可能存在异常，请修改后再试`
            }
            return `this.${dirKey}`
        }
    }

    processFuncBody (code) {
        const encodeCode = (code || '').replace(new RegExp('(<)([^>]+)(>)', 'gi'), (match, p1, p2, p3, offset, string) => `\\${p1}` + p2 + `\\${p3}`)
        return replaceFuncKeyword(encodeCode, (all, first, second, dirKey, funcStr, funcCode) => {
            return this.handleVarInFunc(dirKey, funcCode) || all
        })
    }

    processFuncParams (str) {
        return (str || '').replace(/\{\{([^\}]+)\}\}/g, (all, variableCode) => {
            return `${this.handleVarInFunc(variableCode) || all}`
        })
    }

    processFuncUrl (str) {
        return (str || '').replace(/\{\{([^\}]+)\}\}/g, (all, variableCode) => {
            return `\$\{${this.handleVarInFunc(variableCode) || all}\}`
        })
    }

    getComplateFuncByCode (methodCode) {
        const [returnMethod] = this.getMethodByCode(methodCode) || {
            id: '',
            funcName: 'emptyFunc',
            previewStr: '',
            vueCodeStr: '',
            funcBody: ''
        }
        const paramsStr = (returnMethod.funcParams || []).join(', ')
        const addFuncStr = (funcBody = '') => {
            funcBody = this.processFuncBody(funcBody)
            const hasAwait = /await\s/.test(funcBody)
            return `${hasAwait ? 'async' : ''} ${returnMethod.funcName} (${paramsStr}) { ${funcBody} }`
        }
        if (returnMethod.funcType === 1) {
            const remoteParams = (returnMethod.remoteParams || []).join(', ')
            const data = `{
                'url': \`${this.processFuncUrl(returnMethod.funcApiUrl)}\`,
                'type': '${returnMethod.funcMethod}',
                'apiData': ${this.getValue(this.processFuncParams(returnMethod.funcApiData))},
                'withToken': ${returnMethod.withToken}
            }`
            returnMethod.code = addFuncStr(`return this.$store.dispatch('getApiData', ${data}).then((${remoteParams}) => { ${returnMethod.funcBody} }).catch((err) => { console.error(err) })`)
        } else {
            returnMethod.code = addFuncStr(returnMethod.funcBody)
        }
        return returnMethod
    }

    getMethods () {
        let methods = ''

        // 分析页面使用到的方法，下载的源码（pageType === projectCode）放到单独的文件
        if (this.usingFuncCodes.length) {
            for (let index = 0; index < this.usingFuncCodes.length; index++) {
                const code = this.usingFuncCodes[index]
                if (this.existFunc.includes(code)) continue
                this.existFunc.push(code)
                const func = this.getComplateFuncByCode(code) || {}
                const funcStr = func.code || ''
                if (funcStr) this.methodStrList.push({ id: func.id, funcStr })
            }
        }

        if (this.hasLayOut || this.remoteDataStr || (this.usingFuncCodes.length && ['vueCode', 'preview'].includes(this.pageType))) {
            methods += `methods: {`

            // 布局相关的方法
            if (this.hasLayOut) {
                /* eslint-disable indent */
                methods += `
                    goToPage (item) {
                        this.setNav(item.id)
                        const originQuery = item.query || ''
                        const queryStr = originQuery[0] === '?' ? originQuery.slice(1) : originQuery
                        const queryArr = queryStr.split('&').filter(v => v)
                        const query = queryArr.reduce((res, item) => {
                            const [key, value = ''] = item.split('=')
                            res[key] = value
                            return res
                        }, { id: item.id })
                        if (item.pageCode && item.pageCode === this.$route.name) {
                            this.$router.push({ path: this.$route.path, query })
                        } else if (item.fullPath) {
                            this.$router.push({ path: item.fullPath, query })
                        } else if (item.pageCode) {
                            this.$router.push({ name: item.pageCode, query })
                        } else if (item.link) {
                            window.open(item.link, '_blank')
                        } else {
                            this.$router.push({ name: '404' })
                        }
                    },
                `
                let setNav = ''
                const pageKey = this.pageType === 'projectCode' ? 'pageCode' : 'pageId'
                const pageValue = this.pageType === 'projectCode' ? 'this.$route.name' : '+this.$route.params.pageId'
                switch (this.layoutType) {
                    case 'top-bottom':
                        setNav = `setNav (id) {
                            const itemId = id || this.$route.query.id
                            const name = ${pageValue};
                            (this.topMenu${this.uniqueKey} || []).forEach((topNav) => {
                                const isSameId = itemId && (topNav.id === itemId || (Array.isArray(topNav.children) && topNav.children.find((nav) => (nav.id === itemId))))
                                const isSameName = !itemId && name && (topNav.${pageKey} === name || (Array.isArray(topNav.children) && topNav.children.find((nav) => (nav.${pageKey} === name))))
                                if (isSameId || isSameName) this.curNav = topNav || {}
                            })
                        },`
                        break
                    case 'left-right':
                        setNav = `setNav (id) {
                            const itemId = id || this.$route.query.id
                            const name = ${pageValue};
                            (this.leftMenu${this.uniqueKey} || []).forEach((menu) => {
                                let tempItem
                                if (itemId) {
                                    tempItem = [menu, ...(menu.children || [])].find((child) => (child.id === itemId))
                                } else {
                                    tempItem = [menu, ...(menu.children || [])].find((child) => (child.${pageKey} === name))
                                }
                                if (tempItem) this.curNav = tempItem
                            })
                        },`
                        break
                    case 'complex':
                        setNav = `setNav (id) {
                            const itemId = id || this.$route.query.id
                            const name = ${pageValue};
                            (this.complexMenu${this.uniqueKey} || []).forEach((menu) => {
                                const allMenus = [menu];
                                (menu.children || []).forEach((child) => {
                                    allMenus.push(...[child, ...(child.children || [])])
                                })
                                const tempItem = itemId ? allMenus.find((child) => (child.id === itemId)) : allMenus.find((child) => (child.${pageKey} === name))
                                if (tempItem) {
                                    this.curNav = tempItem
                                    this.leftMenu${this.uniqueKey} = menu.children || []
                                }
                            })
                        },`
                        break
                }

                if (['projectCode', 'vueCode'].includes(this.pageType)) {
                    methods += `signOut () {
                            auth.signOut()
                        },
                    `
                } else {
                    const loginRedirectUrl = `${httpConf.loginUrl}?app_id=${httpConf.appCode}`
                    methods += `signOut () {
                            window.parent.location.href = '${loginRedirectUrl}' + '&c_url=' + window.parent.location.href
                        },
                    `
                }

                methods += setNav
            }
            /* eslint-enable indent */

            // 远程数据源方法
            if (this.remoteDataStr) {
                methods += `
                    async initRemoteData () {
                        try {
                            ${this.remoteDataStr}
                        } catch (error) {
                            console.error(error)
                        }
                    },
                `
            }

            // 预览和查看源码，函数写在页面里面
            if (['vueCode', 'preview'].includes(this.pageType)) methods += this.methodStrList.map((func) => (func.funcStr)).join(',')

            methods += '},'
        }

        return methods
    }

    getLifeCycle () {
        const lifeCycle = typeof this.lifeCycle === 'string' ? JSON.parse(this.lifeCycle) : this.lifeCycle
        const lifeCycleKeys = Object.keys(lifeCycle) || []
        // 生成使用函数的对象
        const lifeCycleStrObj = {}
        lifeCycleKeys.forEach((key) => {
            const funcPayload = lifeCycle[key]
            const [method, params] = this.getMethodByCode(funcPayload)
            lifeCycleStrObj[key] = []
            if (method.id) {
                if (method.funcCode) this.usingFuncCodes.push(method.funcCode)
                lifeCycleStrObj[key].push(`this.${method.funcName}(${params.join(', ')})`)
            }
        })
        if (this.remoteDataStr) {
            if (!lifeCycleStrObj.created) lifeCycleStrObj.created = []
            if (!lifeCycleKeys.includes('created')) lifeCycleKeys.push('created')
            lifeCycleStrObj.created.push('this.initRemoteData()')
        }
        if (this.hasLayOut) {
            if (!lifeCycleStrObj.created) lifeCycleStrObj.created = []
            if (!lifeCycleKeys.includes('created')) lifeCycleKeys.push('created')
            lifeCycleStrObj.created.push('this.setNav()')
        }

        let lifeCycleStr = ''
        lifeCycleKeys.forEach((key) => {
            const curFuncStrList = lifeCycleStrObj[key] || []
            if (curFuncStrList.length > 0) lifeCycleStr += `${key} () {${curFuncStrList.join('\r\n')}},`
        })
        return lifeCycleStr
    }

    getComponents () {
        if (this.pageType === 'preview') return
        let componentStr = ''
        if (this.chartTypeArr && this.chartTypeArr.length) {
            componentStr += 'chart: ECharts,\n'
        }
        if (this.useBkCharts) {
            componentStr += 'bkCharts: bkCharts'
        }
        if (this.pageType !== 'preview' && this.usingCustomArr && this.usingCustomArr.length) {
            let customStr = ''
            // dev 和 t 环境，npm 包名字前面加了 test- 前缀，生成的变量名字应该去掉 test 前缀
            let forkUsingCustomArr = this.usingCustomArr
            if (process.env.BKPAAS_ENVIRONMENT !== 'prod') {
                forkUsingCustomArr = this.usingCustomArr.map(item => item.replace(/^test\-/, ''))
            }
            for (const i in this.usingCustomArr) {
                customStr += `${camelCase(forkUsingCustomArr[i], { transform: camelCaseTransformMerge })},\n`
            }
            componentStr += customStr
        }
        if (componentStr) {
            componentStr.endsWith(',\n') && componentStr.substr(0, componentStr.length - 2)
            componentStr = `components: {
                ${componentStr}
            }`
        }
        return componentStr
    }

    getImportContent () {
        let importStr = ''

        if (this.isUseElementComponentLib) {
            importStr = `
                /**
                 * 请先安装 bk-magic-vue 组件库、bkui-vue-complex 复合组件库以及 element-ui 组件库
                 * bk-magic-vue 组件库: https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/install
                 * bkui-vue-complex 复合组件库: https://github.com/TencentBlueKing/lesscode-comp
                 * element-ui 组件库: https://element.eleme.cn/#/zh-CN/component/installation
                 *
                 * 如果页面使用了远程函数，单独使用本页面，需要确保项目 store 下有相应的方法，后端有相应的转发接口
                 */

                `
        } else {
            importStr = `
                /**
                 * 请先安装 bk-magic-vue 组件库、bkui-vue-complex 复合组件库
                 * bk-magic-vue 组件库: https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/install
                 * bkui-vue-complex 复合组件库: https://github.com/TencentBlueKing/lesscode-comp
                 *
                 * 如果页面使用了远程函数，单独使用本页面，需要确保项目 store 下有相应的方法，后端有相应的转发接口
                 */

                `
        }

        if (this.useBkCharts) {
            importStr += `
                /**
                 * 请先安装 bk-charts 相关依赖: npm install @blueking/bkcharts
                 */
            `
            importStr += `const bkCharts = require('@/components/bkCharts.vue')\n`
        }

        if (this.chartTypeArr && this.chartTypeArr.length) {
            importStr += `/**
                * 请先安装 echarts 相关依赖: npm install echarts vue-echarts
                * 更多使用请参考：https://github.com/ecomfe/vue-echarts#usage
                */
                const ECharts = require('vue-echarts/components/ECharts.vue')
                require('echarts/lib/component/tooltip')
                require('echarts/lib/component/title')
                require('echarts/lib/component/legend')
            `
            for (const i in this.chartTypeArr) {
                importStr += `require('echarts/lib/chart/${this.chartTypeArr[i]}')\n`
            }
        }
        if (this.hasLayOut && ['projectCode', 'vueCode'].includes(this.pageType)) {
            if (this.pageType === 'vueCode') {
                importStr += `/**
                    * 请在项目 store 里存入用户相关信息
                    * 请在项目 common 里完善退出登陆相关方法
                    */
                `
            }
            importStr += `import { mapGetters } from 'vuex'\n`
            importStr += `import auth from '@/common/auth'\n`
        }
        if (this.pageType !== 'preview' && this.usingCustomArr && this.usingCustomArr.length) {
            // dev 和 t 环境，npm 包名字前面加了 test- 前缀，生成的变量名字应该去掉 test 前缀
            let forkUsingCustomArr = this.usingCustomArr
            if (process.env.BKPAAS_ENVIRONMENT !== 'prod') {
                forkUsingCustomArr = this.usingCustomArr.map(item => item.replace(/^test\-/, ''))
            }
            for (const i in this.usingCustomArr) {
                importStr += `const ${camelCase(forkUsingCustomArr[i], { transform: camelCaseTransformMerge })} = require('${npmConf.scopename}/${this.usingCustomArr[i]}')\n`
            }
        }
        const lifeCycle = typeof this.lifeCycle === 'string' ? JSON.parse(this.lifeCycle) : this.lifeCycle
        const lifeCycleValues = Object.values(lifeCycle)
        const exisLifyCycle = lifeCycleValues.filter(x => x)
        if (this.pageType === 'projectCode' && (this.usingFuncCodes.length > 0 || exisLifyCycle.length > 0)) {
            importStr += `import methodsMixin from '@/mixins/methods-mixin'`
        }
        return importStr
    }

    dataTemplate (key, value) {
        this.dataStr += `'${key}': ${value},\n`
    }

    remoteMethodsTemplate (key, payload, chartType = false) {
        const [method, params] = this.getMethodByCode(payload)
        if (method.id) {
            if (chartType) {
                this.remoteDataStr += `const ${key}Remote = await this.${method.funcName}(${params.join(', ')})\nObject.assign(this.${key}, ${key}Remote)\n`
            } else {
                this.remoteDataStr += `this.${key} = await this.${method.funcName}(${params.join(', ')})\n`
            }
        }
        // 处理chartRemote
        if (method.funcCode) this.usingFuncCodes.push(method.funcCode)
    }

    generateCharts (item) {
        const type = item.name.replace('chart-', '')
        this.dataTemplate(item.componentId, JSON.stringify(item.renderProps.options.val))
        if (item.renderProps.remoteOptions && item.renderProps.remoteOptions.payload && item.renderProps.remoteOptions.payload.methodCode) {
            this.remoteMethodsTemplate(item.componentId, item.renderProps.remoteOptions.payload || {}, true)
        }
        if (this.chartTypeArr.indexOf(type) === -1) {
            this.chartTypeArr.push(type)
        }
    }
}

module.exports = {
    async getPageData (targetData, pageType, allCustomMap, funcGroups, lifeCycle, projectId, pageId, layoutContent, isGenerateNav, isEmpty, layoutType, variableList) {
        const pageCode = new PageCode(targetData, pageType, allCustomMap, funcGroups, lifeCycle, projectId, pageId, layoutContent, isGenerateNav, isEmpty, layoutType, variableList)
        let code = ''
        if (pageType === 'vueCode') {
            // 格式化，报错是抛出异常
            code = await VueCodeModel.formatPageCode(pageCode.getCode())
        } else if (pageType === 'preview') {
            // 不需格式化
            code = pageCode.getCode()
        } else {
            // 格式化，报错不抛出异常
            code = await VueCodeModel.formatCode(pageCode.getCode())
        }
        return {
            code,
            methodStrList: pageCode.methodStrList || [],
            codeErrMessage: pageCode.codeErrMessage || ''
        }
    }
}
