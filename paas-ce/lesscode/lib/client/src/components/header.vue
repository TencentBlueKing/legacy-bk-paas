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
    <header class="mg-header">
        <a :href="`${host}/${path}/main/index.html`" class="mg-logo">
            <img class="logo" src="../images/svg/bk-logo.svg" data-src="../images/bk-logo.svg">
            <img class="logo-text" src="../images/svg/bk-text.svg" data-src="../images/bk-text.svg">
            <strong>MagicBox</strong>
        </a>
        <div class="mg-header-right">
            <nav class="mg-nav">
                <ul>
                    <li class="nav-item">
                        <a href="javascript: void(0);">组件库</a>
                        <div class="mg-sub-nav">
                            <ol>
                                <dt>PC端</dt>
                                <dd>
                                    <a :href="`${host}/${path}/index.html`" :data-active="`${host}/${path}/index.html#detail/show\\?id=\\S+?&isPro=0`">jQuery组件1.0</a>
                                </dd>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#index?isPro=1`" :data-active="`${host}/${path}/index.html#detail/show\\?id=\\S+?&isPro=1`">jQuery组件2.0</a>
                                </dd>
                                <dd>
                                    <a :href="`${host}/${path}/components_vue/2.0/example/index.html`" :data-active="`/components_vue/\\S+?/`">Vue组件</a>
                                </dd>
                            </ol>
                            <ol>
                                <dt>移动端</dt>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#mobile/show`" :data-active="`${host}/${path}/index.html#mobile_detail/show\\?id=\\S+?`">jQuery组件</a>
                                </dd>
                                <dd>
                                    <a target="_blank" href="https://developers.weixin.qq.com/miniprogram/dev/component/">微信小程序官方组件</a>
                                </dd>
                            </ol>
                        </div>
                    </li>
                    <li class="nav-item active">
                        <a href="javascript: void(0);">可视化开发</a>
                        <div class="mg-sub-nav">
                            <ol>
                                <dt>PC端</dt>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#build/show`">jQuery组件</a>
                                </dd>
                                <dd>
                                    <a class="active" target="_blank" href="https://github.com/Tencent/bk-PaaS/blob/lesscode-master/paas-ce/lesscode/README.md">Vue组件</a>
                                </dd>
                            </ol>
                            <ol>
                                <dt>移动端</dt>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#mobile_build/show`">jQuery组件</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#wx_build/show">微信小程序</a>
                                </dd>
                            </ol>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a :href="`${host}/${path}/index.html#templates`">套餐样例</a>
                    </li>
                    <li class="nav-item">
                        <a href="javascript: void(0);">帮助</a>
                        <div class="mg-sub-nav">
                            <ol>
                                <dt>规范</dt>
                                <dd>
                                    <a href="https://bk.tencent.com/docs/document/5.1/19/4125" target="_blank">前端规范</a>
                                </dd>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#design`">设计规范</a>
                                </dd>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#css`">辅助样式</a>
                                </dd>
                            </ol>
                            <ol>
                                <dt>下载</dt>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#about/show`">模板下载</a>
                                </dd>
                                <dd>
                                    <a :href="`${host}/${path}/index.html#plugin`">组件包下载</a>
                                </dd>
                            </ol>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a :href="`${host}/${path}/index.html#start`">新手起步</a>
                    </li>
                    <li>
                        <a href="https://bk.tencent.com/s-mart/community" target="_blank">论坛交流</a>
                    </li>
                </ul>
            </nav>

            <template v-if="userName">
                <div class="mg-user" id="mg-user">
                    <strong class="name" id="mg-name">{{userName}}</strong>
                </div>
                <a href="javascript: void(0);" class="mg-login" @click="goLogin">退出</a>
            </template>
            <template v-else>
                <a href="javascript: void(0);" class="mg-login" @click="goLogin">登录</a>
            </template>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'app-header',
        data () {
            return {
                userName: '',
                host: 'https://magicbox.bk.tencent.com',
                path: 'static_api/v3'
            }
        },
        computed: {
            ...mapGetters(['user'])
        },
        mounted () {
            this.userName = this.user.username
        },
        methods: {
            goLogin () {
                window.location.href = this.user.loginRedirectUrl + '&c_url=' + encodeURIComponent(window.location.href)
            }
        }
    }
</script>

