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
        // | public static property
        // +----------------------------------------------------------------------
        /**
         *
         * @type {number}
         */
        public static CONTENT_NONE:number = 0x000000;

        /**
         *
         * @type {number}
         */
        public static CONTENT_TOP:number = 0x100000;

        /**
         *
         * @type {number}
         */
        public static CONTENT_LEFT:number = 0x010000;

        /**
         *
         * @type {number}
         */
        public static CONTENT_RIGHT:number = 0x001000;

        /**
         * 
         * @type {number}
         */
        public static CONTENT_BOTTOM:number = 0x000100;

        /**
         *
         * @type {number}
         */
        public static CONTENT_CENTER:number = 0x000010;

        /**
         * 
         * @type {number}
         */
        public static CONTENT_CENTER_BOTTOM:number = 0x000001;

        // +----------------------------------------------------------------------
        // | public property
        // +----------------------------------------------------------------------

        /**
         * 顶部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public topElement:HTMLElement = null;
        public topContentElement:HTMLElement = null;

        /**
         * 底部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public bottomElement:HTMLElement = null;
        public bottomContentElement:HTMLElement = null;

        /**
         * 左侧 HTMLElement 对象
         * @type {null}
         */
        public leftElement:HTMLElement = null;
        public leftContentElement:HTMLElement = null;

        /**
         * 右侧 HTMLElement 对象
         * @type {HTMLElement}
         */
        public rightElement:HTMLElement = null;
        public rightContentElement:HTMLElement = null;

        /**
         * 中间 HTMLElement 对象
         * @type {HTMLElement}
         */
        public centerElement:HTMLElement = null;
        public centerContentElement:HTMLElement = null;

        public centerBottomElement:HTMLElement = null;
        public centerBottomContentElement:HTMLElement = null;

        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------
        /**
         * 构造函数
         * @param options
         */
        constructor(options:any = null)
        {
            super(options);
        }

        // +----------------------------------------------------------------------
        // | protected method
        // +----------------------------------------------------------------------

        protected _init():void
        {
            if (!this.options) this.options = new LayoutOptions();
            this.id = this.options.id || Component.generateId();
        }

        /**
         * 初始化
         * @private
         */
        protected _render():void
        {
            this.element = document.createElement("div");
            this.element.className = "layout";
            this.element.id = this.id;

            var content:string = this.options.content.toString(16);
            // top
            if (content.substr(0, 1) == "1")
            {
                this.topElement = document.createElement("div");
                this.topElement.className = "layout-top";
                this.topElement.style.top = "0";
                this.topElement.style.height = this.options.topHeight + "px";
                this.element.appendChild(this.topElement);

                this.topContentElement = document.createElement("div");
                this.topContentElement.className = "layout-content";
                this.topElement.appendChild(this.topContentElement);
            }
            // left
            if (content.substr(1, 1) == "1")
            {
                this.leftElement = document.createElement("div");
                this.leftElement.className = "layout-left";
                this.leftElement.style.left = "0";
                this.leftElement.style.width = this.options.leftWidth + "px";
                this.leftElement.style.minWidth = this.options.minLeftWidth + "px";
                this.element.appendChild(this.leftElement);

                this.leftContentElement = document.createElement("div");
                this.leftContentElement.className = "layout-content";
                this.leftElement.appendChild(this.leftContentElement);
            }
            // right
            if (content.substr(2, 1) == "1")
            {
                this.rightElement = document.createElement("div");
                this.rightElement.className = "layout-right";
                this.rightElement.style.width = this.options.rightWidth + "px";
                this.rightElement.style.minWidth = this.options.minRightWidth + "px";
                this.element.appendChild(this.rightElement);

                this.rightContentElement = document.createElement("div");
                this.rightContentElement.className = "layout-content";
                this.rightElement.appendChild(this.rightContentElement);
            }
            // bottom
            if (content.substr(3, 1) == "1")
            {
                this.bottomElement = document.createElement("div");
                this.bottomElement.className = "layout-bottom";
                this.bottomElement.style.height = this.options.bottomHeight + "px";
                this.element.appendChild(this.bottomElement);

                this.bottomContentElement = document.createElement("div");
                this.bottomContentElement.className = "layout-content";
                this.bottomElement.appendChild(this.bottomContentElement);
            }
            // center
            if (content.substr(4, 1) == "1")
            {
                this.centerElement = document.createElement("div");
                this.centerElement.className = "layout-center";
                this.centerElement.style.width = this.options.centerWidth;
                this.element.appendChild(this.centerElement);

                this.centerContentElement = document.createElement("div");
                this.centerContentElement.className = "layout-content";
                this.centerElement.appendChild(this.centerContentElement);

                if (content.substr(5, 1) == "1")
                {
                    this.centerBottomElement = document.createElement("div");
                    this.centerBottomElement.className = "layout-center-bottom";
                    this.centerBottomElement.style.width = this.options.centerWidth;

                    this.centerBottomContentElement = document.createElement("div");
                    this.centerBottomContentElement.className = "layout-content";
                    this.centerBottomElement.appendChild(this.centerBottomContentElement);
                }
            }
        }
    }
}