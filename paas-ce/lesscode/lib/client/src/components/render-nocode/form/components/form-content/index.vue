<template>
    <div>
        <h3>form组件整个引用：</h3>
        <hr />
        <process-form-plugin :fields="formFields"></process-form-plugin>
        <br />
        <br />
        <h3>form组件单个field引用：</h3>
        <hr />
        <process-field-item :field="formFields[0]"></process-field-item>
        <br />
    </div>
</template>

<script>
    import Vue from 'vue'
    import { ProcessFormPlugin, ProcessFieldItem } from '../../../common/processFormPlugin.js'
    import '../../../common/processFormPlugin.css'
    import jsonData from '../../../common/mockFormData.json'
    console.log(jsonData)

    Vue.use(ProcessFormPlugin)
    Vue.use(ProcessFieldItem)
    export default {
        data () {
            return {
                formFields: jsonData
            }
        }
    }
</script>
