///<reference path="../../libs/ts/zane.utils.d.ts" />
///<reference path="./Component.ts" />
/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * 布局类
     * @class Layout
     */
    export class Layout extends Component
    {

        // +----------------------------------------------------------------------
        // | public property
        // +----------------------------------------------------------------------

        /**
         * 顶部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public topElement:HTMLElement = null;

        /**
         *
         * @type {null}
         */
        public topContentElement:HTMLElement = null;

        /**
         * 顶部内容高度
         * @type {number}
         */
        public topHeight:number = 50;

        /**
         * 底部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public bottomElement:HTMLElement = null;

        /**
         * 底部内容高度
         * @type {number}
         */
        public bottomHeight:number = 50;

        /**
         * 左侧 HTMLElement 对象
         * @type {null}
         */
        public leftElement:HTMLElement = null;

        /**
         * 左侧内容高度
         * @type {number}
         */
        public leftWidth:number = 110;

        /**
         * 中间 HTMLElement 对象
         * @type {HTMLElement}
         */
        public centerElement:HTMLElement = null;

        /**
         * 中部内容高度
         * @type {number}
         */
        public centerWidth:number = 300;

        /**
         * 右侧 HTMLElement 对象
         * @type {HTMLElement}
         */
        public rightElement:HTMLElement = null;

        /**
         * 右侧内容高度
         * @type {number}
         */
        public rightWidth:number = 170;

        /**
         * 中下部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public centerBottomElement:HTMLElement = null;
        /**
         * 中底部内容高度
         * @type {number}
         */
        public centerBottomHeight:number = 100;

        /**
         *
         * @type {boolean}
         */
        public allowCenterBottomResize:boolean = true;

        /**
         * 是否以窗口的高度为准 height设置为百分比时可用
         * @type {boolean}
         */
        public inWindow:boolean = true;

        /**
         * 高度补差
         * @type {number}
         */
        public heightDiff:number = 0;

        /**
         * 高度
         * @type {string}
         */
        public height:string = '100%';

        /**
         * 是否允许 左边可以隐藏
         * @type {boolean}
         */
        public allowLeftCollapse:boolean = true;

        /**
         * 初始化时 左边是否隐藏
         * @type {boolean}
         */
        public isLeftCollapse:boolean = false;

        /**
         * 是否允许 左边可以调整大小
         * @type {boolean}
         */
        public allowLeftResize:boolean = true;

        /**
         * 是否允许 右边可以隐藏
         * @type {boolean}
         */
        public allowRightCollapse:boolean = true;

        /**
         * 初始化时 右边是否隐藏
         * @type {boolean}
         */
        public isRightCollapse:boolean = false;

        /**
         * 是否允许 右边可以调整大小
         * @type {boolean}
         */
        public allowRightResize:boolean = true;

        /**
         * 是否允许 头部可以调整大小
         * @type {boolean}
         */
        public allowTopResize:boolean = true;

        /**
         * 是否允许 底部可以调整大小
         * @type {boolean}
         */
        public allowBottomResize:boolean = true;

        /**
         * 间隔
         * @type {number}
         */
        public space:number = 3;

        /**
         * 调整左侧宽度时的最小允许宽度
         * @type {number}
         */
        public minLeftWidth:number = 80;

        /**
         * 调整右侧宽度时的最小允许宽度
         * @type {number}
         */
        public minRightWidth:number = 80;

        /**
         * 调整大小结束事件
         * @type {Function}
         */
        public onEndResize:Function = null;

        /**
         * 左边收缩/展开事件
         * @type {Function}
         */
        public onLeftToggle:Function = null;

        /**
         * 右边收缩/展开事件
         * @type {null}
         */
        public onRightToggle:Function = null;

        /**
         * 高度发生改变的事件
         * @type {Function}
         */
        public onHeightChanged:Function = null;

        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------
        /**
         * 构造函数
         * @param element
         * @param options
         */
        constructor(element:HTMLElement = null, options:any = {})
        {
            super(element, options);
        }

        // +----------------------------------------------------------------------
        // | protected method
        // +----------------------------------------------------------------------

        /**
         * 初始化
         * @private
         */
        protected _init():void
        {
            zane.HtmlUtl.addClass(this.element, "layout");
            var i,l;
            var topElements = zane.HtmlUtl.find(this.element, 'div[position="top"]');
            if (topElements.length > 0)
            {
                for (i = 0, l = topElements.length; i < l; ++i)
                {
                    this.topContentElement = topElements[i];
                    this.topElement = document.createElement("div");
                    this.topElement.className = "layout-top";
                    this.topElement.style.top = "0";
                    this.element.insertBefore(this.topElement, this.topContentElement);
                }
            }
        }
    }
}