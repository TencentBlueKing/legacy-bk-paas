<template>
    <collapse-transition>
        <div class="bk-big-tree-node clearfix fuck"
            v-if="node.visible"
            :id="node.uid"
            :class="{
                'is-root': node.parent === null,
                'is-leaf': !node.isFolder && node.isLeaf,
                'is-folder': node.isFolder,
                'is-expand': node.expanded,
                'is-selected': node.selected,
                'is-disabled': node.disabled,
                'is-checked': node.checked,
                'has-link-line': node.tree.hasLine
            }"
            :style="{
                '--level': node.level,
                '--line': node.line,
                '--padding': `${node.tree.padding}px`
            }"
            @click="node.tree.handleNodeClick(node)">
            <div class="node-options fl">
                <i v-if="node.loading" :class="node.tree.loadingClass"></i>
                <i v-else-if="node.isFolder || !node.isLeaf"
                    :class="['node-folder-icon', node.expanded ? node.expandIcon : node.collapseIcon]"
                    @click.stop="node.tree.handleNodeExpand(node)">
                </i>
                <span class="node-checkbox"
                    v-if="node.hasCheckbox"
                    :class="{
                        'is-disabled': node.disabled,
                        'is-checked': node.checked,
                        'is-indeterminate': node.indeterminate
                    }"
                    @click.stop="node.tree.handleNodeCheck(node)">
                </span>
                <i v-if="node.nodeIcon"
                    :class="['node-icon', node.nodeIcon]">
                </i>
            </div>
            <div class="node-content">
                <slot
                    :node="node"
                    :data="node.data">
                    {{node.name}}
                </slot>
            </div>
        </div>
    </collapse-transition>

</template>

<script>
    import CollapseTransition from './transition'
    export default {
        components: {
            CollapseTransition
        },
        props: {
            node: {
                type: Object,
                default: () => ({})
            }
        }
    }
</script>
