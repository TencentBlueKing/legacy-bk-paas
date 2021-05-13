<template>
    <div class="project-layout-props-modifier">
        <div class="title">导航布局属性配置</div>
        <div v-for="prop in propList" :key="prop.name" class="prop-box">
            <div class="prop-name" v-bk-tooltips="prop.tips">
                <div class="label">{{ prop.name }}({{ prop.type }})</div>
            </div>
            <div class="prop-action">
                <template v-if="prop.type === 'Boolean'">
                    <bk-switcher
                        theme="primary"
                        size="small"
                        :value="calcValue(prop)"
                        @change="value => handleValueChange(prop.name, value, prop.defaultValue)" />
                </template>
                <template v-else-if="prop.type === 'Number'">
                    <bk-input
                        type="number"
                        :value="calcValue(prop)"
                        @change="value => handleValueChange(prop.name, value, prop.defaultValue)" />
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: '',
        inheritAttrs: false,
        props: {
            panelActive: String,
            renderProps: {
                type: Object,
                default: () => ({})
            }
        },
        created () {
            this.propList = []
            // 横向型导航布局不支持 default-open 配置
            if (this.panelActive !== 'topMenu') {
                this.propList.push({
                    name: 'default-open',
                    type: 'Boolean',
                    tips: '是否默认展开左侧栏',
                    defaultValue: false
                })
            }
            this.propList.push({
                name: 'head-height',
                type: 'Number',
                tips: '导航上侧栏的高度',
                defaultValue: 52
            })
        },
        methods: {
            calcValue (prop) {
                const {
                    name,
                    defaultValue
                } = prop
                if (this.renderProps.hasOwnProperty(name)) {
                    return this.renderProps[name]
                }
                return defaultValue
            },
            handleValueChange (name, value, defaultValue) {
                const renderProps = Object.assign({}, this.renderProps)
                if (value === defaultValue || value === '') {
                    delete renderProps[name]
                } else {
                    renderProps[name] = value
                }
                this.$emit('on-change', 'renderProps', renderProps)
            }
        }
    }
</script>
<style lang='postcss'>
    .project-layout-props-modifier{
        padding: 0  10px 10px;
        .title{
            font-size: 12px;
            font-weight: bold;
            color: #63656E;
            line-height: 16px;
        }
        .prop-box{
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            margin: 0 10px;
            .prop-name{
                display: flex;
                align-items: center;
                height: 32px;
                font-size: 14px;
                color: #63656E;
                word-break: keep-all;
                .label {
                    border-bottom: 1px dashed #979ba5;
                    cursor: pointer;
                }
            }
            .prop-action{
                width: 100%;
            }
        }
    }
</style>
