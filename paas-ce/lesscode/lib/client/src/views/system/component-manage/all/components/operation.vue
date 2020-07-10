<template>
    <div class="component-operation">
        <bk-form :label-width="90">
            <bk-form-item label="组件包" required>
                <bk-upload
                    tip="只允许上传ZIP的文件"
                    with-credentials
                    url="http://tencent.com/"
                    accept="application/zip" />
            </bk-form-item>
            <bk-form-item label="组件名称" required>
                <bk-input placeholder="上传组件包后解析生成" readonly />
            </bk-form-item>
            <bk-form-item label="组件ID" required>
                <bk-input placeholder="上传组件包后解析生成" readonly />
            </bk-form-item>
            <bk-form-item label="组件版本" required>
                <bk-input type="number" style="width: 120px" />
            </bk-form-item>
            <bk-form-item label="所属分类" required>
                <bk-select>
                    <bk-option id="1" name="表单处理" />
                    <bk-option id="2" name="作业平台" />
                </bk-select>
            </bk-form-item>
            <bk-form-item label="是否公开" required>
                <bk-switcher theme="primary" />
            </bk-form-item>
            <bk-form-item label="组件介绍" required>
                <bk-input type="textarea" :maxlength="100" />
            </bk-form-item>
            <bk-form-item label="版本日志" required>
                <bk-input />
            </bk-form-item>
        </bk-form>
    </div>
</template>
<script>
    export default {
        name: '',

        data () {
            return {}
        },

        methods: {}
    }
</script>
<style lang='postcss' scoped>
    .component-operation{
        padding: 25px 30px;
    }
</style>
