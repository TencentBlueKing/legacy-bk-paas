<template lang="html">
    <div :class="[{ 'mg-loading-content': isLoaderShow, 'loading': localLoading, 'fadeout': !localLoading }]" :style="{ 'min-height': localLoading && height ? height + 'px' : 'calc(100% - 50px)' }">
        <div :class="['loading-placeholder', { 'hide': !isLoaderShow }]" :style="{ 'background-color': backgroundColor }">
            <template v-if="placeholder">
                <component
                    :is="placeholder"
                    :style="{ 'padding-top': `${offsetTop}px`, 'margin-left': `${offsetLeft}px`, 'transform-origin': 'left' }"
                    :base-width="baseWidth"
                    :correction-width="correctionWidth"
                    :content-width="contentWidth">
                </component>
            </template>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import IndexLoading from './loading/index'
    export default {
        components: {
            IndexLoading
        },
        props: {
            isLoading: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String
            },
            offsetTop: {
                type: [Number, String],
                default: 25
            },
            offsetLeft: {
                type: [Number, String],
                default: 0
            },
            height: {
                type: Number
            },
            delay: {
                type: Number,
                default: 300
            },
            backgroundColor: {
                type: String,
                default: '#FFF'
            }
        },
        data () {
            return {
                localLoading: this.isLoading,
                isLoaderShow: this.isLoading,
                baseWidth: 1180,
                contentWidth: 1180,
                curPlaceholder: '',
                correctionWidth: 0
            }
        },
        watch: {
            isLoading (newVal, oldVal) {
                // true转false时，让loading动画再运行一段时间，防止过快而闪烁
                if (oldVal && !newVal) {
                    setTimeout(() => {
                        this.localLoading = this.isLoading
                        setTimeout(() => {
                            this.isLoaderShow = this.isLoading
                        }, 200)
                    }, this.delay)
                } else {
                    this.localLoading = this.isLoading
                    this.isLoaderShow = this.isLoading
                }
            }
        },
        mounted () {
            this.initContentWidth()

            window.onresize = () => {
                this.initContentWidth()
            }
        },
        methods: {
            initContentWidth () {
                const winWidth = window.innerWidth
                if (winWidth < 1440) {
                    this.contentWidth = 980
                    this.baseWidth = winWidth
                } else if (winWidth < 1680) {
                    this.contentWidth = 1080
                    this.baseWidth = winWidth
                } else if (winWidth < 1920) {
                    this.contentWidth = 1180
                    this.baseWidth = winWidth
                } else {
                    this.contentWidth = winWidth
                    this.baseWidth = winWidth
                    this.correctionWidth = 370
                }
            }
        }
    }
</script>

<style lang="postcss">
  .mg-loading-content {
    position: relative;
    overflow: hidden;
    z-index: 1111;

    &.loading {
      * {
        opacity: 0 !important;
      }
    }

    &.fadeout {
      .loading-placeholder {
        opacity: 0 !important;
      }
    }

    .loading-placeholder {
      opacity: 1 !important;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      transition: opacity ease 0.5s;

      &.hide {
        z-index: -1;
      }

      svg {
        width: 100%;
      }

      * {
        opacity: 1 !important;
      }
    }
  }
  .hide {
    display: none;
  }
</style>
