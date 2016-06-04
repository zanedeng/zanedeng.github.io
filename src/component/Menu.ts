/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * @class zane.web.component.Menu
     */
    export class Menu extends Component
    {
        // +----------------------------------------------------------------------
        // | public property
        // +----------------------------------------------------------------------

        /**
         * 菜单子项数量
         */
        public menuItemCount:number;

        /**
         * 子菜单缓存池
         */
        public subMenuDict:any;

        /**
         * 分割线
         * @type {HTMLElement}
         */
        public menuYLineElement:HTMLElement;

        /**
         * 鼠标移上的效果层
         * @type {HTMLElement}
         */
        public menuOverElement:HTMLElement;

        /**
         * 鼠标移上的效果层
         * @type {HTMLElement}
         */
        public menuOverLElement:HTMLElement;

        /**
         * 鼠标移上的效果层
         * @type {HTMLElement}
         */
        public menuOverRElement:HTMLElement;

        /**
         * @type {HTMLElement}
         */
        public menuInnerElement:HTMLElement;

        /**
         * 阴影效果
         * @type {HTMLElement}
         */
        public shadowElement:HTMLElement;

        // +----------------------------------------------------------------------
        // | private property
        // +----------------------------------------------------------------------

        private showedSubMenu:boolean;
        private mouseleaveBindFun:any;
        private itemMouseEnterBindFun:any;
        private itemMouseLeaveBindFun:any;

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

        /**
         * 显示菜单
         * @param options
         */
        public show(options:any = null):void
        {
            if (options && options.left != undefined)
            {
                this.element.style.left = options.left + "px";
            }
            if (options && options.top != undefined)
            {
                this.element.style.top = options.top + "px";
            }
            zane.HtmlUtl.show(this.element);
            this.updateShadow();
        }

        /**
         * 隐藏
         */
        public hide():void
        {
            this.hideAllSubMenu();
            zane.HtmlUtl.hide(this.element);
            this.updateShadow();
        }

        /**
         * 显示/隐藏
         */
        public toggle():void
        {
            zane.HtmlUtl.toggle(this.element);
            this.updateShadow();
        }

        /**
         * 添加菜单项
         * @param data
         * @param target
         */
        public addItem(data:any, target:HTMLElement = null):void
        {
            if (!data) return;
            if (target == null) target = this.element;
            if (data.line)
            {
                var menuItemLine = document.createElement("div");
                menuItemLine.className = "menu-item-line";
                target.appendChild(menuItemLine);
            }
            else
            {
                // 菜单项容器
                var menuItem = document.createElement("div");
                menuItem.className = "menu-item";
                menuItem.setAttribute("menuItemID", (this.menuItemCount++).toString());
                menuItem.addEventListener("mouseenter", this.itemMouseEnterBindFun, false);
                menuItem.addEventListener("mouseleave", this.itemMouseLeaveBindFun, false);
                if (data.id)
                {
                    menuItem.id = data.id;
                }
                target.appendChild(menuItem);

                // 菜单项文字内容
                var menuItemText = document.createElement("div");
                menuItemText.className = "menu-item-text";
                if (data.text)
                {
                    menuItemText.innerText = data.text;
                }
                menuItem.appendChild(menuItemText);

                // 菜单项的ICON
                var menuItemIcon;
                if (data.icon)
                {
                    menuItemIcon = document.createElement("div");
                    menuItemIcon.className = "menu-item-icon icon-" + data.icon;
                    menuItem.appendChild(menuItemIcon);
                }

                if (data.img)
                {
                    menuItemIcon = document.createElement("div");
                    menuItemIcon.className = "menu-item-ico";
                    menuItemIcon.innerHTML = "<img style=\"width:16px;height:16px;margin:2px;\" src=\"" + data.img + "\" />";
                    menuItem.appendChild(menuItemIcon);
                }

                if (data.disable || data.disabled)
                {
                    zane.HtmlUtl.addClass(menuItem, "menu-item-disable");
                }

                // 子菜单
                if (data.children)
                {
                    // 菜单项有子菜单的标识箭头
                    var menuItemArrow = document.createElement("div");
                    menuItemArrow.className = "menu-item-arrow";
                    menuItem.appendChild(menuItemArrow);
                    // 子菜单
                    var subMenuOptions = new MenuOptions();
                    subMenuOptions.width = this.options.width;
                    subMenuOptions.customClass = this.options.customClass;
                    subMenuOptions.shadow = this.options.shadow;
                    subMenuOptions.menuData = data.children;
                    this.subMenuDict[menuItem.getAttribute("menuItemID")] = new Menu(this.parent, subMenuOptions);
                }

            }
        }

        public removeItem():void
        {

        }

        /**
         * 隐藏所有子菜单
         */
        public hideAllSubMenu():void
        {
            for (var id in this.subMenuDict)
            {
                var subMenu:Menu = this.subMenuDict[id];
                subMenu.hide();
            }
            this.showedSubMenu = false;
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
            if (!this.options) this.options = new MenuOptions();
            this.menuItemCount = 0;
            this.subMenuDict = {};
            this.showedSubMenu = false;
            this.mouseleaveBindFun = this.onMouseLeave.bind(this);
            this.itemMouseEnterBindFun = this.onItemMouseEnter.bind(this);
            this.itemMouseLeaveBindFun = this.onItemMouseLeave.bind(this);
        }

        /**
         * 渲染视图组件
         * @private
         */
        protected _render():void
        {
            this.element = document.createElement("div");
            this.element.className = "menu";
            this.element.style.display = "none";
            this.element.style.left = this.options.x + "px";
            this.element.style.top = this.options.y + "px";
            this.element.style.width = this.options.width + "px";
            this.element.addEventListener("mouseleave", this.mouseleaveBindFun, false);
            if (this.parent)
            {
                this.parent.appendChild(this.element);
            }

            this.menuYLineElement = document.createElement("div");
            this.menuYLineElement.className = "menu-yline";
            this.element.appendChild(this.menuYLineElement);

            this.menuOverElement = document.createElement("div");
            this.menuOverElement.className = "menu-over";
            this.element.appendChild(this.menuOverElement);

            this.menuOverLElement = document.createElement("div");
            this.menuOverLElement.className = "menu-over-l";
            this.menuOverElement.appendChild(this.menuOverLElement);

            this.menuOverRElement = document.createElement("div");
            this.menuOverRElement.className = "menu-over-r";
            this.menuOverElement.appendChild(this.menuOverRElement);

            this.menuInnerElement = document.createElement("div");
            this.menuInnerElement.className = "menu-inner";
            this.element.appendChild(this.menuInnerElement);

            if (this.options.shadow)
            {
                this.shadowElement = document.createElement("div");
                this.shadowElement.className = "menu-shadow";
                this.parent.appendChild(this.shadowElement);
                this.updateShadow();
            }

            if (this.options.customClass)
            {
                this.element.className = this.options.customClass;
            }
            if (this.options.menuData)
            {
                for (var i = 0, l = this.options.menuData.length; i < l; ++i)
                {
                    this.addItem(this.options.menuData[i]);
                }
            }
        }

        // +----------------------------------------------------------------------
        // | private method
        // +----------------------------------------------------------------------

        /**
         * 更新阴影位置
         */
        private updateShadow():void
        {
            if (this.shadowElement)
            {
                this.shadowElement.style.left = this.element.style.left;
                this.shadowElement.style.top = this.element.style.top;
                this.shadowElement.style.display = this.element.style.display;
                this.shadowElement.style.width = (zane.HtmlUtl.outerWidth(this.element) - 2) + "px";
                this.shadowElement.style.height = (zane.HtmlUtl.outerHeight(this.element) - 2) + "px";
            }
        }

        private onMouseLeave(e)
        {
            if (!this.showedSubMenu)
            {
                this.menuOverElement.style.top = "-24px";
                this.hide();
            }
        }

        private onItemMouseEnter(e)
        {
            var item:HTMLElement = e.currentTarget;
            if (zane.HtmlUtl.hasClass(item, "menu-item-disable")) return;
            var itemTop:number = zane.HtmlUtl.getOffset(item).y;
            var menuTop:number = zane.HtmlUtl.getOffset(this.element).y;
            this.menuOverElement.style.top = (itemTop - menuTop + 2) + "px";
            this.hideAllSubMenu();
            var itemSubMenu:Menu = this.subMenuDict[item.getAttribute("menuItemID")];
            if (itemSubMenu)
            {
                itemSubMenu.show({ top: itemTop, left: zane.HtmlUtl.getOffset(this.element).x + zane.HtmlUtl.width(this.element) - 5 });
                this.showedSubMenu = true;
            }
        }

        private onItemMouseLeave(e)
        {
            var item:HTMLElement = e.currentTarget;
            if (zane.HtmlUtl.hasClass(item, "menu-item-disable")) return;
            var itemSubMenu:Menu = this.subMenuDict[item.getAttribute("menuItemID")];
            if (itemSubMenu)
            {

            }
        }
    }
}