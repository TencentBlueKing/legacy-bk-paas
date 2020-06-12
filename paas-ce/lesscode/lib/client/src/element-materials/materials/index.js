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

// import layoutDemo from './layout-demo'
// import form from './form'
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
// import collapse from './collapse'
import exception from './exception'
import pagination from './pagination'
import text from './text'
import image from './image'
import zoomImage from './zoom-image'

import chartsLine from './charts-line'
import chartsBar from './charts-bar'
import chartsPie from './charts-pie'

import { customComponentsConfigs } from '@/custom'

export default Object.seal([
    ...customComponentsConfigs,
    grid1,
    grid2,
    grid3,
    grid4,
    // layoutDemo,
    // form,
    input,
    button,
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
    // collapse,
    pagination,
    text,
    image,
    zoomImage,
    chartsLine,
    chartsBar,
    chartsPie
])
