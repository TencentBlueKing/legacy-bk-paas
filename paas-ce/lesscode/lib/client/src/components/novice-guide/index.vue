<template>
    <transition name="guide-fade">
        <div v-if="!isDone" ref="wraper" class="novice-guide">
            <div
                v-if="!isShowFinisheDialog && !isShowStopDialog"
                ref="tip"
                class="step-box"
                :class="placement"
                :style="tipStyles">
                <div class="step-title">{{ currentStep.title }}（{{ currentStepNum }}/{{ data.length }}）</div>
                <div class="step-content">{{ currentStep.content }}</div>
                <div class="step-action">
                    <template v-if="!isLast">
                        <div class="action-text" @click="handleStop">跳过</div>
                        <div class="action-btn" @click="handleNext">下一步</div>
                    </template>
                    <div v-else class="action-btn" @click="handleFinish">完成</div>
                </div>
                <div class="target-arrow"></div>
            </div>
            <div v-if="isShowFinisheDialog" class="guide-finished-box">
                <div class="wraper">
                    <div class="flag">
                        <i class="bk-icon icon-check-1" />
                    </div>
                    <div style="font-size: 24px; line-height: 31px; color: #313238">恭喜完成学习!</div>
                    <div style="margin-top: 8px; font-size: 14px; line-height: 19px; color: #979BA5">{{ doneCountTime }} 秒后弹窗自动消失</div>
                    <div style="margin-top: 20px">
                        <span style="font-size: 14px; line-height: 19px; color: #3480FF; cursor: pointer" @click="handleDone">立即体验</span>
                    </div>
                </div>
            </div>
            <div v-if="isShowStopDialog" class="guide-stop-box">
                <div class="wraper">
                    <div style="font-size: 24px; line-height: 31px; color: #313238">确认跳过学习？</div>
                    <div style="margin-top: 27px; font-size: 14px; line-height: 19px; color: #63656E">跳过此次学习，你可点击页面右上角的帮助指引，再次发起学习。</div>
                    <div style="margin-top: 22px;">
                        <img :src="helpImg" style="width: 157px; height: 157px" />
                    </div>
                    <div style="margin-top: 27px">
                        <bk-button theme="primary" class="mr10" @click="handleDone">确定</bk-button>
                        <bk-button @click="handleCancelStop">取消</bk-button>
                    </div>
                    <div class="cancal-btn" @click="handleCancelStop">
                        <i class="bk-icon icon-close" />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import _ from 'lodash'
    import cookie from 'cookie'

    const CACHE_KEY = 'lesscode_supermen'

    export default {
        name: '',
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        data () {
            return {
                isShowFinisheDialog: false,
                isShowStopDialog: false,
                isDone: cookie.parse(document.cookie).hasOwnProperty(CACHE_KEY),
                currentStepIndex: 0,
                currentStep: {},
                tipStyles: {},
                placement: '',
                doneCountTime: 3
            }
        },
        computed: {
            currentStepNum () {
                return this.currentStepIndex + 1
            },
            isLast () {
                return this.currentStepIndex === this.data.length - 1
            }
        },
        created () {
            this.helpImg = require('./help.png')
            window.__lesscodeEditPageGuide = this
        },
        mounted () {
            this.init()
            window.addEventListener('resize', this.handleReize)
        },
        beforeDestroy () {
            this.clearActive()
            this.$refs.wraper && this.$refs.wraper.parentNode.removeChild(this.$refs.wraper)
            window.removeEventListener('resize', this.handleReize)
        },
        methods: {
            /**
             * 指引初始化
            */
            init () {
                if (!this.isDone) {
                    document.body.appendChild(this.$refs.wraper)
                    this.activeStep()
                }
            },
            /**
             * 外部调用，开始指引
            */
            start () {
                this.isDone = false
                this.isShowFinisheDialog = false
                this.isShowStopDialog = false
                this.currentStepIndex = 0
                this.doneCountTime = 3
                document.cookie = cookie.serialize(CACHE_KEY, Date.now(), {
                    expires: new Date(Date.now() - 1),
                    path: '/'
                })
                this.$nextTick(() => {
                    this.init()
                })
            },
            /**
             * 步骤切换时激活目标步骤
            */
            activeStep () {
                const windowWidth = window.innerWidth
                const windowHieght = window.innerHeight
                const currentStep = this.data[this.currentStepIndex]
                const $stepTarget = document.querySelector(currentStep.target)
                $stepTarget.classList.add('guide-highlight')
                if (typeof this.currentStep.leave === 'function') {
                    this.currentStep.leave()
                }
                if (typeof currentStep.entry === 'function') {
                    currentStep.entry()
                }
                setTimeout(() => {
                    const {
                        top: targetTop,
                        right: targetRight,
                        bottom: targeBottom,
                        left: targetLeft,
                        width: targetWidth
                    } = $stepTarget.getBoundingClientRect()
                    const {
                        width,
                        height
                    } = this.$refs.tip.getBoundingClientRect()

                    let placement = 'left'
                    if (width > height
                        && targeBottom < 0.3 * windowHieght) {
                        placement = targeBottom > 0.5 * windowHieght ? 'top' : 'bottom'
                    } else {
                        placement = targetLeft > 0.5 * windowWidth ? 'left' : 'right'
                    }

                    let styles = {}

                    if (placement === 'bottom') {
                        styles = {
                            top: `${targeBottom + 10}px`,
                            left: `${targetLeft + (targetWidth - width) / 2}px`
                        }
                    } else if (placement === 'top') {
                        styles = {
                            top: `${windowHieght - targetTop - height - 10}px`,
                            left: `${targetLeft + (targetWidth - width) / 2}px`
                        }
                    } else if (placement === 'left') {
                        styles = {
                            top: `${targetTop}px`,
                            right: `${windowWidth - targetLeft + 10}px`
                        }
                    } else if (placement === 'right') {
                        styles = {
                            top: `${targetTop}px`,
                            left: `${targetRight + 10}px`
                        }
                    }
                    this.currentStep = Object.freeze(currentStep)
                    this.tipStyles = Object.freeze(styles)
                    this.placement = placement
                })
            },
            /**
             * 清空所有步骤的激活状态
            */
            clearActive () {
                document.body.querySelectorAll('.guide-highlight').forEach(el => {
                    el.classList.remove('guide-highlight')
                })
            },
            /**
             * 完成指引
            */
            doneGudie () {
                document.cookie = cookie.serialize(CACHE_KEY, Date.now(), {
                    expires: new Date(Date.now() + 31104000000),
                    path: '/'
                })
                this.isDone = true
                if (this.currentStep && typeof this.currentStep.leave === 'function') {
                    this.currentStep.leave()
                }
                setTimeout(() => {
                    this.$refs.wraper && this.$refs.wraper.parentNode.removeChild(this.$refs.wraper)
                })
            },
            /**
             * 窗口缩放
            */
            handleReize: _.throttle(function () {
                if (!this.isDone) {
                    this.activeStep()
                }
            }, 100),
            /**
             * 跳过指引确认操作
            */
            handleStop () {
                this.isShowStopDialog = true
                this.clearActive()
            },
            /**
             * 取消跳过指引
            */
            handleCancelStop () {
                this.isShowStopDialog = false
                this.activeStep()
            },
            /**
             * 切换步骤
            */
            handleNext () {
                this.currentStepIndex++
                this.clearActive()
                this.activeStep()
            },
            /**
             * 结束指引确认操作
            */
            handleFinish () {
                this.clearActive()
                this.isShowFinisheDialog = true
                const countdown = () => {
                    setTimeout(() => {
                        this.doneCountTime--
                        if (this.doneCountTime > 0) {
                            countdown()
                        } else {
                            this.doneGudie()
                        }
                    }, 1000)
                }
                countdown()
            },
            /**
             * 完成指引
            */
            handleDone () {
                this.doneGudie()
            }
        }
    }
