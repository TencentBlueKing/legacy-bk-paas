<template>
    <article class="function-market-home">
        <bk-button class="mr5" theme="primary" @click="showMarketFunc.isShow = true" v-if="isAdmin">新增函数</bk-button>
        <bk-input class="fun-search" right-icon="bk-icon icon-search" v-model="searchStr" clearable></bk-input>

        <section class="card-list" v-bkloading="{ isLoading }">
            <bk-card
                v-for="(card, index) in computedCardList"
                :key="index"
                :show-foot="true"
                :show-head="false"
                class="function-card">
                <h3 class="card-title">{{ card.funcName }}</h3>
                <p class="card-body" v-bk-overflow-tips>{{ card.funcSummary }}</p>
                <bk-popconfirm
                    v-if="isAdmin"
                    content="确定删除该函数？"
                    width="280"
                    trigger="click"
                    @confirm="handleDeleteFunc(card)">
                    <i class="bk-icon icon-close delete-card"></i>
                </bk-popconfirm>

                <div slot="footer" class="foot-main">
                    <bk-button text class="foot-btn" @click="handleShowSource(card)">查看源码</bk-button>
                    <bk-divider direction="vertical"></bk-divider>
                    <bk-button text class="foot-btn" @click="handleShowAddFuncFromMarket(card)">添加至项目</bk-button>
                    <template v-if="isAdmin">
                        <bk-divider direction="vertical"></bk-divider>
                        <bk-button text class="foot-btn" @click="handleShowAddFunc(card)">编辑</bk-button>
                    </template>
                </div>
            </bk-card>
            <bk-exception class="exception-wrap-item mt50" type="empty" v-if="cardList.length <= 0"></bk-exception>
        </section>

        <bk-sideslider
            :is-show.sync="showMarketFunc.isShow"
            :quick-close="true"
            :width="796"
            :title="showMarketFunc.func.id ? '编辑函数' : '新增函数'"
            @hidden="clearMarketSideData">
            <func-market slot="content" ref="func" :func-data="showMarketFunc.func" :function-list="cardList"></func-market>
            <section slot="footer" class="add-footer">
                <bk-button theme="primary" @click="submitAddMarketFunc" :loading="showMarketFunc.loading">提交</bk-button>
                <bk-button @click="clearMarketSideData">取消</bk-button>
            </section>
        </bk-sideslider>

        <bk-sideslider
            title="添加至项目"
            :is-show.sync="showAddFuncFromMarket.isShow"
            :quick-close="true"
            :width="796"
            @hidden="clearMarketSideData">
            <add-func slot="content" ref="marketFunc" :func-data="showAddFuncFromMarket.func"></add-func>
            <section slot="footer" class="add-footer">
                <bk-button theme="primary" @click="submitAddFuncFromMarket" :loading="showAddFuncFromMarket.loading">提交</bk-button>
                <bk-button @click="clearMarketSideData">取消</bk-button>
            </section>
        </bk-sideslider>

        <section v-if="showSource.isShow" class="source-function">
            <monaco :read-only="true" height="500" width="800" :value="showSource.code" class="source-code">
                <i class="bk-drag-icon bk-drag-close-line icon-style" slot="tools" @click="showSource.isShow = false"></i>
            </monaco>
        </section>
    </article>
</template>

