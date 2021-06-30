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

import grid1 from './grid/column1'
import grid2 from './grid/column2'
import grid3 from './grid/column3'
import grid4 from './grid/column4'

import input from './input'
import button from './button'
import steps from './steps'
import switcher from './switcher'
import datePicker from './date-picker'
import timePicker from './time-picker'
import upload from './upload'
import timeline from './timeline'
import progress from './progress'
import roundProgress from './round-progress'
import animateNumber from './animate-number'
import rate from './rate'
import slider from './slider'
import tab from './tab'
import radioGroup from './radio-group'
import radioButtonGroup from './radio-button-group'
import checkboxGroup from './checkbox-group'
import table from './table'
import diff from './diff'
import swiper from './swiper'
import tree from './tree'
import select from './select'
import tagInput from './tag-input'
import searchSelect from './search-select'
import transfer from './transfer'
import badge from './badge'
import exception from './exception'
import pagination from './pagination'
import text from './text'
import image from './image'
import zoomImage from './zoom-image'
import link from './link'
import process from './process'
import colorPicker from './color-picker'
import cascade from './cascade'
import bigTree from './big-tree'
import alert from './alert'
import card from './card'
import popover from './popover'
import popconfirm from './popconfirm'
import breadCrumb from './bread-crumb'
import paragraph from './paragraph'
import divider from './divider'

import chartsLine from './charts-line'
import chartsBar from './charts-bar'
import chartsPie from './charts-pie'
import bkChartsLine from './bk-charts-line'
import bkChartsBar from './bk-charts-bar'
import bkChartsPie from './bk-charts-pie'
import bkChartsRadar from './bk-charts-radar'
import bkChartsBubble from './bk-charts-bubble'
import bkChartsScatter from './bk-charts-scatter'

import freeLayout from './free-layout'
import form from './form'

import dialog from './dialog'
import sideslider from './sideslider'

// 这个对象里组件的顺序与页面左侧待选组件区的顺序一致，从左至右，从上至下
// 是为了要保证 Array.from(new Set(bkComponents.map(item => item.group))) 得到的结果是
// ['布局', '基础', '表单', '导航', '数据', '反馈', '图表']
const bkComponents = Object.seal([
    grid1,
    grid2,
    grid3,
    grid4,
    paragraph,
    button,
    text,
    image,
    link,
    input,
    breadCrumb,
    steps,
    switcher,
    datePicker,
    timePicker,
    upload,
    timeline,
    progress,
    roundProgress,
    animateNumber,
    rate,
    slider,
    tab,
    radioGroup,
    checkboxGroup,
    radioButtonGroup,
    diff,
    swiper,
    tree,
    select,
    tagInput,
    searchSelect,
    transfer,
    badge,
    table,
    exception,
    pagination,
    zoomImage,
    process,
    colorPicker,
    cascade,
    bigTree,
    alert,
    card,
    popover,
    popconfirm,
    chartsLine,
    chartsBar,
    chartsPie,
    dialog,
    freeLayout,
    form,
    divider,
    sideslider,
    bkChartsLine,
    bkChartsBar,
    bkChartsPie,
    bkChartsRadar,
    bkChartsBubble,
    bkChartsScatter
])

export default bkComponents

export const bkComponentGroupList = Array.from(new Set(bkComponents.map(item => item.group)))