</script>
<style lang='postcss'>
    body{
        *.guide-highlight{
            opacity: 1 !important;
            z-index: 100001 !important;
            background: #fff;
            pointer-events: none !important;
        }
    }
    .novice-guide{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100000;
        background: rgba(0,0,0,0.6);
        .step-box{
            position: absolute;
            width: 270px;
            min-height: 110px;
            padding: 12px 10px 10px;
            font-size: 12px;
            color: #313238;
            border-radius: 2px;
            background: #fff;
            &.right{
                .target-arrow{
                    top: 30px;
                    left: -4px;
                }
            }
            &.left{
                .target-arrow{
                    top: 30px;
                    right: -4px;
                }
            }
            &.bottom{
                .target-arrow{
                    top: -4px;
                    left: 50%;
                }
            }
            &.top{
                .target-arrow{
                    bottom: -4px;
                    left: 50%;
                }
            }
            .step-title{
                font-weight: bold;
                line-height: 16px;
            }
            .step-content{
                margin-top: 7px;
            }
            .step-action{
                display: flex;
                justify-content: flex-end;
                margin-top: 14px;
                .action-text{
                    color: #3A84FF;
                    cursor: pointer;
                }
                .action-btn{
                    height: 20px;
                    padding: 0 8px;
                    margin-left: 14px;
                    line-height: 20px;
                    color: #fff;
                    border-radius: 10px;
                    background: #3A84FF;
                    cursor: pointer;
                }
            }
            .target-arrow{
                position: absolute;
                width: 8px;
                height: 8px;
                background: inherit;
                transform: rotateZ(45deg);
            }
        }
        .guide-finished-box{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .wraper{
                width: 400px;
                height: 210px;
                padding-top: 74px;
                text-align: center;
                background: #fff;
                border-radius: 2px;
                .flag{
                    position: absolute;
                    top: 0;
                    left: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 86px;
                    height: 86px;
                    font-size: 55px;
                    color: #fff;
                    border: 13px solid #DCFFE2;
                    border-radius: 50%;
                    background: #2DCB56;
                    transform: translate(-50%, -27px);
                    &:after{
                        content: '';
                        position: absolute;
                    }
                }
            }
        }
        .guide-stop-box{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .wraper{
                width: 500px;
                height: 390px;
                padding-top: 45px;
                text-align: center;
                border-radius: 2px;
                background: #fff;
                .cancal-btn{
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    width: 26px;
                    height: 26px;
                    font-weight: 700;
                    font-size: 22px;
                    color: #979ba5;
                    line-height: 26px;
                    text-align: center;
                    border-radius: 50%;
                    cursor: pointer;
                    &:hover{
                        background-color: #f0f1f5;
                    }
                }
            }
        }
    }
    .guide-fade-leave-active{
        transition: visibility .15s linear, opacity .1s linear;
    }
    .guide-fade-leave-to{
        opacity: 0;
        visibility: hidden;
    }
</style>
