# 组件UI库记录

## JavaScript

### intro.js: 向导

* 简单易用的向导，用起来还行: [Github](https://github.com/usablica/intro.js)

```js
introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'skipLabel': '退出',
    'nextLabel': '下一步',
    'prevLabel': '上一步',
    'doneLabel': '完成'
}).addSteps([{
    element: document.getElementById("workShortcutsStart"),
    intro: "<div style='text-align: center'><b style='font-size: 16px'>欢迎来到工作台</b><ul><li>^_^&nbsp;这是一个简单的向导</li></ul></div>",
    disableInteraction: true // 是否禁止交互
}, {
    element: document.getElementById("workShortcutsHead"),
    intro: "<div style='text-align: center'><ul><li>鼠标按住<b>标题空白处</b>或者<b>标题右侧拖动按钮</b>即可<b>拖动视图</b>哦</li></ul></div>",
    disableInteraction: true // 是否禁止交互
}, {
    element: document.getElementById("shortcuts"),
    intro: "<div style='text-align: center'><ul><li>每一个快捷方式都可以<b>直接按住拖动</b>哦</li></ul></div>",
    disableInteraction: true // 是否禁止交互
}, {
    element: document.getElementById("workShortcutsEdit"),
    intro: "<div style='text-align: center'><ul><li>点击<b>定制工作台</b>快捷功能即可<b>定制视图</b>哦</li></ul></div>",
    disableInteraction: true // 是否禁止交互
}, {
    element: document.getElementById("workShortcutsEditBtn"),
    intro: "<div style='text-align: center'><ul><li>点击右上角的<b>定制</b>按钮即可<b>定制快捷功能</b>哦</li></ul></div>",
    disableInteraction: true // 是否禁止交互
}, {
    element: document.getElementById("workShortcutsIntroJsBtn"),
    intro: "<div style='text-align: center'><ul><li>点击右上角的<b>向导</b>按钮即可<b>查看向导(帮助)</b>哦</li></ul></div>",
    disableInteraction: true // 是否禁止交互
}]).start();
```

### dragula: 拖拽

* 简单易用的拖拽，用起来还行: [Github](https://github.com/bevacqua/dragula)
* 还有一个之前发现的dnd，就写了下demo: [Github](https://github.com/qgh810/dnd)

```js
dragula([document.getElementById('work')], {
    removeOnSpill: true,
    moves: function (el, container, handle) {
        return handle.classList.contains('workHandle');
    }
}).on('drag', function (el) {
    // console.log('drag');
}).on('drop', function (el) {
    // console.log('drop');
}).on('over', function (el, container) {
    // console.log('over');
}).on('out', function (el, container) {
    // console.log('out');
});
```

### canvi: 侧边栏

* 一个简单的普通JavaScript非画布菜单，一般般，不是很好用: [Github](https://github.com/thepinecode/canvi)

## JQuery

### jQuery-Autocomplete: 搜索自动补全

* 一个输入框搜索自动补全插件，挺好用的: [Github](https://github.com/devbridge/jQuery-Autocomplete)

```css
.autocomplete-suggestions { border: solid #e6e6e6 1px; background: #FFF; overflow: auto; }
.autocomplete-suggestion { padding: 5px 10px; white-space: nowrap; overflow: hidden; }
.autocomplete-selected { background: #F0F0F0; }
.autocomplete-suggestions strong { font-weight: normal; color: #2AABFF; }
.autocomplete-group { padding: 5px 10px; }
.autocomplete-group strong { display: block; border-bottom: 1px solid #000; }
```

```js
// 输入搜索框初始化
var countries = ["测试", "测试1", "测试2", "测试3"];
$('#test').autocomplete({
    // 搜索数组
    lookup: countries,
    // 选中回调事件
    onSelect: function (suggestion) {
        // suggestion为选中的对象
        console.log(suggestion);
    }
});
```

### jquery-loading: 加载遮罩

* 这个一般: [jquery-loading](https://github.com/CarlosBonetti/jquery-loading)
* 这个加强版不错: [jquery-loading-overlay](https://github.com/gasparesganga/jquery-loading-overlay)

## LayUI

### notice: 通知消息

* 还行(PDMS): [LayUI](https://fly.layui.com/extend/notice)

### formSelects: 下拉多选

* 还行: [LayUI](https://fly.layui.com/extend/formSelects)

### dtree: 树

* 还行: [LayUI](https://fly.layui.com/extend/dtree)

### step: 分步

* 自己补全了很多东西(PDMS)，源地址: [Github](https://github.com/hsiangleev/layuiExtend/tree/master/step)

## Vue

### element: UI

* 饿了么Vue的UI: [element](https://element.eleme.cn)

### vant: UI

* 有赞移动端UI: [vant](https://github.com/youzan/vant)

## React

### react-beautiful-dnd: 拖拽

* React版拖拽组件，没用过: [Github](https://github.com/atlassian/react-beautiful-dnd)