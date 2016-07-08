/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * @class zane.web.component.TreeOptions
     */
    export class TreeOptions
    {
        public url:string;

        public urlParms:string;

        public data:any;

        public checkbox:boolean = true;

        public autoCheckboxEven:boolean = true;

        /**
         * 是否启用半选择状态
         * @type {boolean}
         */
        public enabledCompleteCheckbox:boolean = true;

        /**
         * 父节点 ICON 图标
         * @type {string}
         */
        public parentIcon:string = "folder";

        /**
         * 子节点 ICON 图标
         * @type {string}
         */
        public childIcon:string = "leaf";

        /**
         * id 字段名
         * @type {string}
         */
        public idFieldName:string = "id";

        /**
         * id字段
         */
        public idField:any;

        /**
         * 文本字段名
         * @type {string}
         */
        public textFieldName:string = "text";

        /**
         * 图标字段名
         * @type {string}
         */
        public iconFieldName:string = "icon";

        /**
         * 图标样式字段名称
         */
        public iconClsFieldName:string;

        /**
         * parent id字段，可用于线性数据转换为tree数据
         */
        public parentIDField:any;

        /**
         * 父级ID字段名
         */
        public parentIDFieldName:string;

        /**
         * 根节点 ID 取值
         * @type {number}
         */
        public topParentIDValue:number = 0;

        /**
         * 属性
         * @type {string|string[]}
         */
        public attribute:string[] = ['id', 'url'];

        /**
         * 是否显示line
         * @type {boolean}
         */
        public treeLine:boolean = true;

        /**
         * 节点宽度
         * @type {number}
         */
        public nodeWidth:number = 90;

        /**
         *
         * @type {string}
         */
        public statusName:string = "__status";

        /**
         * 是否子节点的判断函数
         */
        public isLeaf:Function;

        /**
         * 是否单选
         * @type {boolean}
         */
        public single:boolean = false;

        /**
         * 已选的是否需要取消操作
         * @type {boolean}
         */
        public needCancel:boolean = true;

        /**
         * 是否以动画的形式显示
         * @type {boolean}
         */
        public slide:boolean = true;

        /**
         * 节点是否允许拖拽
         * @type {boolean}
         */
        public nodeDraggable:boolean = false;

        /**
         * 节点拖拽渲染器
         */
        public nodeDraggingRender:any;

        /**
         * 是否点击展开/收缩 按钮时才有效
         * @type {boolean}
         */
        public btnClickToToggleOnly:boolean = true;

        /**
         * ajax 提交方式
         * @type {string}
         */
        public ajaxType:string = "post";

        /**
         *
         * @type {string}
         */
        public ajaxContentType:string;

        /**
         * 自定义渲染器
         */
        public render:any;

        /**
         * 可选择判断函数
         */
        public selectable:any;

        /**
         * 是否展开, 优先级没有节点数据的isexpand属性高,并没有delay属性高
         * 1,可以是true/false
         * 2,也可以是数字(层次)N 代表第1层到第N层都是展开的，其他收缩
         * 3,或者是判断函数 函数参数e(data,level) 返回true/false
         */
        public isExpand:any;

        /**
         * 是否延迟加载, 优先级没有节点数据的delay属性高
         * 1,可以是true/false
         * 2,也可以是数字(层次)N 代表第N层延迟加载
         * 3,或者是字符串(Url) 加载数据的远程地址
         * 4,如果是数组,代表这些层都延迟加载,如[1,2]代表第1、2层延迟加载
         * 5,再是函数(运行时动态获取延迟加载参数) 函数参数e(data,level),返回true/false或者{url:...,parms:...}
         */
        public delay:any;

        /**
         *
         * @type {Function}
         */
        public onBeforeExpand:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onContextmenu:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onExpand:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onBeforeCollapse:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onCollapse:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onBeforeSelect:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onSelect:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onBeforeCancelSelect:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onCancelselect:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onCheck:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onSuccess:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onError:Function = function () { };

        /**
         *
         * @type {Function}
         */
        public onClick:Function = function () { };

        /**
         * 加载数据前事件，可以通过return false取消操作
         * @type {Function}
         */
        public onBeforeAppend:Function = function () { };

        /**
         * 加载数据时事件，对数据进行预处理以后
         * @type {Function}
         */
        public onAppend:Function = function () { };

        /**
         * 加载数据完事件
         * @type {Function}
         */
        public onAfterAppend:Function = function () { };
    }
}