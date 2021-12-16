<template>
    <li class="tool-item"
        v-bk-tooltips="{ placement: 'bottom', content: item.tips, disabled: !item.tips }"
        @click="item.func">
        <slot>
            <i :class="item.icon"></i>
            <span>{{item.text}}</span>
        </slot>
    </li>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                required: true
            }
        }
    }
</script>
