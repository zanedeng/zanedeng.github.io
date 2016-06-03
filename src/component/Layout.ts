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
        public topElement:HTMLElement;
        public topContentElement:HTMLElement;
        public topDropElement:HTMLElement;

        /**
         * 底部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public bottomElement:HTMLElement;
        public bottomContentElement:HTMLElement;
        public bottomDropElement:HTMLElement;

        /**
         * 左侧 HTMLElement 对象
         * @type {null}
         */
        public leftElement:HTMLElement;
        public leftContentElement:HTMLElement;
        public leftDropElement:HTMLElement;
        public leftCollapseElement:HTMLElement;

        /**
         * 右侧 HTMLElement 对象
         * @type {HTMLElement}
         */
        public rightElement:HTMLElement;
        public rightContentElement:HTMLElement;
        public rightDropElement:HTMLElement;
        public rightCollapseElement:HTMLElement;

        /**
         * 中间 HTMLElement 对象
         * @type {HTMLElement}
         */
        public centerElement:HTMLElement;
        public centerContentElement:HTMLElement;

        public centerBottomElement:HTMLElement;
        public centerBottomContentElement:HTMLElement;
        public centerBottomDropElement:HTMLElement;

        public lockElement:HTMLElement;

        public draggingXLineElement:HTMLElement;
        public draggingYLineElement:HTMLElement;
        public draggingMaskElement:HTMLElement;

        // +----------------------------------------------------------------------
        // | public property
        // +----------------------------------------------------------------------

        private dragType:string;
        private xResize:{startX:number,diff:number};
        private yResize:{startY:number,diff:number};
        private middleWidth:number;
        private middleHeight:number;
        private middleTop:number;
        private leftWidth:number;
        private rightWidth:number;
        private bottomTop:number;
        private centerLeft:number;
        private centerWidth:number;
        private centerBottomHeight:number;
        private layoutHeight:number;
        private rightLeft:number;
        private isLeftCollapse:boolean;
        private isRightCollapse:boolean;
        private isResize:boolean;

        private stopDragBindFun:any;
        private dragBindFun:any;
        private resizeBindFun:any;

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
         *
         * @param isCollapse
         * @returns {boolean}
         */
        public setLeftCollapse(isCollapse:boolean):boolean
        {
            if (!this.leftElement) return false;
            this.isLeftCollapse = isCollapse;
            var show = zane.HtmlUtl.show;
            var hide = zane.HtmlUtl.hide;
            if (this.isLeftCollapse)
            {
                show(this.leftCollapseElement);
                if (this.leftDropElement) hide(this.leftDropElement);
                hide(this.leftElement);
            }
            else
            {
                hide(this.leftCollapseElement);
                if (this.leftDropElement) show(this.leftDropElement);
                show(this.leftElement);
            }
            this._onResize();
            this.trigger('leftToggle', [isCollapse]);
            return true;
        }

        /**
         * 
         * @param isCollapse
         * @returns {boolean}
         */
        public setRightCollapse(isCollapse:boolean):boolean
        {
            if (!this.rightElement) return false;
            this.isRightCollapse = isCollapse;
            var show = zane.HtmlUtl.show;
            var hide = zane.HtmlUtl.hide;
            if (this.isRightCollapse)
            {
                show(this.rightCollapseElement);
                if (this.rightDropElement) hide(this.rightDropElement);
                hide(this.rightElement);
            }
            else
            {
                hide(this.rightCollapseElement);
                if (this.rightDropElement) show(this.rightDropElement);
                show(this.rightElement);
            }
            this._onResize();
            this.trigger('rightToggle', [isCollapse]);
            return true;
        }

        // +----------------------------------------------------------------------
        // | protected method
        // +----------------------------------------------------------------------

        protected _init():void
        {
            if (!this.options) this.options = new LayoutOptions();
            this.id = this.options.id || Component.generateId();
            this.leftWidth = this.options.leftWidth;
            this.rightWidth = this.options.rightWidth;
            this.isLeftCollapse = this.options.isLeftCollapse;
            this.isRightCollapse = this.options.isRightCollapse;
            this.stopDragBindFun = this._stopDrag.bind(this);
            this.dragBindFun = this._drag.bind(this);
            this.resizeBindFun = this._onResize.bind(this);
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
            this.element.style.width = this.options.width;
            this.parent.appendChild(this.element);

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
                this.centerElement.style.width = this.options.centerWidth + "px";
                this.element.appendChild(this.centerElement);

                this.centerContentElement = document.createElement("div");
                this.centerContentElement.className = "layout-content";
                this.centerElement.appendChild(this.centerContentElement);

                if (content.substr(5, 1) == "1")
                {
                    this.centerBottomElement = document.createElement("div");
                    this.centerBottomElement.className = "layout-center-bottom";
                    this.centerBottomElement.style.width = this.options.centerWidth + "px";
                    this.element.appendChild(this.centerBottomElement);

                    this.centerBottomContentElement = document.createElement("div");
                    this.centerBottomContentElement.className = "layout-content";
                    this.centerBottomElement.appendChild(this.centerBottomContentElement);
                }
            }

            this.lockElement = document.createElement("div");
            this.lockElement.className = "layout-lock";
            this.element.appendChild(this.lockElement);

            this._addDropHandle();

            this.leftCollapseElement = document.createElement("div");
            this.leftCollapseElement.className = "layout-collapse-left";
            this.leftCollapseElement.style.display = "none";
            this.element.appendChild(this.leftCollapseElement);

            this.rightCollapseElement = document.createElement("div");
            this.rightCollapseElement.className = "layout-collapse-right";
            this.rightCollapseElement.style.display = "none";
            this.element.appendChild(this.rightCollapseElement);

            this._setCollapse();
            this._build();
            this.draggingMaskElement.style.height = parseInt(this.element.style.height) + "px";
            window.addEventListener("resize", this.resizeBindFun, false);
        }

        private _addDropHandle():void
        {
            var self = this;
            // left drop element
            if (this.leftElement && this.options.allowLeftResize)
            {
                this.leftDropElement = document.createElement("div");
                this.leftDropElement.className = "layout-drop-left";
                this.leftDropElement.style.display = "block";
                this.leftDropElement.addEventListener("mousedown", function (e) {
                    self._startDrag("leftResize", e);
                }, false);
                this.element.appendChild(this.leftDropElement);
            }
            // right drop element
            if (this.rightElement && this.options.allowRightResize)
            {
                this.rightDropElement = document.createElement("div");
                this.rightDropElement.className = "layout-drop-right";
                this.rightDropElement.style.display = "block";
                this.rightDropElement.addEventListener("mousedown", function (e) {
                    self._startDrag("rightResize", e);
                }, false);
                this.element.appendChild(this.rightDropElement);
            }
            // top drop element
            if (this.topElement && this.options.allowTopResize)
            {
                this.topDropElement = document.createElement("div");
                this.topDropElement.className = "layout-drop-top";
                this.topDropElement.style.display = "block";
                this.topDropElement.addEventListener("mousedown", function (e) {
                    self._startDrag("topResize", e);
                }, false);
                this.element.appendChild(this.topDropElement);
            }
            // bottom drop element
            if (this.bottomElement && this.options.allowBottomResize)
            {
                this.bottomDropElement = document.createElement("div");
                this.bottomDropElement.className = "layout-drop-bottom";
                this.bottomDropElement.style.display = "block";
                this.bottomDropElement.addEventListener("mousedown", function (e) {
                    self._startDrag("bottomResize", e);
                }, false);
                this.element.appendChild(this.bottomDropElement);
            }
            // centerBottom drop element
            if (this.centerBottomElement && this.options.allowCenterBottomResize)
            {
                this.centerBottomDropElement = document.createElement("div");
                this.centerBottomDropElement.className = "layout-drop-center-bottom";
                this.centerBottomDropElement.style.display = "block";
                this.centerBottomDropElement.addEventListener("mousedown", function (e) {
                    self._startDrag("centerBottomResize", e);
                }, false);
                this.element.appendChild(this.centerBottomDropElement);
            }
            this.draggingXLineElement = document.createElement("div");
            this.draggingXLineElement.className = "layout-dragging-xline";
            this.element.appendChild(this.draggingXLineElement);

            this.draggingYLineElement = document.createElement("div");
            this.draggingYLineElement.className = "layout-dragging-yline";
            this.element.appendChild(this.draggingYLineElement);

            this.draggingMaskElement = document.createElement("div");
            this.draggingMaskElement.className = "dragging-mask";
            this.element.appendChild(this.draggingMaskElement);
        }

        private _startDrag(dragType:string, e:any = null):void
        {
            this.dragType = dragType;
            if (this.dragType == 'leftResize' || this.dragType == 'rightResize')
            {
                this.xResize = {startX:e.pageX, diff:0};
                this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                this.draggingYLineElement.style.top = this.middleTop + "px";
                this.draggingYLineElement.style.height = this.middleHeight + "px";
                this.draggingYLineElement.style.display = "block";

                document.body.style.cursor = "ew-resize";

                this.draggingMaskElement.style.height = parseInt(this.element.style.height) + "px";
                this.draggingMaskElement.style.display = "block";
                zane.HtmlUtl.removeClass(this.draggingMaskElement, "layout-ymask");
                zane.HtmlUtl.addClass(this.draggingMaskElement, "layout-xmask");

            }
            else if (this.dragType == 'topResize' || this.dragType == 'bottomResize')
            {
                this.yResize = {startY:e.pageY, diff:0};
                this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                this.draggingXLineElement.style.display = "block";

                document.body.style.cursor = "ns-resize";

                this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                this.draggingMaskElement.style.display = "block";
                zane.HtmlUtl.removeClass(this.draggingMaskElement, "layout-xmask");
                zane.HtmlUtl.addClass(this.draggingMaskElement, "layout-ymask");
            }
            else if (this.dragType == 'centerBottomResize')
            {
                this.yResize = {startY:e.pageY, diff:0};
                this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                this.draggingXLineElement.style.display = "block";

                document.body.style.cursor = "ns-resize";

                this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                this.draggingMaskElement.style.display = "block";
                zane.HtmlUtl.removeClass(this.draggingMaskElement, "layout-xmask");
                zane.HtmlUtl.addClass(this.draggingMaskElement, "layout-ymask");
            }
            else
            {
                return;
            }

            this.lockElement.style.width = zane.HtmlUtl.width(this.element) + "px";
            this.lockElement.style.height = zane.HtmlUtl.height(this.element) + "px";
            this.lockElement.style.display = "block";

            if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari)
            {
                // 不能选择
                document.body.onselectstart = function (e) {
                    return false;
                }
            }
            document.addEventListener("mouseup", this.stopDragBindFun, false);
            document.addEventListener("mousemove", this.dragBindFun, false);
        }

        private _setCollapse():void
        {

        }

        private _build():void
        {
            var tempNum:number = 0;
            //set top
            this.middleTop = 0;
            if (this.topElement)
            {
                this.middleTop += parseInt(this.topElement.style.height);
                tempNum = parseInt(this.topElement.style.borderTopWidth) || 1;
                this.middleTop += tempNum;
                tempNum = parseInt(this.topElement.style.borderBottomWidth) || 1;
                this.middleTop += tempNum;
                this.middleTop += this.options.space;
            }
            if (this.leftElement)
            {
                this.leftElement.style.top = this.middleTop + "px";
                this.leftCollapseElement.style.top = this.middleTop + "px";
            }
            if (this.centerElement)
            {
                this.centerElement.style.top = this.middleTop + "px";
            }
            if (this.rightElement)
            {
                this.rightElement.style.top = this.middleTop + "px";
                this.rightCollapseElement.style.top = this.middleTop + "px";
            }
            //set left
            if (this.leftElement) this.leftElement.style.left = "0";
            this._onResize();
        }
        
        private _stopDrag(e:any = null):void
        {
            var diff, tempNum;
            if (this.xResize)
            {
                diff = this.xResize.diff;
                if (this.dragType == "leftResize")
                {
                    if (this.leftWidth + this.xResize.diff < this.options.minLeftWidth)
                    {
                        this.leftWidth = this.options.minLeftWidth
                    }
                    else
                    {
                        this.leftWidth += this.xResize.diff;
                    }
                    var leftDiff:number = this.leftWidth - parseInt(this.leftElement.style.width);
                    this.leftElement.style.width = this.leftWidth + "px";
                    if (this.centerElement)
                    {
                        tempNum = parseInt(this.centerElement.style.width);
                        this.centerElement.style.width = (tempNum - leftDiff) + "px";
                        tempNum = parseInt(this.centerElement.style.left) || 0;
                        this.centerElement.style.left = (tempNum + leftDiff) + "px";
                    }
                    else if (this.rightElement)
                    {
                        tempNum = parseInt(this.leftElement.style.width);
                        this.rightElement.style.width = (tempNum - leftDiff) + "px";
                        tempNum = parseInt(this.centerElement.style.left) || 0;
                        this.rightElement.style.left = (tempNum + leftDiff) + "px";
                    }
                }
                else if(this.dragType == "rightResize")
                {
                    if (this.rightWidth - this.xResize.diff < this.options.minRightWidth)
                    {
                        this.rightWidth = this.options.minRightWidth;
                    }
                    else
                    {
                        this.rightWidth -= this.xResize.diff;
                    }
                    var rightDiff:number =  parseInt(this.rightElement.style.width) - this.rightWidth;
                    this.rightElement.style.width = this.rightWidth + "px";
                    tempNum = parseInt(this.rightElement.style.left) || 0;
                    this.rightElement.style.left = (tempNum + rightDiff) + "px";
                    if (this.centerElement)
                    {
                        tempNum = parseInt(this.centerElement.style.width);
                        this.centerElement.style.width = (tempNum + rightDiff) + "px";
                    }
                    else if (this.leftElement)
                    {
                        tempNum = parseInt(this.leftElement.style.width);
                        this.leftElement.style.width = (tempNum + rightDiff) + "px";
                    }
                }
                this._updateCenterBottom();
            }
            else if (this.yResize)
            {
                diff = this.yResize.diff;
                if (this.dragType == 'topResize')
                {
                    tempNum = parseInt(this.topElement.style.height);
                    this.topElement.style.height = (tempNum + this.yResize.diff) + "px";
                    this.middleTop += this.yResize.diff;
                    this.middleHeight -= this.yResize.diff;
                    if (this.leftElement)
                    {
                        this.leftElement.style.top = this.middleTop + "px";
                        this.leftElement.style.height = this.middleHeight + "px";

                    }
                    if (this.centerElement)
                    {
                        this.centerElement.style.top = this.middleTop + "px";
                        this.centerElement.style.height = this.middleHeight + "px";
                        this.centerContentElement.style.height = this.middleHeight + "px";
                    }
                    if (this.rightElement)
                    {
                        this.rightElement.style.top = this.middleTop + "px";
                        this.rightElement.style.height = this.middleHeight + "px";
                    }
                    this._updateCenterBottom(true);
                }
                else if (this.dragType == 'bottomResize')
                {
                    tempNum = parseInt(this.bottomElement.style.height);
                    this.bottomElement.style.height = (tempNum - this.yResize.diff) + "px";
                    this.middleHeight += this.yResize.diff;
                    this.bottomTop += this.yResize.diff;
                    this.bottomElement.style.top = this.bottomTop + "px";
                    if (this.leftElement)
                    {
                        this.leftElement.style.height = this.middleHeight + "px";
                    }
                    if (this.centerElement)
                    {
                        this.centerElement.style.height = this.middleHeight + "px";
                        this.centerContentElement.style.height = this.middleHeight + "px";
                    }
                    if (this.rightElement)
                    {
                        this.rightElement.style.height = this.middleHeight + "px";
                    }
                    this._updateCenterBottom(true);
                }
                else if (this.dragType == 'centerBottomResize')
                {
                    this.centerBottomHeight = this.centerBottomHeight || this.options.centerBottomHeight;
                    this.centerBottomHeight -= this.yResize.diff;
                    tempNum = parseInt(this.centerBottomElement.style.top) || 0;
                    this.centerBottomElement.style.top = (tempNum + this.yResize.diff) + "px";
                    this.centerBottomElement.style.height = (parseInt(this.centerBottomElement.style.height) - this.yResize.diff) + "px";
                    this.centerElement.style.height = (parseInt(this.centerElement.style.height) + this.yResize.diff) + "px";
                    this.centerContentElement.style.height = (parseInt(this.centerElement.style.height) + this.yResize.diff) + "px";
                }
            }
            this.trigger('endResize', [{
                direction: this.dragType ? this.dragType.toLowerCase().replace(/resize/, '') : '',
                diff: diff
            }, e]);
            this._setDropHandlePosition();
            this.draggingXLineElement.style.display = "none";
            this.draggingYLineElement.style.display = "none";
            this.draggingMaskElement.style.display = "none";
            this.lockElement.style.display = "none";
            this.xResize = this.yResize = this.dragType = null;
            if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari)
            {
                document.body.onselectstart = null;
            }
            document.removeEventListener("mouseup", this.stopDragBindFun);
            document.removeEventListener("mousemove", this.dragBindFun);
            document.body.style.cursor = "";
        }

        private _drag(e:any = null):void
        {
            if (this.xResize)
            {
                this.xResize.diff = e.pageX - this.xResize.startX;
                this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                document.body.style.cursor = "ew-resize";
            }
            else if (this.yResize)
            {
                this.yResize.diff = e.pageY - this.yResize.startY;
                this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                document.body.style.cursor = "ns-resize";
            }
        }

        private _updateCenterBottom(isHeightResize:boolean = false):void
        {
            if (this.centerBottomElement)
            {
                if (isHeightResize)
                {
                    this.centerBottomElement.style.left = this.centerLeft + "px";
                    if (this.centerWidth >= 0 )
                    {
                        this.centerBottomElement.style.width = this.centerWidth + "px";
                    }

                    var centerBottomHeight = this.centerBottomHeight || this.options.centerBottomHeight;
                    var centerHeight = parseInt(this.centerElement.style.height);
                    var centerTop = parseInt(this.centerElement.style.top);
                    this.centerBottomElement.style.height = centerBottomHeight + "px";
                    this.centerBottomElement.style.top = (centerTop + centerHeight - centerBottomHeight) + "px";
                    this.centerElement.style.height = (centerHeight - centerBottomHeight - 2) + "px";
                }
                var centerLeft = parseInt(this.centerElement.style.left);
                this.centerBottomElement.style.width = (parseInt(this.centerElement.style.width)) + "px";
                this.centerBottomElement.style.left = centerLeft + "px";
            }
        }

        private _setDropHandlePosition()
        {
            var tempNum = 0;
            if (this.leftDropElement)
            {
                tempNum = parseInt(this.leftElement.style.left) || 0;
                this.leftDropElement.style.left = (parseInt(this.leftElement.style.width) + tempNum) + "px";
                this.leftDropElement.style.top = this.middleTop + "px";
                this.leftDropElement.style.height = this.middleHeight + "px";
            }
            if (this.rightDropElement)
            {
                tempNum = parseInt(this.rightElement.style.left) || 0;
                this.rightDropElement.style.left = (tempNum - this.options.space) + "px";
                this.rightDropElement.style.top = this.middleTop + "px";
                this.rightDropElement.style.height = this.middleHeight + "px";
            }
            if (this.topDropElement)
            {
                tempNum = parseInt(this.topElement.style.top) || 0;
                this.topDropElement.style.top = (parseInt(this.topElement.style.height) + tempNum) + "px";
                this.topDropElement.style.width = zane.HtmlUtl.width(this.topElement) + "px";
            }
            if (this.bottomDropElement)
            {
                tempNum = parseInt(this.bottomElement.style.top) || 0;
                this.bottomDropElement.style.top = (tempNum - this.options.space) + "px";
                this.bottomDropElement.style.width = zane.HtmlUtl.width(this.bottomElement) + "px";
            }
            if (this.centerBottomDropElement)
            {
                tempNum = parseInt(this.centerBottomElement.style.top) || 0;
                this.centerBottomDropElement.style.top = (tempNum - this.options.space) + "px";
                tempNum = parseInt(this.centerElement.style.left) || 0;
                this.centerBottomDropElement.style.left = tempNum + "px";
                this.centerBottomDropElement.style.width = zane.HtmlUtl.width(this.centerElement) + "px";
            }
        }

        private _onResize()
        {
            if (this.isResize)
            {
                setTimeout(this.resizeBindFun, 200);
                return;
            }
            this.isResize = true;
            var h = 0;
            var oldHeight = zane.HtmlUtl.height(this.element);
            var windowHeight = zane.BrowserUtil.innerHeight();
            var parentHeight = 0;
            var tempNum = 0;
            if (typeof(this.options.height) == "string" && this.options.height.indexOf('%') > 0)
            {
                if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body")
                {
                    parentHeight = windowHeight;
                    tempNum = parseInt(document.body.style.paddingTop) || 1;
                    parentHeight -= tempNum;
                    tempNum = parseInt(document.body.style.paddingBottom) || 1;
                    parentHeight -= tempNum;
                }
                else
                {
                    parentHeight = zane.HtmlUtl.height(this.parent);
                }
                h = parentHeight * parseFloat(this.options.height) * 0.01;
                if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body")
                {
                    tempNum = parseInt(document.body.style.paddingTop) || 1;
                    h -= ((zane.HtmlUtl.getOffset(this.element).y - tempNum));
                }
            }
            else
            {
                h = parseInt(this.options.height);
            }
            h += this.options.heightDiff;
            this.element.style.height = h + "px";
            this.layoutHeight = zane.HtmlUtl.height(this.element);
            this.middleWidth = zane.HtmlUtl.width(this.element);
            this.middleHeight = zane.HtmlUtl.height(this.element);
            if (this.topElement)
            {
                this.middleHeight -= zane.HtmlUtl.height(this.topElement);
                tempNum = parseInt(this.topElement.style.borderTopWidth) || 1;
                this.middleHeight -= tempNum;
                tempNum = parseInt(this.topElement.style.borderBottomWidth) || 1;
                this.middleHeight -= tempNum;
                this.middleHeight -= this.options.space;
            }
            if (this.bottomElement)
            {
                this.middleHeight -= zane.HtmlUtl.height(this.bottomElement);
                tempNum = parseInt(this.bottomElement.style.borderTopWidth) || 1;
                this.middleHeight -= tempNum;
                tempNum = parseInt(this.bottomElement.style.borderBottomWidth) || 1;
                this.middleHeight -= tempNum;
                this.middleHeight -= this.options.space;
            }
            //specific
            this.middleHeight -= 4;

            if (this.hasBind('heightChanged') && this.layoutHeight != oldHeight)
            {
                this.trigger('heightChanged', [{
                    layoutHeight: this.layoutHeight,
                    diff: this.layoutHeight - oldHeight,
                    middleHeight: this.middleHeight
                }]);
            }

            if (this.centerElement)
            {
                this.centerWidth = this.middleWidth;
                this.centerLeft = 0;
                if (this.leftElement)
                {
                    if (this.isLeftCollapse)
                    {
                        tempNum = zane.HtmlUtl.width(this.leftCollapseElement) + 2;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;

                        tempNum = parseInt(this.leftCollapseElement.style.borderLeftWidth) || 1;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;

                        tempNum = parseInt(this.leftCollapseElement.style.borderRightWidth) || 1;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;

                        tempNum = parseInt(this.leftCollapseElement.style.left) || 0;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;
                    }
                    else
                    {
                        tempNum = zane.HtmlUtl.width(this.leftElement) + 2;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;

                        tempNum = parseInt(this.leftElement.style.borderLeftWidth) || 1;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;

                        tempNum = parseInt(this.leftElement.style.borderRightWidth) || 1;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;

                        tempNum = parseInt(this.leftElement.style.left) || 0;
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;
                    }

                    this.centerWidth -= this.options.space;
                    this.centerLeft += this.options.space;
                }
                if (this.rightElement)
                {
                    if (this.isRightCollapse)
                    {
                        tempNum = zane.HtmlUtl.width(this.rightCollapseElement) + 2;
                        this.centerWidth -= tempNum;
                        tempNum = parseInt(this.rightCollapseElement.style.borderLeftWidth) || 1;
                        this.centerWidth -= tempNum;
                        tempNum = parseInt(this.rightCollapseElement.style.borderRightWidth) || 1;
                        this.centerWidth -= tempNum;
                        tempNum = parseInt(this.rightCollapseElement.style.right) || 0;
                        this.centerWidth -= tempNum;
                    }
                    else
                    {
                        this.centerWidth -= this.rightWidth;
                        tempNum = parseInt(this.rightElement.style.borderLeftWidth) || 1;
                        this.centerWidth -= tempNum;
                        tempNum = parseInt(this.rightElement.style.borderRightWidth) || 1;
                        this.centerWidth -= tempNum;
                    }
                    this.centerWidth -= this.options.space;
                }
                this.centerElement.style.left = this.centerLeft + "px";
                if (this.centerWidth >= 0)
                {
                    this.centerWidth -= 2;
                    this.centerElement.style.width = this.centerWidth + "px";
                }
                if (this.middleHeight >= 0)
                {
                    this.centerElement.style.height = this.middleHeight + "px";
                    this.centerContentElement.style.height = this.middleHeight + "px";
                }
                this._updateCenterBottom(true);
            }
            if (this.leftElement)
            {
                this.leftCollapseElement.style.height = this.middleHeight + "px";
                this.leftElement.style.height = this.middleHeight + "px";
            }
            if (this.rightElement)
            {
                this.rightCollapseElement.style.height = this.middleHeight + "px";
                this.rightElement.style.height = this.middleHeight + "px";
                this.rightLeft = 0;
                if (this.leftElement)
                {
                    if (this.isLeftCollapse)
                    {
                        this.rightLeft += zane.HtmlUtl.width(this.leftCollapseElement) + 2;
                        tempNum = parseInt(this.leftCollapseElement.style.borderLeftWidth) || 1;
                        this.rightLeft += tempNum;
                        tempNum = parseInt(this.leftCollapseElement.style.borderRightWidth) || 1;
                        this.rightLeft += tempNum;
                        tempNum = parseInt(this.leftCollapseElement.style.left) || 0;
                        this.rightLeft += tempNum;
                    }
                    else
                    {
                        this.rightLeft += zane.HtmlUtl.width(this.leftElement) + 2;
                        tempNum = parseInt(this.leftElement.style.borderLeftWidth) || 1;
                        this.rightLeft += tempNum;
                        tempNum = parseInt(this.leftElement.style.borderRightWidth) || 1;
                        this.rightLeft += tempNum;
                        tempNum = parseInt(this.leftElement.style.left) || 0;
                        this.rightLeft += tempNum;
                    }
                    this.rightLeft += this.options.space;
                }
                if (this.centerElement)
                {
                    this.rightLeft += zane.HtmlUtl.width(this.centerElement) + 2;
                    tempNum = parseInt(this.centerElement.style.borderLeftWidth) || 1;
                    this.rightLeft += tempNum;
                    tempNum = parseInt(this.centerElement.style.borderRightWidth) || 1;
                    this.rightLeft += tempNum;
                    this.rightLeft += this.options.space;
                }
                this.rightElement.style.left = this.rightLeft + "px";
            }
            if (this.bottomElement)
            {
                this.bottomTop = this.layoutHeight - zane.HtmlUtl.height(this.bottomElement) - 2;
                this.bottomElement.style.top = this.bottomTop + "px";
            }
            this._setDropHandlePosition();
            this.isResize = false;
        }
    }
}