<style scoped>
    html,body,div,p,ul,li,h1,h2,h3 {
        padding:0;
        margin:0;
    }
    strong {
        font-weight:normal;
    }
    a {
        text-decoration:none;
    }
    img {
        vertical-align:middle;
    }
    * {
        box-sizing:border-box;
        outline:none;
    }
    .fl {
        float:left;
    }
    .fr {
        float:right;
    }
    .f16 {
        font-size:16px;
    }
    .f14 {
        font-size:14px;
    }
    .f13 {
        font-size:13px;
    }
    .f12 {
        font-size:12px;
    }
    .hide {
        display:none;
    }
    .show {
        display:block;
    }
    .mg-header {
        width:100%;
        min-width:1280px;
        height:64px;
        background:#14182F;
        color:#FFF;
        padding:0 32px;
        z-index:1000;
        position:fixed;
        top:0;
    }
    .mg-header .mg-header-right {
        float:right;
    }
    .mg-logo {
        float:left;
        height:64px;
        color:#FFF;
        font-size:18px;
        padding-top:10px;
    }
    .mg-logo .logo {
        vertical-align:middle;
        height:44px;
        margin-right:2px;
    }
    .mg-logo .logo-text {
        vertical-align:middle;
        height:32px;
        margin-right:15px;
    }
    .mg-logo strong {
        vertical-align:middle;
        line-height:31px;
        border-left:1px solid rgba(255,255,255,0.3);
        padding-left:15px;
        color:#FFF;
    }
    .mg-nav {
        float:left;
        margin:23px 0 0 0;
        border-right:1px solid #373839;
    }
    .mg-nav > ul {
        list-style:none;
        float:right;
    }
    .mg-nav > ul::after {
        content:'';
        display:inline-block;
        clear:both;
    }
    .mg-nav > ul li {
        float:left;
        padding:0 24px;
        position:relative;
    }
    .mg-nav > ul li:hover .mg-sub-nav {
        display:flex;
    }
    .mg-nav > ul li:hover > a {
        color:#4F94FE;
    }
    .mg-nav > ul li.active > a {
        color:#4F94FE;
    }
    .mg-nav > ul li.active::after {
        content:'';
        position:absolute;
        left:0;
        top:37px;
        width:calc(100% - 44px);
        height:4px;
        margin-left:22px;
        background:#4F94FE;
    }
    .mg-nav > ul li.active:hover::after {
        display:none;
    }
    .mg-nav > ul a {
        color:#FFF;
        line-height:14px;
        text-decoration:none;
        font-size:14px;
        transition:color ease 0.3s;
    }
    .mg-nav > ul a:hover,.mg-nav > ul a.active {
        color:#4F94FE;
    }
    .mg-nav .mg-sub-nav {
        width:310px;
        background:#14182F;
        position:absolute;
        padding:25px;
        justify-content:space-between;
        display:none;
        left:50%;
        transform:translateX(-50%);
        border-radius:4px;
        opacity:0;
        animation:fadeIn forwards ease 0.5s;
        color:#C4C6CC;
    }
    .mg-nav .mg-sub-nav > ol {
        min-width:110px;
        float:left;
        padding:0;
        margin:15px 0 0;
    }
    .mg-nav .mg-sub-nav > ol dt {
        font-size:14px;
        padding-bottom:10px;
        border-bottom:1px solid rgba(255,255,255,0.3);
        margin-bottom:8px;
    }
    .mg-nav .mg-sub-nav > ol dd {
        color:#FFF;
        font-size:12px;
        line-height:30px;
        padding:0;
        margin:0;
        text-align:left;
    }
    .mg-nav .mg-sub-nav > ol dd > a {
        line-height:30px;
    }
    .mg-nav .mg-sub-nav > ol dd > span {
        font-size:14px;
        color:#ccc;
    }
    .mg-nav .mg-sub-nav.more {
        width:auto;
        padding:18px;
    }
    .mg-nav .mg-sub-nav.more > ol {
        min-width:86px;
    }
    .mg-user {
        min-width:100px;
        float:left;
        margin:23px 0 0 0;
        padding-left:24px;
        font-size:14px;
        color:#FFF;
    }
    .mg-login {
        float:left;
        line-height:28px;
        margin:18px 0 0 24px;
        font-size:14px;
        color:#FFF;
    }
    .mg-login:hover {
        color:#FFF;
    }
    @media screen and (max-width:1980px) {
        body {
            background-size:55% auto;
        }
    }
    @media screen and (max-width:1680px) {
        .my-components {
            margin-bottom:50px;
        }
    }
    @media screen and (max-width:1280px) {
        .mg-user,.mg-login,.mg-nav > ul a,.mg-nav .mg-sub-nav > ol dt {
            font-size:12px;
        }
        .mg-nav > ul a,.mg-nav .mg-sub-nav > ol dd > span {
            font-size:12px;
        }
        .mg-nav .mg-sub-nav {
            padding:15px 25px;
        }
    }
</style>
