/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * 菜单组件
     * @class zane.web.component.MenuBar
     */
    export class MenuBar extends Component
    {

        // +----------------------------------------------------------------------
        // | private property
        // +----------------------------------------------------------------------

        /**
         * 菜单缓存池
         */
        private menuDict:any;

        /**
         * 当前显示的菜单
         */
        private currentShowMenu:Menu;

        private mouseenterBindFun:any;
        private mousedownBindFun:any;
        private mouseleaveBindFun:any;

        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------

        /**
         * 构造函数
         * @param parent
         * @param options
         */
        constructor(parent:HTMLElement, options:any = null)
        {
            super(parent, options);
        }

        // +----------------------------------------------------------------------
        // | public method
        // +----------------------------------------------------------------------

        public addItem(data:any = null):void
        {
            if (data)
            {
                var menuBarItem = document.createElement("div");
                menuBarItem.className = "menubar-item menu-btn";
                this.element.appendChild(menuBarItem);

                if (data.id)
                {
                    menuBarItem.setAttribute("menuBarId", data.id);
                }

                if (data.disable || data.disabled)
                {
                    zane.HtmlUtl.addClass(menuBarItem, "menubar-item-disable");
                }

                if (data.click)
                {
                    menuBarItem.onclick = function (e) {
                        data.click(menuBarItem);
                    };
                }

                var itemText = document.createElement("span");
                if (data.text) itemText.innerText = data.text;
                menuBarItem.appendChild(itemText);

                var itemBtnL = document.createElement("div");
                itemBtnL.className = "menu-btn-l";
                menuBarItem.appendChild(itemBtnL);

                var itemBtnR = document.createElement("div");
                itemBtnR.className = "menu-btn-r";
                menuBarItem.appendChild(itemBtnR);

                if (data.memu)
                {
                    this.menuDict[menuBarItem.getAttribute("menuBarId")] = new Menu(document.body, data.memu);
                }
                else
                {
                    var itemDown = document.createElement("div");
                    itemDown.className = "menubar-item-down";
                    menuBarItem.appendChild(itemDown);
                }

                menuBarItem.addEventListener("mouseenter", this.mouseenterBindFun, false);
                menuBarItem.addEventListener("mouseleave", this.mouseleaveBindFun, false);
                menuBarItem.addEventListener("mousedown", this.mousedownBindFun, false);
            }
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
            if (!this.options) this.options = new LayoutOptions();
            this.menuDict = {};
            this.mouseenterBindFun = this.onMouseEnter.bind(this);
            this.mousedownBindFun = this.onMouseDown.bind(this);
            this.mouseleaveBindFun = this.onMouseLeave.bind(this);
        }

        /**
         * 渲染视图组件
         * @private
         */
        protected _render():void
        {
            this.element = document.createElement("div");
            this.element.className = "menubar";
            if (this.parent)
            {
                this.parent.appendChild(this.element);
            }

            if (this.options.menuBarData)
            {
                for (var i = 0, l = this.options.menuBarData.length; i < l; ++i)
                {
                    this.addItem(this.options.menuBarData[i]);
                }
            }
        }

        // +----------------------------------------------------------------------
        // | private method
        // +----------------------------------------------------------------------

        private onMouseEnter(e):void
        {
            var menuBarItem:HTMLElement = e.currentTarget;
            zane.HtmlUtl.addClass(menuBarItem, "menu-btn-over");
        }

        private onMouseDown(e):void
        {
            var menuBarItem:HTMLElement = e.currentTarget;
        }

        private onMouseLeave(e):void
        {
            var menuBarItem:HTMLElement = e.currentTarget;
            zane.HtmlUtl.removeClass(menuBarItem, "menu-btn-over");
        }
    }
}