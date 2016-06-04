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
        private mouseleaveBinFun:any;

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
         * @param menu
         */
        public show(options:any = null, menu:HTMLElement = null):void
        {
            if (!menu) menu = this.element;
            if (options && options.left != undefined)
            {
                menu.style.left = options.left + "px";
            }
            if (options && options.top != undefined)
            {
                menu.style.top = options.top + "px";
            }
            zane.HtmlUtl.show(menu);
            this.updateShadow();
        }

        /**
         * 隐藏
         * @param menu
         */
        public hide(menu:HTMLElement = null):void
        {
            if (!menu) menu = this.element;
            this.hideAllSubMenu();
            zane.HtmlUtl.hide(menu);
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
                    this.subMenuDict[menuItem.getAttribute("menuItemID")] = new Menu(this.parent, data.children);
                }

            }
        }

        public removeItem():void
        {

        }


        public hideAllSubMenu():void
        {

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
            this.mouseleaveBinFun = this.onMouseLeave.bind(this);
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
            this.element.addEventListener("mouseleave", this.mouseleaveBinFun, false);
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
                this.shadowElement.style.width = zane.HtmlUtl.outerWidth(this.shadowElement) + "px";
                this.shadowElement.style.height = zane.HtmlUtl.outerHeight(this.shadowElement) + "px";
            }
        }

        private onMouseLeave(e)
        {
            if (!this.showedSubMenu)
            {
                this.menuOverElement.style.top = "-24px";
            }
        }
    }
}