<script>
    import { mapActions } from 'vuex'
    import monaco from '@/components/methods/monaco'
    import funcMarket from '@/components/methods/func-form/func-market'
    import addFunc from '@/components/methods/func-form/add-func'

    export default {
        components: {
            monaco,
            funcMarket,
            addFunc
        },

        data () {
            return {
                searchStr: '',
                cardList: [],
                isLoading: false,
                showSource: {
                    isShow: false,
                    code: ''
                },
                showMarketFunc: {
                    isShow: false,
                    loading: false,
                    func: {}
                },
                showAddFuncFromMarket: {
                    isShow: false,
                    loading: false,
                    func: {}
                },
                isAdmin: false
            }
        },

        computed: {
            computedCardList () {
                return this.cardList.filter(card => card.funcName.includes(this.searchStr))
            }
        },

        created () {
            this.initData()
        },

        methods: {
            ...mapActions('functionMarket', [
                'getAllFuncFromMarket',
                'addMarketFunc',
                'updateMarketFunc',
                'addFuncToProject',
                'deleteMarketFunc'
            ]),
            ...mapActions('perm', ['isPlatformAdmin']),

            initData () {
                this.getCardList()
                this.isPlatformAdmin().then((res) => {
                    this.isAdmin = res
                })
            },

            getCardList () {
                this.isLoading = true
                this.getAllFuncFromMarket().then((res) => {
                    this.cardList = res
                }).catch((err) => {
                    this.messageError(err.message || err)
                }).finally(() => {
                    this.isLoading = false
                })
            },

            submitAddMarketFunc () {
                this.$refs.func.validate().then((postData) => {
                    this.showMarketFunc.loading = true
                    const curMethod = this.showMarketFunc.func.id ? this.updateMarketFunc : this.addMarketFunc
                    curMethod(postData).then((res) => {
                        if (!res) return
                        this.getCardList()
                        this.clearMarketSideData()
                    }).catch((err) => {
                        this.messageError(err.message || err)
                    }).finally(() => {
                        this.showMarketFunc.loading = false
                    })
                }).catch((validator) => {
                    this.$bkMessage({ message: validator.content || validator, theme: 'error' })
                })
            },

            submitAddFuncFromMarket () {
                this.$refs.marketFunc.validate().then(({ projectId, id, ...rest }) => {
                    this.showAddFuncFromMarket.loading = true
                    const postData = {
                        func: { ...rest },
                        projectId,
                        funcMarketId: id
                    }
                    this.addFuncToProject(postData).then((res) => {
                        this.messageSuccess('添加成功')
                        this.clearMarketSideData()
                    }).catch((err) => {
                        this.messageError(err.message || err)
                    }).finally(() => {
                        this.showAddFuncFromMarket.loading = false
                    })
                }).catch((validator) => {
                    this.$bkMessage({ message: validator.content || validator, theme: 'error' })
                })
            },

            handleDeleteFunc (func) {
                this.deleteMarketFunc(func.id).then(() => {
                    this.messageSuccess('删除成功')
                    this.getCardList()
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            handleShowAddFuncFromMarket (func) {
                this.showAddFuncFromMarket.isShow = true
                this.showAddFuncFromMarket.func = func
            },

            handleShowAddFunc (func) {
                this.showMarketFunc.isShow = true
                this.showMarketFunc.func = func
            },

            clearMarketSideData () {
                this.showMarketFunc = {
                    isShow: false,
                    func: {},
                    loading: false
                }
                this.showAddFuncFromMarket = {
                    isShow: false,
                    func: {},
                    loading: false
                }
            },

            handleShowSource (card) {
                this.showSource.isShow = true
                this.showSource.code = card.funcBody
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .function-market-home {
        padding: 16px 8px 16px 24px;
    }
    .fun-search {
        width: 400px;
    }
    .card-list::after {
        content: '';
        clear: both;
        display: table;
    }
    .function-card {
        margin: 16px 16px 0 0;
        width: 310px;
        height: 186px;
        float: left;
        box-shadow: 0px 2px 2px 0px rgb(0 0 0 / 11%);
        &:hover {
            box-shadow: 1px 2px 8px 2px rgb(0 0 0 / 11%);
        }
        /deep/ .bk-tooltip {
            position: absolute;
            font-size: 20px;
            right: 6px;
            top: 2px;
        }
        /deep/ .bk-card-body {
            height: 139px;
            padding: 16px;
            line-height: 20px;
        }
        .card-title {
            margin: 0;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .card-body {
            font-size: 12px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
            word-break: break-all;
        }
        .foot-main {
            line-height: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            .foot-btn {
                flex: 1;
                height: auto;
            }
            /deep/ .bk-divider {
                margin: 0 !important;
                font-size: 20px;
            }
        }
    }
    .source-function {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 500;
        .source-code {
            position: absolute;
            left: calc(50% - 400px);
            top: calc(50% - 280px);
        }
    }
    .add-footer {
        margin-left: 30px;
        button {
            margin-right: 10px;
        }
    }
</style>
