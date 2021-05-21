<template>
    <section>
        <bk-input v-for="input in list"
            :key="input.key"
            @input="inputVal(input.key, ...arguments)"
            :type="inputType"
            :value="value[input.key]"
            class="variable-input"
            clearable
        >
            <template slot="prepend"><span class="input-txt">{{input.txt}}</span></template>
        </bk-input>
    </section>
</template>

<script>
    import mixins from './variable.mixin'

    export default {
        mixins: [mixins],

        computed: {
            inputType () {
                let inputType = 'text'
                if (this.valueType === 1) {
                    inputType = 'number'
                }
                return inputType
            }
        },

        methods: {
            inputVal (key, val) {
                if (this.inputType === 'number') val = Number(val)
                this.change(key, val)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .variable-input {
        margin-top: 20px;
    }

    .input-txt {
        display: inline-block;
        background: #fff;
        font-size: 12px;
        width: 80px;
        line-height: 30px;
        text-align: center;
    }
</style>
