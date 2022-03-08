# core api 描述文档

### Node 结构描述

<table style="width: 100%">
    <thead>
        <tr>
            <th>属性名</th>
            <th>类型</th>
            <th>描述</th>
            <th>结构说明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>tabPanelActive</td>
            <td>String</td>
            <td>最新选中的配置面板</td>
            <td>''</td>
        </tr>
        <tr>
            <td>componentId</td>
            <td>String</td>
            <td>表示组件引用关系的 ID</td>
            <td>''</td>
        </tr>
        <tr>
            <td>renderKey</td>
            <td>String</td>
            <td>渲染框架层面的 key，改变会导致对应组件的销毁、渲染</td>
            <td>''</td>
        </tr>
        <tr>
            <td>name</td>
            <td>String</td>
            <td>描述组件的 name</td>
            <td>''</td>
        </tr>
        <tr>
            <td>type</td>
            <td>String</td>
            <td>框架层面的组件 type，全局唯一</td>
            <td>''</td>
        </tr>
        <tr>
            <td>renderStyles</td>
            <td>Object</td>
            <td>用户配置的组件渲染 CSS</td>
            <td>
                {}
            </td>
        </tr>
        <tr>
            <td>renderProps</td>
            <td>Object</td>
            <td>组件支持的 prop 配置</td>
            <td>
<pre>
    {
        format: '', // 可选值（value、variable、expression）
        code: '',
        valueType: '', // format 是 value 时的值类型
        payload: {  // 存放远程函数、数据源配置相关信息
            method: {
                methodCode: '' // 函数名
                params: [] // 传递的参数
            },
            sourceData: {
                tableName: '', // 数据源表名
                columns: [] // 数据源表字段
            }
        }, 
        renderValue: '' // 作用于画布编辑区的显示效果
    }
</pre>
            </td>
        </tr>
        <tr>
            <td>renderSlots</td>
            <td>Object</td>
            <td>组件支持的 slot 配置</td>
            <td>
<pre>
    {
        format: '',
        code: '',
        component: '', // slot 生成的组件类型，
        valueType: '',
        payload: {},
        renderValue: ''
    }
</pre>
            </td>
        </tr>
        <tr>
            <td>renderDirectives</td>
            <td>Array</td>
            <td>组件支持的 directive 配置</td>
            <td>
<pre>
    {
        format: '',
        code: '',
    }
</pre>
            </td>
        </tr>
        <tr>
            <td>renderEvents</td>
            <td>Object</td>
            <td>组件支持的 event 配置</td>
            <td>
<pre>
    {
        format: '',
        code: '',
    }
</pre>
            </td>
        </tr>
        <tr>
            <td>interactiveShow</td>
            <td>Boolean</td>
            <td>交互式类型组件在画布编辑区的显示状态</td>
            <td>false</td>
        </tr>
        <tr>
            <td>interactiveShow</td>
            <td>Boolean</td>
            <td>交互式类型组件在画布编辑区的显示状态</td>
            <td>false</td>
        </tr>
        <tr>
            <td>isInteractiveComponent</td>
            <td>Boolean</td>
            <td>交互式类型组件</td>
            <td>false</td>
        </tr>
        <tr>
            <td>isComplexComponent</td>
            <td>Boolean</td>
            <td>复合类型组件</td>
            <td>false</td>
        </tr>
        <tr>
            <td>isCustomComponent</td>
            <td>Boolean</td>
            <td>用户定义上传组件</td>
            <td>false</td>
        </tr>
        <tr>
            <td>isActived</td>
            <td>Boolean</td>
            <td>组件在画布编辑区的选中状态</td>
            <td>false</td>
        </tr>
    </tbody>
</table>


### Node api

<table style="width: 100%">
    <thead>
        <tr>
            <th>api</th>
            <th>params</th>
            <th>描述</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>toJSON</td>
            <td>-</td>
            <td>获取节点的 JSON 数据</td>
        </tr>
        <tr>
            <td>setProperty</td>
            <td>key, value</td>
            <td>设置的节点属性</td>
        </tr>
        <tr>
            <td>active</td>
            <td>-</td>
            <td>选中组件</td>
        </tr>
        <tr>
            <td>activeClear</td>
            <td>-</td>
            <td>取消选中组件</td>
        </tr>
        <tr>
            <td>toggleInteractive</td>
            <td>-</td>
            <td>切换交互式组件的显示状态</td>
        </tr>
        <tr>
            <td>rerender</td>
            <td>-</td>
            <td>重新渲染组件</td>
        </tr>
        <tr>
            <td>appendChild</td>
            <td>childNode, slotName</td>
            <td>布局类型组件添加子组件</td>
        </tr>
        <tr>
            <td>insertBefore</td>
            <td>newNode, referenceNode</td>
            <td>布局类型的组件在指定的子组件之前插入兄弟组件</td>
        </tr>
        <tr>
            <td>insertAfter</td>
            <td>newNode, referenceNode</td>
            <td>布局类型的组件在指定的子组件之后插入兄弟组件</td>
        </tr>
        <tr>
            <td>pasteNode</td>
            <td>childNode</td>
            <td>布局类型的组件粘贴一个子组件</td>
        </tr>
        <tr>
            <td>removeChild</td>
            <td>childNode</td>
            <td>布局类型的组件删除指定的子组件</td>
        </tr>
        <tr>
            <td>cloneNode</td>
            <td>deep</td>
            <td>组件克隆</td>
        </tr>
        <tr>
            <td>setRenderStyles</td>
            <td>style</td>
            <td>设置组件 style（全量覆盖）</td>
        </tr>
        <tr>
            <td>setRenderSlots</td>
            <td>slots, slotName</td>
            <td>设置组件 slot（指定 slot 的全量覆盖）</td>
        </tr>
        <tr>
            <td>setRenderEvents</td>
            <td>events</td>
            <td>设置组件 event（全量覆盖）</td>
        </tr>
        <tr>
            <td>setRenderDirectives</td>
            <td>directives</td>
            <td>设置组件 directive（全量覆盖）</td>
        </tr>
        <tr>
            <td>setStyle</td>
            <td>params1, params2</td>
            <td>设置指定 style name 的值</td>
        </tr>
        <tr>
            <td>setProp</td>
            <td>params1, params2</td>
            <td>设置指定 prop name 的值</td>
        </tr>
    </tbody>
</table>    


### 配置结果复杂结构类型描述

#### - payload
``` typescript
interface IPayloadData {
    method?: {
        methodCode: String,
        params: Array
    },
    sourceData?: {
        tableName: String,
        columns: Array
    }
}
```

#### - node.renderProps
``` typescript
type PropValueTypeType = 'Array' | 'remote' | 'data-source' | 'string' | 'json' | 'number'

interface IPropData {
    format: 'value' | 'variable' | 'expression',
    code: Any,
    valueType: PropValueTypeType,
    payload: IPayloadData,
    renderValue: Any
}
```

#### - node.renderDirectives
``` typescript
interface IDirectiveData {
    type: 'v-model' | 'v-for' | 'v-if' | 'v-show',
    prop: String
    format: 'value' | 'variable' | 'expression',
    code: Any,
    renderValue: Any
}
```

#### - node.renderSlots
``` typescript
type SlotValueTypeType = 'Array' | 'remote' | 'data-source' | 'text'

interface ISlotData {
    format: 'value' | 'variable' | 'expression',
    component: String,
    code: Any,
    valueType: SlotValueTypeType,
    payload: IPayloadData,
    renderValue: Any
}
```

#### - node.renderStyles
``` typescript
type StyleData = String | Number 
```

