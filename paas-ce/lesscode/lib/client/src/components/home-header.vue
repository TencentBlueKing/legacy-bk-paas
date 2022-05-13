<template>
    <header class="mg-home-header">
        <nav class="mg-home-nav">
            <div class="logo-fixed">
                <div class="brand">
                    <span class="bk-drag-icon app-logo" @click="$router.push('projects')">
                        <svg aria-hidden="true" width="32" height="22">
                            <use xlink:href="#bk-drag-logo"></use>
                        </svg>
                    </span>
                    <h2 class="app-name">蓝鲸可视化开发平台</h2>
                </div>
            </div>
            <div class="nav-container">
                <div class="intro-container">
                    <span v-for="(item, index) in appTabData"
                        @click="handlerTab(index, item.routerName)"
                        :key="item.url" class="app-intro"
                        :class="activeIndex === index ? 'active' : ''">{{item.name}}</span>
                </div>
                <div class="user-info-contain">
                    <div class="name" id="mg-name">{{userName}}
                        <i class="bk-drag-icon bk-drag-angle-up-fill"></i>
                    </div>
                    <div class="user-info">
                        <a href="javascript:" @click="goLogin" class="home-mg-login"> 退出 </a>
                    </div>
                </div>
            </div>
        </nav>
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
                path: 'static_api/v3',
                routerNameData: ['/home', '/help'],
                homeHeaderNav: true,
                appTabData: [{ name: '产品介绍', url: '/home', routerName: 'home' }, { name: '帮助文档', url: '/help', routerName: 'intro' }],
                activeIndex: 0
            }
        },
        computed: {
            ...mapGetters(['user'])
        },
        watch: {
            '$route': {
                handler (value) {
                    if (value.matched[0]) {
                        if (value.name === 'home') {
                            this.activeIndex = 0
                        } else if (value.path.includes('/help')) {
                            this.activeIndex = 1
                        }
                    }
                },
                immediate: true
            }
        },
        mounted () {
            this.userName = this.user.username
        },
        methods: {
            goLogin () {
                window.location.href = this.user.loginRedirectUrl + '&c_url=' + encodeURIComponent(window.location.href)
            },
            handlerTab (i, name) {
                this.$router.push({
                    name
                })
                this.activeIndex = i
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
    .mg-home-header{
        width:100%;
        min-width:1280px;
        height:64px;
        background:#FFF;
        color:#63656E;
        padding:0 32px;
        z-index:1000;
        position:fixed;
        top:0;
        box-shadow: 0px 2px 4px 0px rgba(25,25,41,0.05);
    }

    .mg-home-nav{
        height:64px;
        line-height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .logo-fixed{
        position: fixed;
        left: 0;
        top: 0;
    }

    .mg-home-nav > .logo-fixed > .brand {
        /* display: fixed; */
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .mg-home-nav > .logo-fixed >.brand .app-logo{
        font-size: 0;
        cursor: pointer;
    }

    .mg-home-nav >.logo-fixed > .brand .app-name{
        font-size: 16px;
        font-weight: normal;
        color: #313238;
        margin: 0;
        padding-left: 18px;
        white-space: nowrap;
    }

    .mg-home-nav > .nav-container .intro-container{
        margin-left: 225px;
    }

    .mg-home-nav > .nav-container{
        display: flex;
        max-width: 1920px;
        margin: 0 auto;
        width: 100%;
        justify-content: space-between;
    }

    .mg-home-nav > .nav-container .home-mg-login {
        color: #63656E;
        font-size: 14px;
        cursor: pointer;
    }

    .mg-home-nav > .nav-container .app-intro{
        font-size: 14px;
        font-weight: normal;
        color: #63656e;
        padding-left: 56px;
        cursor: pointer;
    }

    .mg-home-nav > .nav-container .active{
        font-size: 14px;
        font-weight: 700;
        color: #3A84FF;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
    }

    .user-info-contain{
        position: relative;
    }

    .user-info{
        position: absolute;
        width: 135px;
        background: #fff;
        text-align: center;
        left: -40px;
        top: 62px;
        opacity: 0;
        visibility: hidden;
        border: solid 1px #eeeeee;
        border-radius: 2px;
        transition: all .3s;
        box-shadow: 0 2px 5px #e5e5e5;
    }

    #mg-name{
        cursor: pointer;
    }

    #mg-name:hover {
        color: #3A84FF;
    }

    .user-info-contain:hover .user-info {
        opacity: 1;
        visibility: visible;
    }

</style>
