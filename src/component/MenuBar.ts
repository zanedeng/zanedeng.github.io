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
        // | public property
        // +----------------------------------------------------------------------

        /**
         * 菜单数量
         * @type {HTMLElement}
         */
        public menuCount:number;

        // +----------------------------------------------------------------------
        // | private property
        // +----------------------------------------------------------------------

        /**
         * 菜单缓存池
         * @type {Object}
         */
        private menuDict:any;

        /**
         *
         * @type {Array}
         */
        private menuBarItems:Array<HTMLElement>;

        /**
         *
         * @type {boolean}
         */
        private showMenu:boolean;

        /**
         * 当前显示的菜单
         * @type {Menu}
         */
        private currentShowMenu:Menu;

        /**
         * @type {HTMLElement}
         */
        private currentSelectMenuBarItem:HTMLElement;


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
        constructor(options:any = null, parent:HTMLElement = null)
        {
            super(options, parent);
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
                menuBarItem.setAttribute("menuBarId", (this.menuCount++).toString());
                this.element.appendChild(menuBarItem);
                this.menuBarItems.push(menuBarItem);

                if (data.id)
                {
                    menuBarItem.id = data.id;
                }

                if (data.disable || data.disabled)
                {
                    zane.HtmlUtl.addClass(menuBarItem, "menubar-item-disable");
                }

                if (data.click)
                {
                    menuBarItem.addEventListener("mouseenter", function (e) {
                        data.click(data);
                    }, false);
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

                if (data.menu)
                {
                    this.menuDict[menuBarItem.getAttribute("menuBarId")] = new Menu(data.menu);
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
            if (!this.options) this.options = new MenuBarOptions();
            this.menuDict = {};
            this.menuBarItems = [];
            this.menuCount = 0;
            this.showMenu = false;
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

            var self = this;
            document.addEventListener("click", function(e){
                var parent = <HTMLElement>e.target;
                var isMenuBarItem:boolean = false;
                while (parent)
                {
                    for (var i = 0, l = self.menuBarItems.length; i < l; ++i)
                    {
                        if (parent == self.menuBarItems[i])
                        {
                            isMenuBarItem = true;
                            parent = null;
                            break;
                        }
                    }
                    if (parent) parent = parent.parentElement;
                }
                if (!isMenuBarItem)
                {
                    if (self.showMenu) self.showMenu = false;
                    if (self.currentShowMenu) self.currentShowMenu.hide();
                    if (self.currentSelectMenuBarItem) zane.HtmlUtl.removeClass(self.currentSelectMenuBarItem, "menu-btn-selected");
                }
            }, false);
        }

        // +----------------------------------------------------------------------
        // | private method
        // +----------------------------------------------------------------------

        /**
         *
         * @param menuBarItem
         * @returns {Menu}
         */
        private getMenu(menuBarItem:HTMLElement):Menu
        {
            var menuBarId = menuBarItem.getAttribute("menuBarId");
            return this.menuDict[menuBarId];
        }

        /**
         *
         * @param menuBarItem
         */
        private showMenuBarItemMenu(menuBarItem:HTMLElement):void
        {
            if (this.currentShowMenu) this.currentShowMenu.hide();
            var menu:Menu = this.getMenu(menuBarItem);
            if (menu)
            {
                zane.HtmlUtl.addClass(menuBarItem, "menu-btn-over");
                zane.HtmlUtl.addClass(menuBarItem, "menu-btn-selected");
                var offset = zane.HtmlUtl.getOffset(menuBarItem);
                menu.show({ top: offset.y + zane.HtmlUtl.outerHeight(menuBarItem), left: offset.x - 1});
                this.currentShowMenu = menu;
            }
        }


        // +----------------------------------------------------------------------
        // | eventing
        // +----------------------------------------------------------------------

        /**
         * 鼠标进入事件
         * @param e
         */
        private onMouseEnter(e):void
        {
            if (this.currentSelectMenuBarItem)
            {
                zane.HtmlUtl.removeClass(this.currentSelectMenuBarItem, "menu-btn-over");
                zane.HtmlUtl.removeClass(this.currentSelectMenuBarItem, "menu-btn-selected");
            }
            var menuBarItem:HTMLElement = e.currentTarget;
            zane.HtmlUtl.addClass(menuBarItem, "menu-btn-over");
            this.currentSelectMenuBarItem = menuBarItem;
            if (this.showMenu)
            {
                this.showMenuBarItemMenu(menuBarItem);
            }
        }

        /**
         * 鼠标点击事件
         * @param e
         */
        private onMouseDown(e):void
        {
            var menuBarItem:HTMLElement = e.currentTarget;
            this.showMenu = true;
            this.showMenuBarItemMenu(menuBarItem);
        }

        /**
         * 鼠标离开事件
         * @param e
         */
        private onMouseLeave(e):void
        {
            var menuBarItem:HTMLElement = e.currentTarget;
            zane.HtmlUtl.removeClass(menuBarItem, "menu-btn-over");
            if (this.showMenu)
            {

            }
        }
    }
}