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
    <div :class="[$style['container'], 'preview-exception']">
        <bk-exception :class="$style['exception-wrap']" type="403">
            <div>{{ pageId ? '页面' : '项目' }}不存在或无权限</div>
            <div :class="$style['text-subtitle']">系统将在 {{countdown}}s 后返回项目列表页</div>
        </bk-exception>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                countdown: 3,
                timer: null
            }
        },
        computed: {
            pageId () {
                return this.$route.params.pageId
            }
        },
        created () {
            this.timer = setInterval(() => {
                this.countdown--
                if (this.countdown === 0) {
                    clearInterval(this.timer)
                    this.timer = null
                    this.$router.push({
                        name: 'projects'
                    })
                }
            }, 1000)
        }
    }
</script>

<style lang="postcss" module>
    .container {
        display: flex;
        height: calc(100vh - 64px);
        margin-top: 64px;
        .exception-wrap {
            justify-content: center;
            margin-top: -120px;

            .text-subtitle {
                color: #979BA5;
                font-size: 14px;
                text-align: center;
                margin-top: 14px;
            }
        }
    }

    :global {
        .preview-page {
            .preview-exception {
                height: 100%;
                margin-top: 0;
            }
        }
    }
</style>
