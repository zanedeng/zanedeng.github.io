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
        public topDropElement:HTMLElement = null;

        /**
         * 底部 HTMLElement 对象
         * @type {HTMLElement}
         */
        public bottomElement:HTMLElement = null;
        public bottomContentElement:HTMLElement = null;
        public bottomDropElement:HTMLElement = null;

        /**
         * 左侧 HTMLElement 对象
         * @type {null}
         */
        public leftElement:HTMLElement = null;
        public leftContentElement:HTMLElement = null;
        public leftDropElement:HTMLElement = null;
        public leftCollapseElement:HTMLElement = null;

        /**
         * 右侧 HTMLElement 对象
         * @type {HTMLElement}
         */
        public rightElement:HTMLElement = null;
        public rightContentElement:HTMLElement = null;
        public rightDropElement:HTMLElement = null;
        public rightCollapseElement:HTMLElement = null;

        /**
         * 中间 HTMLElement 对象
         * @type {HTMLElement}
         */
        public centerElement:HTMLElement = null;
        public centerContentElement:HTMLElement = null;

        public centerBottomElement:HTMLElement = null;
        public centerBottomContentElement:HTMLElement = null;
        public centerBottomDropElement:HTMLElement = null;

        public lockElement:HTMLElement = null;

        public draggingXLineElement:HTMLElement = null;
        public draggingYLineElement:HTMLElement = null;
        public draggingMaskElement:HTMLElement = null;

        // +----------------------------------------------------------------------
        // | public property
        // +----------------------------------------------------------------------

        private dragType:string;
        private xResize:{startX:number,diff:number} = null;
        private yResize:{startY:number,diff:number} = null;
        private middleWidth:number = 0;
        private middleHeight:number = 0;
        private middleTop:number = 0;
        private leftWidth:number = 0;
        private rightWidth:number = 0;
        private bottomTop:number = 0;
        private centerLeft:number = 0;
        private centerWidth:number = 0;
        private centerBottomHeight:number = 0;
        private layoutHeight:number = 0;
        private rightLeft:number = 0;

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
            var self = this;
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

            this.leftCollapseElement = document.createElement("div");
            this.leftCollapseElement.className = "layout-collapse-left";
            this.leftCollapseElement.style.display = "none";
            this.element.appendChild(this.leftCollapseElement);

            this.rightCollapseElement = document.createElement("div");
            this.rightCollapseElement.className = "layout-collapse-right";
            this.rightCollapseElement.style.display = "none";
            this.element.appendChild(this.rightCollapseElement);

            this.lockElement = document.createElement("div");
            this.lockElement.className = "layout-lock";
            this.element.appendChild(this.lockElement);

            this._addDropHandle();
            this._build();
            window.onresize = function (e) {
                console.log("resize");
                self._onResize();
            };
            this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
        }

        private _addDropHandle():void
        {
            var self = this;
            // left drop element
            if (this.leftElement && this.options.allowLeftResize)
            {
                this.leftDropElement = document.createElement("div");
                this.leftDropElement.className = "layout-drop-left";
                this.leftDropElement.onmousedown = function (e) {
                    self._startDrag("leftResize", e);
                };
                zane.HtmlUtl.show(this.leftDropElement);
                this.element.appendChild(this.leftDropElement);
            }
            // right drop element
            if (this.rightElement && this.options.allowRightResize)
            {
                this.rightDropElement = document.createElement("div");
                this.rightDropElement.className = "layout-drop-right";
                this.rightDropElement.onmousedown = function (e) {
                    self._startDrag("rightResize", e);
                };
                zane.HtmlUtl.show(this.rightDropElement);
                this.element.appendChild(this.rightDropElement);
            }
            // top drop element
            if (this.topElement && this.options.allowTopResize)
            {
                this.topDropElement = document.createElement("div");
                this.topDropElement.className = "layout-drop-top";
                this.topDropElement.onmousedown = function (e) {
                    self._startDrag("topResize", e);
                };
                zane.HtmlUtl.show(this.topDropElement);
                this.element.appendChild(this.topDropElement);
            }
            // bottom drop element
            if (this.bottomElement && this.options.allowBottomResize)
            {
                this.bottomDropElement = document.createElement("div");
                this.bottomDropElement.className = "layout-drop-bottom";
                this.bottomDropElement.onmousedown = function (e) {
                    self._startDrag("bottomResize", e);
                };
                zane.HtmlUtl.show(this.bottomDropElement);
                this.element.appendChild(this.bottomDropElement);
            }
            // centerBottom drop element
            if (this.centerBottomElement && this.options.allowCenterBottomResize)
            {
                this.centerBottomDropElement = document.createElement("div");
                this.centerBottomDropElement.className = "layout-drop-center-bottom";
                this.centerBottomDropElement.onmousedown = function (e) {
                    self._startDrag("centerBottomResize", e);
                };
                zane.HtmlUtl.show(this.centerBottomDropElement);
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
            var self = this;
            this.dragType = dragType;
            if (dragType == 'leftResize' || dragType == 'rightResize')
            {
                this.xResize = {startX:e.pageX, diff:0};
                this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                this.draggingYLineElement.style.top = this.middleTop + "px";
                this.draggingYLineElement.style.height = this.middleHeight + "px";
                zane.HtmlUtl.show(this.draggingYLineElement);

                document.body.style.cursor = "col-resize";

                this.draggingMaskElement.className = "layout-xmask";
                this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                zane.HtmlUtl.show(this.draggingMaskElement);
            }
            else if (dragType == 'topResize' || dragType == 'bottomResize')
            {
                this.yResize = {startY:e.pageY, diff:0};
                this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                zane.HtmlUtl.show(this.draggingXLineElement);

                document.body.style.cursor = "row-resize";

                this.draggingMaskElement.className = "layout-ymask";
                this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                zane.HtmlUtl.show(this.draggingMaskElement);
            }
            else if (dragType == 'centerBottomResize')
            {
                this.yResize = {startY:e.pageY, diff:0};
                this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                zane.HtmlUtl.show(this.draggingXLineElement);

                document.body.style.cursor = "row-resize";

                this.draggingMaskElement.className = "layout-ymask";
                this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                zane.HtmlUtl.show(this.draggingMaskElement);
            }
            else
            {
                return;
            }

            this.lockElement.style.width = zane.HtmlUtl.width(this.element) + "px";
            this.lockElement.style.height = zane.HtmlUtl.height(this.element) + "px";
            zane.HtmlUtl.show(this.lockElement);

            if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari)
            {
                // 不能选择
                document.body.onselectstart = function (e) {
                    return false;
                }
            }
            document.onmouseup = function (e) {
                self._stopDrag(e);
            };
            document.onmousemove = function (e) {
                self._drag(e);
            };
        }

        private _build():void
        {
            var tempNum:number = 0;
            //set top
            this.middleTop = 0;
            if (this.topElement)
            {
                this.middleTop += zane.HtmlUtl.height(this.topElement);
                tempNum = parseInt(this.topElement.style.borderTopWidth) || 0;
                this.middleTop += tempNum;
                tempNum = parseInt(this.topElement.style.borderBottomWidth) || 0;
                this.middleTop += tempNum;
                this.middleTop += this.options.space;
            }
            if (this.leftElement)
            {
                this.leftElement.style.top = this.middleTop + "px";
            }
            if (this.centerElement)
            {
                this.centerElement.style.top = this.middleTop + "px";
            }
            if (this.rightElement)
            {
                this.rightElement.style.top = this.middleTop + "px";
            }
            //set left
            if (this.leftElement) this.leftElement.style.left = "0";
            this._onResize();
            this._onResize();
        }
        
        private _stopDrag(e:any = null):void
        {
            var diff, tempNum;
            if (this.xResize && this.xResize.diff > 0)
            {
                diff = this.xResize.diff;
                if (this.dragType == "leftResize")
                {
                    if (this.leftWidth + this.xResize.diff > this.options.minLeftWidth)
                    {
                        this.leftWidth += this.xResize.diff;
                    }
                    this.leftElement.style.width = this.leftWidth + "px";
                    if (this.centerElement)
                    {
                        tempNum = zane.HtmlUtl.width(this.centerElement);
                        this.centerElement.style.width = (tempNum - this.xResize.diff) + "px";
                        tempNum = parseInt(this.centerElement.style.left) || 0;
                        this.centerElement.style.left = (tempNum + this.xResize.diff) + "px";
                    }
                    else if (this.rightElement)
                    {
                        tempNum = zane.HtmlUtl.width(this.leftElement);
                        this.rightElement.style.width = (tempNum - this.xResize.diff) + "px";
                        tempNum = parseInt(this.centerElement.style.left) || 0;
                        this.rightElement.style.left = (tempNum + this.xResize.diff) + "px";
                    }
                }
                else if(this.dragType == "rightResize")
                {
                    if (this.rightWidth - this.xResize.diff > this.options.minRightWidth)
                    {
                        this.rightWidth -= this.xResize.diff;
                    }
                    this.rightElement.style.width = this.rightWidth + "px";
                    tempNum = parseInt(this.rightElement.style.left) || 0;
                    this.rightElement.style.left = (tempNum + this.xResize.diff) + "px";
                    if (this.centerElement)
                    {
                        tempNum = zane.HtmlUtl.width(this.centerElement);
                        this.centerElement.style.width = (tempNum + this.xResize.diff) + "px";
                    }
                    else if (this.leftElement)
                    {
                        tempNum = zane.HtmlUtl.width(this.leftElement);
                        this.leftElement.style.width = (tempNum + this.xResize.diff) + "px";
                    }
                }
                this._updateCenterBottom();
            }
            else if (this.yResize && this.yResize.diff > 0)
            {
                diff = this.yResize.diff;
                if (this.dragType == 'topResize')
                {
                    tempNum = zane.HtmlUtl.height(this.topElement);
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
                    tempNum = zane.HtmlUtl.height(this.bottomElement);
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
                    this.centerBottomElement.style.height = (zane.HtmlUtl.height(this.centerBottomElement) - this.yResize.diff) + "px";
                    this.centerElement.style.height = (zane.HtmlUtl.height(this.centerElement) + this.yResize.diff) + "px";
                }
            }
            this.trigger('endResize', [{
                direction: this.dragType ? this.dragType.toLowerCase().replace(/resize/, '') : '',
                diff: diff
            }, e]);
            this._setDropHandlePosition();
            zane.HtmlUtl.hide(this.draggingXLineElement);
            zane.HtmlUtl.hide(this.draggingYLineElement);
            zane.HtmlUtl.hide(this.draggingMaskElement);
            zane.HtmlUtl.hide(this.lockElement);
            this.xResize = this.yResize = this.dragType = null;
            if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari)
            {
                document.body.onselectstart = null;
            }
            document.onmousedown = null;
            document.onmousemove = null;
            document.body.style.cursor = "";
        }

        private _drag(e:any = null):void
        {
            if (this.xResize)
            {
                this.xResize.diff = e.pageX - this.xResize.startX;
                this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                document.body.style.cursor = "col-resize";
            }
            else if (this.yResize)
            {
                this.yResize.diff = e.pageY - this.yResize.startY;
                this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                document.body.style.cursor = "row-resize";
            }
        }

        private _updateCenterBottom(isHeightResize:boolean = false):void
        {
            if (this.centerBottomElement)
            {
                if (isHeightResize)
                {
                    this.centerBottomElement.style.left = this.centerLeft + "px";
                    if (this.centerWidth >= 0 ) this.centerBottomElement.style.width = this.centerWidth + "px";

                    var centerBottomHeight = this.centerBottomHeight || this.options.centerBottomHeight;
                    var centerHeight = zane.HtmlUtl.height(this.centerElement);
                    var centerTop = parseInt(this.centerElement.style.top) || 0;
                    this.centerBottomElement.style.height = centerBottomHeight + "px";
                    this.centerBottomElement.style.top = (centerTop + centerHeight - centerBottomHeight + 2) + "px";
                    this.centerElement.style.height = (centerHeight - centerBottomHeight - 2) + "px";
                }
                var centerLeft = parseInt(this.centerElement.style.left) || 0;
                this.centerBottomElement.style.width = zane.HtmlUtl.width(this.centerElement) + "px";
                this.centerBottomElement.style.left = centerLeft + "px";
            }
        }

        private _setDropHandlePosition()
        {
            var tempNum = 0;
            if (this.leftDropElement)
            {
                tempNum = parseInt(this.leftElement.style.left) || 0;
                this.leftDropElement.style.left = (zane.HtmlUtl.width(this.leftElement) + tempNum) + "px";
                this.leftDropElement.style.top = this.middleTop + "px";
                this.leftDropElement.style.height = this.middleHeight + "px";
            }
            if (this.rightDropElement)
            {
                tempNum = parseInt(this.rightElement.style.left) || 0;
                this.rightDropElement.style.left = (tempNum - this.options.space) + "px";
                this.rightDropElement.style.top = this.middleTop + "px";
                this.rightDropElement.style.left = this.middleHeight + "px";
            }
            if (this.topDropElement)
            {
                tempNum = parseInt(this.topElement.style.top) || 0;
                this.topDropElement.style.top = (zane.HtmlUtl.height(this.topElement) + tempNum) + "px";
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
                    tempNum = parseInt(document.body.style.paddingTop) || 0;
                    parentHeight -= tempNum;
                    tempNum = parseInt(document.body.style.paddingBottom) || 0;
                    parentHeight -= tempNum;
                }
                else
                {
                    parentHeight = zane.HtmlUtl.height(this.parent);
                }
                h = parentHeight * parseFloat(this.options.height) * 0.01;
                if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body")
                {
                    tempNum = parseInt(document.body.style.paddingTop) || 0;
                    h -= ((zane.HtmlUtl.getOffset(this.element).y - tempNum));
                }
            }
            else
            {
                h = parseInt(this.options.height);
            }
            console.log(this.topElement);
            h += this.options.heightDiff;
            this.element.style.height = h + "px";
            this.layoutHeight = zane.HtmlUtl.height(this.element);
            this.middleWidth = zane.HtmlUtl.width(this.element);
            this.middleHeight = zane.HtmlUtl.height(this.element);
            if (this.topElement)
            {
                this.middleHeight -= zane.HtmlUtl.height(this.topElement);
                tempNum = parseInt(this.topElement.style.borderTopWidth) || 0;
                this.middleHeight -= tempNum;
                tempNum = parseInt(this.topElement.style.borderBottomWidth) || 0;
                this.middleHeight -= tempNum;
                this.middleHeight -= this.options.space;
            }
            if (this.bottomElement)
            {
                this.middleHeight -= zane.HtmlUtl.height(this.bottomElement);
                tempNum = parseInt(this.bottomElement.style.borderTopWidth) || 0;
                this.middleHeight -= tempNum;
                tempNum = parseInt(this.bottomElement.style.borderBottomWidth) || 0;
                this.middleHeight -= tempNum;
                this.middleHeight -= this.options.space;
            }
            //specific
            this.middleHeight -= 2;

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
                    if (this.options.isLeftCollapse)
                    {
                        tempNum = zane.HtmlUtl.width(this.leftCollapseElement);
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;
                    }
                    else
                    {
                        tempNum = zane.HtmlUtl.width(this.leftElement);
                        this.centerWidth -= tempNum;
                        this.centerLeft += tempNum;
                    }
                    tempNum = parseInt(this.leftCollapseElement.style.borderLeftWidth) || 0;
                    this.centerWidth -= tempNum;
                    this.centerLeft += tempNum;

                    tempNum = parseInt(this.leftCollapseElement.style.borderRightWidth) || 0;
                    this.centerWidth -= tempNum;
                    this.centerLeft += tempNum;

                    tempNum = parseInt(this.leftCollapseElement.style.left) || 0;
                    this.centerWidth -= tempNum;
                    this.centerLeft += tempNum;

                    this.centerWidth -= this.options.space;
                    this.centerLeft += this.options.space;
                }
                if (this.rightElement)
                {
                    if (this.options.isRightCollapse)
                    {
                        this.centerWidth -= zane.HtmlUtl.width(this.rightCollapseElement);
                    }
                    else
                    {
                        this.centerWidth -= zane.HtmlUtl.width(this.rightElement);
                    }
                    tempNum = parseInt(this.rightCollapseElement.style.borderLeftWidth) || 0;
                    this.centerWidth -= tempNum;
                    tempNum = parseInt(this.rightCollapseElement.style.borderRightWidth) || 0;
                    this.centerWidth -= tempNum;
                    tempNum = parseInt(this.rightCollapseElement.style.left) || 0;
                    this.centerWidth -= tempNum;
                    this.centerWidth -= this.options.space;
                }
                console.log("centerLeft:" + this.centerLeft);
                this.centerElement.style.left = this.centerLeft + "px";
                if (this.centerWidth >= 0)
                {
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
                    if (this.options.isLeftCollapse)
                    {
                        this.rightLeft += zane.HtmlUtl.width(this.leftCollapseElement);
                    }
                    else
                    {
                        this.rightLeft += zane.HtmlUtl.width(this.leftElement);
                    }
                    tempNum = parseInt(this.leftCollapseElement.style.borderLeftWidth) || 0;
                    this.rightLeft += tempNum;
                    tempNum = parseInt(this.leftCollapseElement.style.borderRightWidth) || 0;
                    this.rightLeft += tempNum;
                    tempNum = parseInt(this.leftCollapseElement.style.left) || 0;
                    this.rightLeft += tempNum;
                    this.rightLeft += this.options.space;
                }
                if (this.centerElement)
                {
                    this.rightLeft += zane.HtmlUtl.width(this.centerElement);
                    tempNum = parseInt(this.centerElement.style.borderLeftWidth) || 0;
                    this.rightLeft += tempNum;
                    tempNum = parseInt(this.centerElement.style.borderRightWidth) || 0;
                    this.rightLeft += tempNum;
                    this.rightLeft += this.options.space;
                }
                console.log("rightLeft:" + this.rightLeft);
                this.rightElement.style.left = this.rightLeft + "px";
            }
            if (this.bottomElement)
            {
                this.bottomTop = this.layoutHeight - zane.HtmlUtl.height(this.bottomElement) - 2;
                this.bottomElement.style.top = this.bottomTop + "px";
            }
            this._setDropHandlePosition();
        }
    }
}