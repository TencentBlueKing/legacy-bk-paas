<template>
    <mg-content-loader :is-loading="isLoading" placeholder="index-loading" :offset-top="0" :height="378">
        <div :class="isLoading ? 'hide-container-height' : 'home-container'">
            <div class="banner">
                <div class="img-container">
                    <img class="banner-img" src="../../images/banner.png" alt="">
                    <div class="btn-group">
                        <bk-button
                            class="mt10 banner-btn"
                            theme="primary"
                            @click="handlerRouter('projects')"
                        >立即体验</bk-button>
                        <bk-button
                            class="mt10 banner-btn help-btn"
                            @click="handlerRouter('intro')"
                        >帮助文档</bk-button>
                    </div>
                </div>
            </div>
            <div class="product-info home-name">
                <div class="title">产品特性</div>
                <div class="info-list">
                    <div class="info-item" v-for="(item, index) in productList" :key="index">
                        <div class="info-title">{{item.name}}</div>
                        <div class="info-desc">{{item.desc}}</div>
                        <img class="info-img" :src="item.image" alt="">
                    </div>
                </div>
            </div>
            <div class="edu-info home-name">
                <div class="title">应用搭建更简单</div>
                <div class="edu-container">
                    <div class="left">
                        <div class="left-title">内置丰富的组件及模板</div>
                        <div class="item" v-for="(item, index) in leftNavList" :key="index">
                            <div class="name">{{item.name}}</div>
                            <div class="desc">{{item.desc}}</div>
                        </div>
                    </div>
                    <div class="right">
                        <img class="edu-gif" src="https://staticfile.qq.com/bk-magicbox/p980b75e8cd354cf89856e3e2733e2aa1/latest/animation.gif" alt="">
                    </div>
                </div>
            </div>
            <div class="product-info home-name">
                <div class="title">覆盖场景更丰富</div>
                <div class="info-list">
                    <div class="info-item" v-for="(item, index) in scenesList" :key="index">
                        <div class="info-title">{{item.name}}</div>
                        <div class="info-desc">{{item.desc}}</div>
                        <img class="info-img" :src="item.image" alt="">
                    </div>
                </div>
            </div>
            <div class="example-info home-name">
                <div class="title">用户案例</div>
                <div class="example-container">
                    <div class="left">
                        <img :src="exampleImg" alt="">
                    </div>
                    <div class="right">
                        <div class="item"
                            :class="actionIndex === index ? 'active' : ''"
                            v-for="(item, index) in rightNavList"
                            :key="index"
                            @mouseenter="handlerMouseenter(index)">
                            <div class="name">{{item.name}}</div>
                            <div class="desc">{{item.desc}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-info home-name">
                <div class="title">一站式开发管理，让开发更简单</div>
                <div class="subtitle">简单上手</div>
                <bk-button
                    class="mt10 bottom-btn"
                    theme="primary"
                    @click="handlerRouter('projects')"
                >立即体验</bk-button>
            </div>
            <div class="footer">
                <div class="frameList">
                    <div>常用框架</div>
                    <div class="item" v-for="(item, index) in frameList" :key="index">
                        <img class="frame-icon" :src="item.icon" alt="">
                        <div class="frame-name" @click="handlerToWeb(item)">{{item.name}}</div>
                    </div>
                </div>
                <a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDgwMjAwMV80NDMwOTZfODAwODAyMDAxXzJf"
                    target="_blank"
                    class="magic-feedback"
                    title="QQ交谈">
                    <img src="../../images/qq.png" />
                    <span>QQ交谈</span>
                </a>
                <!-- <a href="wxwork://message/?username=BK-MagicBox" class="magic-feedback" title="蓝鲸MagicBox助手">
                <img src="../../images/wx-work.png" />
                <span>蓝鲸MagicBox助手</span>
            </a> -->
                Copyright &copy; 2012-{{currentYear}} Tencent BlueKing. All Rights Reserved. 腾讯蓝鲸 版权所有
            </div>
        </div>
    </mg-content-loader>
</template>

<script>
    export default {
        data () {
            return {
                data: [],
                isLoading: true,
                btnData: [],
                productList: [
                    {
                        name: '可视化编排布局',
                        desc: '拖拽布局，所见即所得，简单易上手',
                        image: require('../../images/layout.png')
                    },
                    {
                        name: '丰富的资源',
                        desc: '模板、组件、函数、数据源等资源助力提质提效',
                        image: require('../../images/resource.png')
                    },
                    {
                        name: '在线调试',
                        desc: '在线编码、调试、预览效果，效率更高',
                        image: require('../../images/debug.png')
                    },
                    {
                        name: '一键部署',
                        desc: '细分环境，应用托管，免运维',
                        image: require('../../images/deploy.png')
                    }
                ],
                leftNavList: [
                    {
                        name: '组件库',
                        desc: 'MagicBox 组件、Element 组件、业务组件及自定义开发组件'
                    },
                    {
                        name: '图标库',
                        desc: '连接蓝鲸丰富的图标资源，直接引用'
                    },
                    {
                        name: '模板库',
                        desc: '应用模板、页面模板、自定义模板，快速生成应用'
                    },
                    {
                        name: '函数库',
                        desc: '丰富的数据处理、事件处理函数，拿来即用'
                    },
                    {
                        name: '图表库',
                        desc: '集成Echarts、BKCharts，满足基础图表场景需求'
                    }
                ],
                scenesList: [
                    {
                        name: '流程类',
                        desc: '支持各类复杂场景流程设计',
                        image: require('../../images/process.png')
                    },
                    {
                        name: '表单类',
                        desc: '支持表单页设计与数据管理',
                        image: require('../../images/form.png')
                    },
                    {
                        name: '门户类',
                        desc: '支持各类门户场景应用搭建',
                        image: require('../../images/portal.png')
                    },
                    {
                        name: '用户 DIY',
                        desc: '支持自定义各类业务场景应用搭建',
                        image: require('../../images/diy.png')
                    }
                ],
                rightNavList: [
                    // {
                    //     name: 'TQOS 运营平台',
                    //     desc: '运营类',
                    //     image: require('../../images/TQOS.png')
                    // },
                    // {
                    //     name: 'ijob 平台公告',
                    //     desc: '运营类',
                    //     image: require('../../images/TQOS.png')
                    // },
                    {
                        name: '蓝鲸 MagicBox',
                        desc: '官网类',
                        image: require('../../images/Magicbox.png')
                    },
                    {
                        name: '游戏导播平台',
                        desc: '门户类',
                        image: require('../../images/game.png')
                    },
                    {
                        name: 'GPU闲时复用平台',
                        desc: '运营类',
                        image: require('../../images/gpu-product.png')
                    }
                ],
                frameList: [
                    {
                        name: 'Bootstrap3',
                        icon: require('../../images/bs.png'),
                        href: 'https://v3.bootcss.com/'
                    },
                    {
                        name: 'kendo UI',
                        icon: require('../../images/kendo.png'),
                        href: 'https://demos.telerik.com/kendo-ui/'
                    },
                    {
                        name: 'kendo UI Demo',
                        icon: require('../../images/kendo.png'),
                        href: 'http://open.oa.com/static_api/v3/assets/kendoui-2015.2.624/examples/index.html'
                    },
                    {
                        name: 'Vue.js',
                        icon: require('../../images/vue.png'),
                        href: 'https://cn.vuejs.org/'
                    },
                    {
                        name: 'React',
                        icon: require('../../images/react.png'),
                        href: 'https://reactjs.org/'
                    },
                    {
                        name: 'AngularJS',
                        icon: require('../../images/angular.png'),
                        href: 'https://angularjs.org/'
                    }
                ],
                currentYear: new Date().getUTCFullYear(),
                actionIndex: 0
            }
        },
        computed: {
            exampleImg () {
                return this.rightNavList[this.actionIndex].image
            }
        },
        created () {
            
        },
        mounted () {
            this.isLoading = false
        },
        methods: {
            async handlerToWeb (data) {
                window.open(data.href, '_blank')
            },
            async handlerMouseenter (i) {
                this.actionIndex = i
            },
            async handlerRouter (name) {
                this.$router.push({
                    name
                })
            }
        }
    }
</script>
<style lang="postcss">
    .hide-container-height{
        height: 100vh;
    }
    .home-container{
        --side-hd-height: 52px;
        --side-ft-height: 50px;
        --aside-width: 258px;
        --footer-height: 196px;
        --breadcrumb-height: 52px;
        --aside-folded-width: 60px;
        min-width: 1280px;
        margin-top: 64px;
        .banner{
            width: 100%;
            background: linear-gradient(to right, #DAE5F1 20% , #F9F9FA 78%);
            .img-container{
                text-align: center;
                position: relative;
                width: 100%;
                max-width: 1920px;
                margin: 0 auto;
                .banner-img{
                    width: 100%;
                    max-width: 1920px;
                }
                .btn-group{
                    position: absolute;
                    left: 15%;
                    top: 56%;
                    .banner-btn{
                        width: 190px;
                        height: 50px;
                        border-radius: 25px;
                        font-size: 18px;
                    }
                    .help-btn{
                        margin-left: 17px;
                    }
                }
            }
        }
        .home-name{
            text-align: center;
            .title{
                color: #313238;
                font-size: 32px;
                font-family: PingFangSC, PingFangSC-Semibold;
                padding: 64px 0 40px 0;
            }
        }
        .product-info{
            height: 485px;
            .info-list{
                display: flex;
                justify-content: center;
                .info-item{
                    width: 308px;
                    margin-right: 16px;
                    background: #f3f3f6;
                    border-radius: 2px;
                    height: 270px;
                    .info-title{
                        padding: 40px 0 8px 0;
                        color: #313238;
                        font-size: 20px;
                        font-family: PingFangSC, PingFangSC-Semibold;
                        font-weight: 600;
                    }
                    .info-desc{
                        padding-bottom: 26px;
                    }
                    .info-img{
                        height: 147px;
                    }
                }
            }
        }

        .edu-info{
            height: 850px;
            background-image: url(../../images/home-bg.png);
            background-size: 100% 100%;
            width: 100%;
            .edu-bg{
                width: 100%;
            }
            .edu-container{
                width: 1294px;
                margin: 0 auto;
                display: flex;
                .left{
                    width: 300px;
                    padding: 32px 32px 0 32px;
                    text-align: left;
                    color: #313238;
                    background:rgba(255, 255, 255, 0.5);
                    border-radius: 2px 0px 0px 2px;
                    .left-title{
                       font-size: 22px;
                        font-family: PingFangSC, PingFangSC-Medium;
                        font-weight: 500;
                        padding-bottom: 32px;
                    }
                    .item{
                        padding-bottom: 35px;
                        .name{
                            font-size: 16px;
                            font-weight: 500;
                            padding-bottom: 4px;
                        }
                        .desc{
                            font-size: 13px;
                            font-family: PingFangSC, PingFangSC-Regular;
                            font-weight: 400;
                            color: #979ba5;
                        }
                    }
                }
                .right{
                    flex: 1;
                    background: #fff;
                    .edu-gif{
                        height: 620px;
                        width: 100%;
                    }
                }
            }
        }

        .example-info{
            height: 684px;
            background: linear-gradient(315deg,#f4f7fa 3%, #e5ecf4 78%);
            .example-container{
                display: flex;
                justify-content: center;
                .left{
                    width: 802px;
                    background: #fff;
                    margin-right: 10px;
                    padding: 16px;
                    border-radius: 16px;
                }
                .right{
                    background: #fff;
                    width: 332px;
                    padding: 24px;
                    border-radius: 2px 0px 0px 2px;
                    text-align: left;
                    .item{
                        padding: 12px 24px;
                        cursor: pointer;
                        margin-bottom: 15px;
                        .name{
                            color: #313238;
                            font-size: 16px;
                            font-weight: 500;
                            padding-bottom: 4px;
                        }
                        .desc{
                            font-size: 13px;
                            font-family: PingFangSC, PingFangSC-Regular;
                            font-weight: 400;
                            color: #979ba5;
                        }
                    }
                    .active{
                        border-radius: 4px;
                        background: #e1ecff;
                        color: #3a84ff;
                    }
                }
            }
        }

        .bottom-info{
            height: 420px;
            background-image: url(../../images/footer-bg.png);
            background-size: 100% 100%;
            width: 100%;
            .title{
                padding: 130px 0 19px 0;
            }
            .subtitle{
                padding-bottom: 26px;
                color: #313238;
                font-size: 16px;
            }
            .bottom-btn{
                width: 180px;
                border-radius: 2px;
                font-size: 16px;
                height: 40px;
            }
        }

        .footer {
            width: 100%;
            font-size: 12px;
            color: #7f7c97;
            background:#14182F;
            height: var(--footer-height);
            border-top: 1px solid #DCDEE5;
            text-align: center;
            transition: padding .2s cubic-bezier(0.4, 0, 0.2, 1);

            .frameList {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 53px 0 33px 0;
                .item{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .frame-icon{
                        margin-right: 10px;
                        margin-left: 40px;
                    }
                    .frame-name{
                        cursor: pointer;
                    }
                    .frame-name:hover{
                        color: #fff;
                    }
                }
            }
            .magic-feedback {
                color: #63656E;
                border-right: 1px solid #ddd;
                margin-right: 6px;
                padding-right: 10px;
                img {
                    width: 17px;
                    vertical-align: middle;
                    margin-top: -2px;
                }
            }
        }
    }
</style>
