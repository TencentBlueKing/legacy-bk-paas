<template>
    <div>
        <div class="bk-trigger-condition" v-for="(item, index) in responseList" :key="index">
            <div class="bk-condition-name">
                <p>响应动作</p>
                <div class="bk-between-operat">
                    <i class="bk-itsm-icon icon-flow-add" @click="addResponse(item, index)"></i>
                    <i class="bk-itsm-icon icon-flow-reduce"
                        :class="{ 'bk-no-delete': responseList.length === 1 }"
                        @click="deleteResponse(item, index)"></i>
                </div>
            </div>
            <div class="bk-condition-content">
                <div class="bk-response-way">
                    <p class="bk-response-name">动作名称<span class="bk-span-square">*</span></p>
                    <bk-select ext-cls="bk-way-input"
                        v-model="item.way"
                        :clearable="false"
                        searchable
                        @selected="selectedWay(...arguments, item)">
                        <bk-option v-for="option in responseWayList"
                            :key="option.key"
                            :id="option.key"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                    <p class="bk-error-info" v-if="item.wayStatus">动作名称为必填项</p>
                </div>
                <div v-if="item.wayInfo.field_schema && item.wayInfo.field_schema.length"
                    v-bkloading="{ isLoading: item.isLoading }"
                    style="min-height: 100px;">
                    <response-content
                        v-if="!item.isLoading && item.wayInfo.field_schema && item.wayInfo.field_schema.length"
                        :item="item"
                        :signal="signal">
                    </response-content>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import responseContent from './responseContent.vue'
    export default {
        name: 'ResponseCondition',
        components: {
            responseContent
        },
        props: {
            responseWayList: {
                type: Array,
                default () {
                    return []
                }
            },
            responseList: {
                type: Array,
                default () {
                    return []
                }
            },
            signal: String
        },
        data () {
            return {
                wayList: [],
                apiList: []
            }
        },
        methods: {
            addResponse (item, index) {
                this.responseList.splice(index + 1, 0, {
                    way: '',
                    wayInfo: {},
                    performData: {
                        runMode: 'BACKEND',
                        displayName: '',
                        repeat: 'one'
                    },
                    isLoading: false
                })
            },
            deleteResponse (item, index) {
                if (this.responseList.length === 1) {
                    return
                }
                this.responseList.splice(index, 1)
            },
            // 选中某一个类型
            async selectedWay () {
                // 当存在校验显示时，将校验显示还原
                if (arguments[2].wayStatus) {
                    arguments[2].wayStatus = false
                }
                arguments[2].isLoading = true
                arguments[2].wayInfo = JSON.parse(JSON.stringify(this.responseWayList.filter(node => node.key === arguments[0])[0]))
                setTimeout(() => {
                    arguments[2].isLoading = false
                }, 1000)
            }
        }
    }
</script>

<style scoped lang="postcss">
@import "@/css/mixins/clearfix.css";
.bk-trigger-condition {
  position: relative;
  border: 1px solid #DCDEE5;
  border-top: none;
  background-color: #FAFBFD;
  @mixin clearfix;
}
.bk-condition-name {
  color: #63656E;
  font-size: 12px;
  width: 100px;
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translate(-50%, -50%);
  text-align: center;
  .bk-between-operat {
    line-height: 20px;
    font-size: 14px;
    .bk-itsm-icon {
      color: #C4C6CC;
      margin-right: 9px;
      cursor: pointer;
      &:hover {
        color: #979BA5;
      }
    }
    .bk-no-delete {
      color: #DCDEE5;
      cursor: not-allowed;
      &:hover {
        color: #DCDEE5;
      }
    }
  }
}
.bk-condition-content {
  float: right;
  width: calc(100% - 100px);
  border-left: 1px solid #DCDEE5;
  background-color: #ffffff;
}
.bk-response-way {
  padding: 15px;
  @mixin clearfix;
  .bk-response-name {
    float: left;
    font-size: 14px;
    color: #666;
    line-height: 32px;
    margin-right: 10px;
    .bk-span-square {
      color: #ff5656;
      vertical-align: middle;
      position: relative;
      top: 2px;
      left: 3px;
    }
  }
  .bk-way-input {
    width: 300px;
    float: left;
    margin-right: 10px;
  }
}
.bk-error-info {
  float: left;
  color: #ff5656;
  font-size: 12px;
  line-height: 30px;
  margin-left: 10px;
}
</style>
