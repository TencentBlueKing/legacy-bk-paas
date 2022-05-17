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

<script lang="ts">
    import { defineComponent } from '@vue/composition-api'
    import { execCopy } from '@/common/util'
    import { UPLOAD_STATUS, UploadFile, getFileUrl } from '../helper'

    export default defineComponent({
        props: {
            files: {
                type: Array,
                default: () => []
            }
        },
        setup (props, { emit }) {
            const handleCopyLink = (file: UploadFile) => {
                execCopy(getFileUrl(file, true))
            }

            const handleRemove = (file: UploadFile) => {
                emit('remove', file)
            }

            return {
                UPLOAD_STATUS,
                getFileUrl,
                handleCopyLink,
                handleRemove
            }
        }
    })
</script>

<template>
    <div class="list-card">
        <div class="card-item" v-for="file in files" :key="file.uid">
            <div class="item-icon">
                <img :src="getFileUrl(file)" :alt="file.name">
                <div :class="['upload-status', file.status]" v-if="file.status === UPLOAD_STATUS.UPLOADING || file.status === UPLOAD_STATUS.FAIL">
                    <bk-round-progress
                        width="50px"
                        :config="{
                            strokeWidth: 10,
                            bgColor: '#333',
                            activeColor: '#3a84ff'
                        }"
                        title="上传中"
                        :title-style="{ color: '#fff', fontSize: '12px' }"
                        :num-style="{ color: '#fff', fontSize: '14px' }"
                        :percent="file.percentage / 100"
                        v-if="file.status === UPLOAD_STATUS.UPLOADING">
                    </bk-round-progress>
                    <div v-if="file.status === UPLOAD_STATUS.FAIL" class="fail-content">
                        <i class="bk-drag-icon bk-drag-close-circle-fill"></i>
                        <div class="fail-text">{{ file.statusText || '上传失败'}}</div>
                    </div>
                </div>
            </div>
            <div :class="['item-summary', file.status]">
                <div class="filename">{{file.name}}</div>
                <div class="actions">
                    <i class="bk-drag-icon bk-drag-link"
                        v-bk-tooltips.top="'复制链接'"
                        @click="handleCopyLink(file)"
                        v-show="file.status === UPLOAD_STATUS.SUCCESS">
                    </i>
                    <bk-popconfirm
                        trigger="click"
                        title="确认要删除该图片？"
                        content="删除后不可恢复，已引用的组件将显示异常"
                        @confirm="handleRemove(file)">
                        <i class="bk-drag-icon bk-drag-delet" v-bk-tooltips.top="'删除'"></i>
                    </bk-popconfirm>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="postcss" scoped>
    .list-card {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;

        .card-item {
            display: flex;
            flex-direction: column;
            width: 256px;
            height: 192px;
            padding: 8px;
            margin-right: 16px;
            margin-bottom: 16px;
            background: #fff;
            border-radius: 2px;
            box-shadow: 0px 2px 4px 0px rgba(25, 25, 41, 0.05);

            &:hover {
                box-shadow: 0px 2px 4px 0px rgba(25, 25, 41, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.10);
            }

            .item-icon {
                width: 100%;
                height: 140px;
                background: #f5f7fa;
                position: relative;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .upload-status {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    align-items: center;
                    justify-content: center;
                    top: 0;
                    left: 0;

                    &.uploading {
                        background: rgba(0, 0, 0, .65);
                    }

                    &.fail {
                        background: rgba(0, 0, 0, .75);
                    }

                    .fail-content {
                        text-align: center;
                        .bk-drag-icon {
                            font-size: 36px;
                            color: #ea3636;
                        }
                        .fail-text {
                            font-size: 12px;
                            color: #fff;
                            margin-top: 4px;
                        }
                    }
                }

            }
            .item-summary {
                flex: 1;

                display: flex;
                align-items: center;
                justify-content: space-between;

                .filename {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-right: 8px;
                }

                .actions {
                    display: flex;
                    justify-content: space-between;

                    .bk-drag-icon {
                        width: 18px;
                        height: 18px;
                        line-height: 18px;
                        margin: 0 4px;
                        text-align: center;
                        cursor: pointer;
                        position: relative;
                        top: 2px;
                    }
                }

                &.fail {
                    .filename {
                        color: #ea3636;
                    }
                }
            }
        }
    }
</style>
