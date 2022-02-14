## 组件配置信息说明

<table class="table">
    <tr>
        <th>字段 name</th>
        <th>类型 type</th>
        <th>描述 describe</th>
    </tr>
    <tr>
        <td>type</td>
        <td>String</td>
        <td>源码中展示的标签名（只支持小写英文字母）</td>
    </tr>
    <tr>
        <td>name</td>
        <td>String</td>
        <td>页面展示的英文名</td>
    </tr>
    <tr>
        <td>displayName</td>
        <td>String</td>
        <td>页面展示的中文名</td>
    </tr>
    <tr>
        <td>icon</td>
        <td>String</td>
        <td>页面展示的图标</td>
    </tr>
    <tr>
        <td>group</td>
        <td>String</td>
        <td>页面展示的组件分组</td>
    </tr>
    <tr>
        <td>events</td>
        <td>Array</td>
        <td>组件支持的事件</td>
    </tr>
    <tr>
        <td>styles</td>
        <td>
            <p>Array，可选值如下：</p>
            <p>position: 元素定位</p>
            <p>size: css 盒模型（display, width, height, min-width, max-width, min-height, max-height）</p>
            <p>padding: css 盒模型内边距</p>
            <p>margin: css 盒模型外边距</p>
            <p>font: 字体</p>
            <p>pointer: 鼠标指针</p>
            <p>background: 背景</p>
            <p>border: 边框</p>
            <p>opacity: 透明度</p>
        </td>
        <td>组件支持的 css 样式设置</td>
    </tr>
    <tr>
        <td>props</td>
        <td>Object</td>
        <td>组件支持的属性配置</td>
    </tr>
    <tr>
        <td>directives</td>
        <td>Array</td>
        <td>组件支持的指令配置</td>
    </tr>
    <tr>
        <td>slots</td>
        <td>Object</td>
        <td>组件支持的插槽</td>
    </tr>
</table>

:::info
events —— 组件内部支持的事件（this.$emit('click')）
:::

```js
// events
{
    ...
    events: [
        {
            name: 'click', // 组件支持点击事件
            tips: '响应组件的点击事件' // 事件功能描述
        },
        {
            name: 'foucs', // 组件支持获得焦点事件
            tips: '响应组件的获得焦点事件' // 事件功能描述
        }
    ]
}
```

:::info
styles —— 组件支持的样式
:::

```js
// styles 三种使用方式
{
    ...
    styles: [
        'size',
        {
            name: 'size', // 样式名称
            include: ['height', 'width'] // 样式包含
        },
        {
            name: 'size', // 样式名称
            exclude: ['min-height', 'width'] // 样式不包含
        }
    ]
}
```

:::info
props —— 组件支持配置的 props
:::

```js
// props
{
    ...
    // 组件支持配置 value
    value: {
        type: 'string', // 类型（string、number、array、object、boolean）
        val: 'hello world !!!', // 默认值
        options: [] // 值可选列表
        tips: '空白提示', // 数据使用描述
    }
}
```

:::info
directives —— 支持配置的指令
:::

```js
// directives
{
    [
        ...
        {
            type: 'v-bind', // 指令类型
            prop: 'disabled', // 指令所绑定的属性
            val: '', // 指令绑定的变量名
            modifiers: ['sync'], // 指令修饰符，该字段可选
            defaultVal: false // 指令绑定变量的默认值
        }
    ]
}
```

:::info
slots —— 组件支持的插槽
:::

```js
// slots
{
    ...
    slots: {
        default: {
            name: ['bk-table-column'], // 插槽内使用的组件名称
            type: ['table-list', 'remote'], // 插槽数据类型
            displayName: '表头配置', // 页面展示名称
            // 插槽数据
            val: [
                { label: '第一列', prop: 'prop1', sortable: false, type: '' },
                { label: '第二列', prop: 'prop2', sortable: false, type: '' },
                { label: '第三列', prop: 'prop3', sortable: false, type: '' }
            ]
        }
    }
}
```