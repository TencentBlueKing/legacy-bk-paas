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
import iconList from './icon-list'

import block from '../bk/block'
import grid from '../bk/grid'
import freeLayout from '../bk/free-layout'

// Basic
import button from './button'
import link from './link'

// Form
import radioGroup from './radio-group'
import checkboxGroup from './checkbox-group'
import input from './input'
import inputNumber from './input-number'
import select from './select'
import cascade from './cascade'
import switcher from './switcher'
import slider from './slider'
import timePicker from './time-picker'
import datePicker from './date-picker'
import upload from './upload'
import rate from './rate'
import colorPicker from './color-picker'
import transfer from './transfer'

// 数据
import table from './table'
import tagInput from './tag-input'
import progress from './progress'
import tree from './tree'
import pagination from './pagination'
import badge from './badge'
import avatar from './avatar'

// 反馈
import alert from './alert'

// 导航
import tab from './tab'
import breadcrumb from './bread-crumb'
import steps from './steps'

// 其他
import tooltip from './tooltip'
import card from './card'
import carousel from './carousel'
import timeline from './timeline'
import image from './image'

const elementComponents = Object.seal([
    block,
    grid,
    freeLayout,
    button,
    link,
    radioGroup,
    checkboxGroup,
    input,
    inputNumber,
    select,
    cascade,
    switcher,
    slider,
    timePicker,
    datePicker,
    upload,
    rate,
    colorPicker,
    transfer,
    table,
    tagInput,
    progress,
    tree,
    pagination,
    badge,
    avatar,
    alert,
    tab,
    breadcrumb,
    steps,
    tooltip,
    card,
    carousel,
    timeline,
    image,
    ...iconList
])

export default elementComponents

export const elementComponentGroupList = Array.from(new Set(elementComponents.map(item => item.group)))
