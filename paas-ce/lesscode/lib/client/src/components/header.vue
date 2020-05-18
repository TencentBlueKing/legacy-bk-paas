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
        <a href="https://magicbox.bk.tencent.com/static_api/v3/main/index.html" class="mg-logo">
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
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html">jQuery组件1.0</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#index?isPro=1">jQuery组件2.0</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/components_vue/2.0/example/index.html#/">Vue组件</a>
                                </dd>
                            </ol>
                            <ol>
                                <dt>移动端</dt>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#mobile/show">jQuery组件</a>
                                </dd>
                            </ol>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="javascript: void(0);">可视化开发</a>
                        <div class="mg-sub-nav">
                            <ol>
                                <dt>PC端</dt>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#build/show">jQuery组件</a>
                                </dd>
                            </ol>
                            <ol>
                                <dt>移动端</dt>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#mobile_build/show">jQuery组件</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#wx_build/show">微信小程序</a>
                                </dd>
                            </ol>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#templates">套餐样例</a>
                    </li>
                    <li class="nav-item">
                        <a href="javascript: void(0);">帮助</a>
                        <div class="mg-sub-nav">
                            <ol>
                                <dt>规范</dt>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#doc/show?id=html_structure">前端规范</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#design">设计规范</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#css">辅助样式</a>
                                </dd>
                            </ol>
                            <ol>
                                <dt>下载</dt>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#about/show">模板下载</a>
                                </dd>
                                <dd>
                                    <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#plugin">组件包下载</a>
                                </dd>
                            </ol>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="https://magicbox.bk.tencent.com/static_api/v3/index.html#start">新手起步</a>
                    </li>
                </ul>
            </nav>
        </div>

        <div class="magic-button">
            <a href="javascript:;" class="magic-top" id="mg-top" @click="handleGoTop" style="opacity: 0;">
                <img src="../images/back_top.png" data-src="../images/back_top.png">
            </a>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'app-header',
        data () {
            return {
                isTop: true,
                timer: 0
            }
        },
        computed: {
        },
        mounted () {
            this.init()
        },
        methods: {
            // 初始化底部工具（反馈、回到头部）
            initFootTools () {
                console.log(1)
                const topBtn = document.getElementById('mg-top')
                this.isTop = true
                // 滚动条滚动时触发
                window.onscroll = function () {
                    // 在滚动的时候增加判断,忘了的话很容易出错
                    const osTop = document.documentElement.scrollTop || document.body.scrollTop
                    if (osTop >= 200) {
                        topBtn.style.opacity = '1'
                    } else {
                        topBtn.style.opacity = '0'
                    }
                    if (!this.isTop) {
                        clearInterval(this.timer)
                    }
                    this.isTop = false
                }
            },

            handleGoTop () {
                this.isTop = false
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    const osTop = document.documentElement.scrollTop || document.body.scrollTop
                    // 减小的速度
                    const isSpeed = Math.floor(-osTop / 6)
                    document.documentElement.scrollTop = document.body.scrollTop = osTop + isSpeed
                    // 判断，然后清除定时器
                    if (osTop < 200) {
                        console.log('clear')
                        clearInterval(this.timer)
                    }
                    this.isTop = true
                }, 30)
            },

            // 初始化
            init () {
                this.initFootTools()
            }
        }
    }
</script>

<style lang="postcss" scoped>
    $navColor: #FFF;
    $f16: 16px;
    $f14: 14px;
    $f13: 13px;
    $f12: 12px;

    html,
    body,
    div,
    p,
    ul,
    li,
    h1,
    h2,
    h3 {
        padding: 0;
        margin: 0;
    }

    strong {
        font-weight: normal;
    }

    a {
        text-decoration: none;
    }

    img {
        vertical-align: middle;
    }
    * {
        box-sizing: border-box;
        outline: none;
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    .f16 {
        font-size: $f16;
    }

    .f14 {
        font-size: $f14;
    }

    .f13 {
        font-size: $f13;
    }

    .f12 {
        font-size: $f12;
    }

    .hide {
        display: none;
    }

    .show {
        display: block;
    }

    .mg-header {
        width: 100%;
        min-width: 1280px;
        height: 64px;
        background: #14182F;
        color: #FFF;
        padding: 0 32px;
        z-index: 1000;
        position: fixed;
        top: 0;

        .mg-header-right {
            float: right;
        }
    }

    .mg-logo {
        float: left;
        height: 64px;
        color: #FFF;
        font-size: 18px;
        padding-top: 10px;

        .logo {
            vertical-align: middle;
            height: 44px;
            margin-right: 2px;
        }

        .logo-text {
            vertical-align: middle;
            height: 32px;
            margin-right: 15px;
        }

        strong {
            vertical-align: middle;
            line-height: 31px;
            border-left: 1px solid rgba(255, 255, 255, .3);
            padding-left: 15px;
            color: #FFF;
        }

    }

    .mg-nav {
        float: left;
        margin: 20px 0 0 0;
        border-right: 1px solid #373839;

        > ul {
            list-style: none;
            float: right;

            &::after {
                content: '';
                display: inline-block;
                clear: both;
            }

            li {
                float: left;
                padding: 0 24px;
                position: relative;

                &:hover {
                    .mg-sub-nav {
                        display: flex;
                    }

                    > a {
                        color: #4F94FE;
                    }
                }
            }

            a {
                color: $navColor;
                line-height: 14px;
                text-decoration: none;
                font-size: 14px;
                transition: color ease 0.3s;

                &:hover {
                    color: #4F94FE;
                }
            }
        }

        .mg-sub-nav {
            width: 310px;
            background: #14182F;
            position: absolute;
            padding: 25px;
            justify-content: space-between;
            display: none;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 4px;
            opacity: 0;
            animation: fadeIn forwards ease 0.5s;
            color: #C4C6CC;

            > ol {
                min-width: 110px;
                float: left;
                padding: 0;
                margin: 15px 0 0;

                dt {
                    font-size: 14px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, .3);
                    margin-bottom: 8px;
                }

                dd {
                    color: #FFF;
                    font-size: $f12;
                    line-height: 30px;
                    padding: 0;
                    margin: 0;
                    text-align: left;

                    > a {
                        line-height: 30px;
                    }
                }
            }
        }
    }

    .mg-user {
        min-width: 100px;
        float: left;
        margin: 19px 0 0 0;
        padding-left: 24px;
        font-size: 14px;
        color: $navColor;

        .avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 5px;
        }
    }

    .mg-login {
        float: left;
        line-height: 28px;
        margin: 19px 0 0 24px;
        font-size: 14px;
        color: $navColor;

        &:hover {
            color: #FFF;
        }
    }

    .magic-button{
        position: fixed;
        right: 10px;
        bottom: 50px;
        a {
            display: block;
            width: 30px;
            height: 30px;
            line-height: 26px;
            text-align: center;
            background: #9a9a9a;
            border-radius: 2px;
            opacity: 0.7;
            &:hover{
                background: #454545;
            }

            > img {
                width: 16px;
            }
        }
        .magic-feedback{
            margin-top: 5px;
        }
    }

    @media screen and (max-width: 1980px) {
        body {
            background-size: 55% auto;
        }
    }

    @media screen and (max-width: 1680px) {
        .my-components {
            margin-bottom: 50px;
        }

    }

    @media screen and (max-width: 1280px) {
        .mg-user,
        .mg-login,
        .mg-nav > ul a,
        .mg-nav .mg-sub-nav > ol dt {
            font-size: $f12;
        }

        .mg-nav > ul a {
            font-size: $f12;
        }

        .mg-nav .mg-sub-nav {
            padding: 15px 25px;
        }
    }

    @keyframes expand {
        from {
            width: 10%;
        }

        to {
            width: 100%;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes fadeInDown {
        0% {
            top: -20px;
            opacity: 0;
        }

        100% {
            top: 5px;
            opacity: 1;
        }
    }

    @keyframes fadeOutDown {
        0% {
            top: 10px;
            opacity: 1;
        }

        5% {
            opacity: 0.2;
        }

        100% {
            top: 100px;
            opacity: 0;
        }
    }
</style>
