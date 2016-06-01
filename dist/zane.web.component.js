var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var zane;
(function (zane) {
    var web;
    (function (web) {
        var component;
        (function (component) {
            var Component = (function () {
                function Component(parent, options) {
                    if (options === void 0) { options = null; }
                    this.events = {};
                    this.options = {};
                    this.children = {};
                    this.parent = parent;
                    this.options = options;
                    this._init();
                    this._preRender();
                    this.trigger('render');
                    this._render();
                    this.trigger('rendered');
                    this._rendered();
                    Component.addInstance(this);
                }
                Component.addInstance = function (item) {
                    if (!item.id)
                        item.id = Component.generateId();
                    Component.__instances[item.id] = item;
                };
                Component.removeInstance = function (item) {
                    if (typeof item == "string" || typeof item == "number") {
                        delete Component.__instances[item];
                        return true;
                    }
                    else if (typeof item == "object") {
                        if (item.hasOwnProperty("id")) {
                            delete Component.__instances[item.id];
                            return true;
                        }
                    }
                    return false;
                };
                Component.getInstance = function (id) {
                    return Component.__instances[id];
                };
                Component.getAllInstance = function () {
                    return Component.__instances;
                };
                Component.generateId = function (prev) {
                    if (prev === void 0) { prev = null; }
                    prev = prev || "ui";
                    return prev + (Component.__uid++);
                };
                Component.prototype.trigger = function (arg, data) {
                    if (data === void 0) { data = null; }
                    if (!arg)
                        return false;
                    var name = arg.toLowerCase();
                    var event = this.events[name];
                    if (!event)
                        return false;
                    data = data || [];
                    if ((data instanceof Array) == false) {
                        data = [data];
                    }
                    for (var i = 0; i < event.length; i++) {
                        var ev = event[i];
                        if (ev.handler.apply(ev.context, data) == false)
                            return false;
                    }
                    return true;
                };
                Component.prototype.bind = function (arg, handler, context) {
                    if (context === void 0) { context = null; }
                    if (typeof arg == 'object') {
                        for (var p in arg) {
                            this.bind(p, arg[p]);
                        }
                        return;
                    }
                    if (typeof handler != 'function')
                        return;
                    var name = arg.toLowerCase();
                    var event = this.events[name] || [];
                    context = context || this;
                    event.push({ handler: handler, context: context });
                    this.events[name] = event;
                };
                Component.prototype.unbind = function (arg, handler) {
                    if (!arg) {
                        this.events = {};
                        return;
                    }
                    var name = arg.toLowerCase();
                    var event = this.events[name];
                    if (!event || !event.length)
                        return;
                    if (!handler) {
                        delete this.events[name];
                    }
                    else {
                        for (var i = 0, l = event.length; i < l; i++) {
                            if (event[i].handler == handler) {
                                event.splice(i, 1);
                                break;
                            }
                        }
                    }
                };
                Component.prototype.hasBind = function (arg) {
                    var name = arg.toLowerCase();
                    var event = this.events[name];
                    if (event && event.length)
                        return true;
                    return false;
                };
                Component.prototype.destroy = function () {
                    Component.removeInstance(this);
                };
                Component.prototype._init = function () {
                };
                Component.prototype._preRender = function () {
                };
                Component.prototype._render = function () {
                };
                Component.prototype._rendered = function () {
                };
                Component.__uid = 1000;
                Component.__instances = {};
                return Component;
            }());
            component.Component = Component;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var component;
        (function (component) {
            var Layout = (function (_super) {
                __extends(Layout, _super);
                function Layout(parent, options) {
                    if (options === void 0) { options = null; }
                    _super.call(this, parent, options);
                    this.topElement = null;
                    this.topContentElement = null;
                    this.topDropElement = null;
                    this.bottomElement = null;
                    this.bottomContentElement = null;
                    this.bottomDropElement = null;
                    this.leftElement = null;
                    this.leftContentElement = null;
                    this.leftDropElement = null;
                    this.leftCollapseElement = null;
                    this.rightElement = null;
                    this.rightContentElement = null;
                    this.rightDropElement = null;
                    this.rightCollapseElement = null;
                    this.centerElement = null;
                    this.centerContentElement = null;
                    this.centerBottomElement = null;
                    this.centerBottomContentElement = null;
                    this.centerBottomDropElement = null;
                    this.lockElement = null;
                    this.draggingXLineElement = null;
                    this.draggingYLineElement = null;
                    this.draggingMaskElement = null;
                    this.xResize = null;
                    this.yResize = null;
                    this.middleWidth = 0;
                    this.middleHeight = 0;
                    this.middleTop = 0;
                    this.leftWidth = 0;
                    this.rightWidth = 0;
                    this.bottomTop = 0;
                    this.centerLeft = 0;
                    this.centerWidth = 0;
                    this.centerBottomHeight = 0;
                    this.layoutHeight = 0;
                    this.rightLeft = 0;
                }
                Layout.prototype._init = function () {
                    if (!this.options)
                        this.options = new component.LayoutOptions();
                    this.id = this.options.id || component.Component.generateId();
                };
                Layout.prototype._render = function () {
                    var self = this;
                    this.element = document.createElement("div");
                    this.element.className = "layout";
                    this.element.id = this.id;
                    this.element.style.width = this.options.width;
                    this.element.style.height = this.options.height;
                    this.parent.appendChild(this.element);
                    var content = this.options.content.toString(16);
                    if (content.substr(0, 1) == "1") {
                        this.topElement = document.createElement("div");
                        this.topElement.className = "layout-top";
                        this.topElement.style.top = "0";
                        this.topElement.style.height = this.options.topHeight + "px";
                        this.element.appendChild(this.topElement);
                        this.topContentElement = document.createElement("div");
                        this.topContentElement.className = "layout-content";
                        this.topElement.appendChild(this.topContentElement);
                    }
                    if (content.substr(1, 1) == "1") {
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
                    if (content.substr(2, 1) == "1") {
                        this.rightElement = document.createElement("div");
                        this.rightElement.className = "layout-right";
                        this.rightElement.style.width = this.options.rightWidth + "px";
                        this.rightElement.style.minWidth = this.options.minRightWidth + "px";
                        this.element.appendChild(this.rightElement);
                        this.rightContentElement = document.createElement("div");
                        this.rightContentElement.className = "layout-content";
                        this.rightElement.appendChild(this.rightContentElement);
                    }
                    if (content.substr(3, 1) == "1") {
                        this.bottomElement = document.createElement("div");
                        this.bottomElement.className = "layout-bottom";
                        this.bottomElement.style.height = this.options.bottomHeight + "px";
                        this.element.appendChild(this.bottomElement);
                        this.bottomContentElement = document.createElement("div");
                        this.bottomContentElement.className = "layout-content";
                        this.bottomElement.appendChild(this.bottomContentElement);
                    }
                    if (content.substr(4, 1) == "1") {
                        this.centerElement = document.createElement("div");
                        this.centerElement.className = "layout-center";
                        this.centerElement.style.width = this.options.centerWidth;
                        this.element.appendChild(this.centerElement);
                        this.centerContentElement = document.createElement("div");
                        this.centerContentElement.className = "layout-content";
                        this.centerElement.appendChild(this.centerContentElement);
                        if (content.substr(5, 1) == "1") {
                            this.centerBottomElement = document.createElement("div");
                            this.centerBottomElement.className = "layout-center-bottom";
                            this.centerBottomElement.style.width = this.options.centerWidth;
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
                        self._onResize();
                    };
                    this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                };
                Layout.prototype._addDropHandle = function () {
                    var self = this;
                    if (this.leftElement && this.options.allowLeftResize) {
                        this.leftDropElement = document.createElement("div");
                        this.leftDropElement.className = "layout-drop-left";
                        this.leftDropElement.onmousedown = function (e) {
                            self._startDrag("leftResize", e);
                        };
                        zane.HtmlUtl.show(this.leftDropElement);
                        this.element.appendChild(this.leftDropElement);
                    }
                    if (this.rightElement && this.options.allowRightResize) {
                        this.rightDropElement = document.createElement("div");
                        this.rightDropElement.className = "layout-drop-right";
                        this.rightDropElement.onmousedown = function (e) {
                            self._startDrag("rightResize", e);
                        };
                        zane.HtmlUtl.show(this.rightDropElement);
                        this.element.appendChild(this.rightDropElement);
                    }
                    if (this.topElement && this.options.allowTopResize) {
                        this.topDropElement = document.createElement("div");
                        this.topDropElement.className = "layout-drop-top";
                        this.topDropElement.onmousedown = function (e) {
                            self._startDrag("topResize", e);
                        };
                        zane.HtmlUtl.show(this.topDropElement);
                        this.element.appendChild(this.topDropElement);
                    }
                    if (this.bottomElement && this.options.allowBottomResize) {
                        this.bottomDropElement = document.createElement("div");
                        this.bottomDropElement.className = "layout-drop-bottom";
                        this.bottomDropElement.onmousedown = function (e) {
                            self._startDrag("bottomResize", e);
                        };
                        zane.HtmlUtl.show(this.bottomDropElement);
                        this.element.appendChild(this.bottomDropElement);
                    }
                    if (this.centerBottomElement && this.options.allowCenterBottomResize) {
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
                };
                Layout.prototype._startDrag = function (dragType, e) {
                    if (e === void 0) { e = null; }
                    var self = this;
                    this.dragType = dragType;
                    if (dragType == 'leftResize' || dragType == 'rightResize') {
                        this.xResize = { startX: e.pageX, diff: 0 };
                        this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                        this.draggingYLineElement.style.top = this.middleTop + "px";
                        this.draggingYLineElement.style.height = this.middleHeight + "px";
                        zane.HtmlUtl.show(this.draggingYLineElement);
                        document.body.style.cursor = "col-resize";
                        this.draggingMaskElement.className = "layout-xmask";
                        this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                        zane.HtmlUtl.show(this.draggingMaskElement);
                    }
                    else if (dragType == 'topResize' || dragType == 'bottomResize') {
                        this.yResize = { startY: e.pageY, diff: 0 };
                        this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                        this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                        zane.HtmlUtl.show(this.draggingXLineElement);
                        document.body.style.cursor = "row-resize";
                        this.draggingMaskElement.className = "layout-ymask";
                        this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                        zane.HtmlUtl.show(this.draggingMaskElement);
                    }
                    else if (dragType == 'centerBottomResize') {
                        this.yResize = { startY: e.pageY, diff: 0 };
                        this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                        this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                        zane.HtmlUtl.show(this.draggingXLineElement);
                        document.body.style.cursor = "row-resize";
                        this.draggingMaskElement.className = "layout-ymask";
                        this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                        zane.HtmlUtl.show(this.draggingMaskElement);
                    }
                    else {
                        return;
                    }
                    this.lockElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                    this.lockElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                    zane.HtmlUtl.show(this.lockElement);
                    if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari) {
                        document.body.onselectstart = function (e) {
                            return false;
                        };
                    }
                    document.onmouseup = function (e) {
                        self._stopDrag(e);
                    };
                    document.onmousemove = function (e) {
                        self._drag(e);
                    };
                };
                Layout.prototype._build = function () {
                    this.middleTop = 0;
                    if (this.topElement) {
                        this.middleTop += zane.HtmlUtl.height(this.topElement);
                        this.middleTop += parseInt(this.topElement.style.borderTopWidth);
                        this.middleTop += parseInt(this.topElement.style.borderBottomWidth);
                        this.middleTop += this.options.space;
                    }
                    if (this.leftElement) {
                        this.leftElement.style.top = this.middleTop + "px";
                    }
                    if (this.centerElement) {
                        this.centerElement.style.top = this.middleTop + "px";
                    }
                    if (this.rightElement) {
                        this.rightElement.style.top = this.middleTop + "px";
                    }
                    if (this.leftElement)
                        this.leftElement.style.left = "0";
                    this._onResize();
                    this._onResize();
                };
                Layout.prototype._stopDrag = function (e) {
                    if (e === void 0) { e = null; }
                    var diff;
                    if (this.xResize && this.xResize.diff > 0) {
                        diff = this.xResize.diff;
                        if (this.dragType == "leftResize") {
                            if (this.leftWidth + this.xResize.diff > this.options.minLeftWidth) {
                                this.leftWidth += this.xResize.diff;
                            }
                            this.leftElement.style.width = this.leftWidth + "px";
                            if (this.centerElement) {
                                this.centerElement.style.width = (zane.HtmlUtl.width(this.centerElement) - this.xResize.diff) + "px";
                                this.centerElement.style.left = (parseInt(this.centerElement.style.left) + this.xResize.diff) + "px";
                            }
                            else if (this.rightElement) {
                                this.rightElement.style.width = (zane.HtmlUtl.width(this.leftElement) - this.xResize.diff) + "px";
                                this.rightElement.style.left = (parseInt(this.centerElement.style.left) + this.xResize.diff) + "px";
                            }
                        }
                        else if (this.dragType == "rightResize") {
                            if (this.rightWidth - this.xResize.diff > this.options.minRightWidth) {
                                this.rightWidth -= this.xResize.diff;
                            }
                            this.rightElement.style.width = this.rightWidth + "px";
                            this.rightElement.style.left = (parseInt(this.rightElement.style.left) + this.xResize.diff) + "px";
                            if (this.centerElement) {
                                this.centerElement.style.width = (zane.HtmlUtl.width(this.centerElement) + this.xResize.diff) + "px";
                            }
                            else if (this.leftElement) {
                                this.leftElement.style.width = (zane.HtmlUtl.width(this.leftElement) + this.xResize.diff) + "px";
                            }
                        }
                        this._updateCenterBottom();
                    }
                    else if (this.yResize && this.yResize.diff > 0) {
                        diff = this.yResize.diff;
                        if (this.dragType == 'topResize') {
                            this.topElement.style.height = (zane.HtmlUtl.height(this.topElement) + this.yResize.diff) + "px";
                            this.middleTop += this.yResize.diff;
                            this.middleHeight -= this.yResize.diff;
                            if (this.leftElement) {
                                this.leftElement.style.top = this.middleTop + "px";
                                this.leftElement.style.height = this.middleHeight + "px";
                            }
                            if (this.centerElement) {
                                this.centerElement.style.top = this.middleTop + "px";
                                this.centerElement.style.height = this.middleHeight + "px";
                            }
                            if (this.rightElement) {
                                this.rightElement.style.top = this.middleTop + "px";
                                this.rightElement.style.height = this.middleHeight + "px";
                            }
                            this._updateCenterBottom(true);
                        }
                        else if (this.dragType == 'bottomResize') {
                            this.bottomElement.style.height = (zane.HtmlUtl.height(this.bottomElement) - this.yResize.diff) + "px";
                            this.middleHeight += this.yResize.diff;
                            this.bottomTop += this.yResize.diff;
                            this.bottomElement.style.top = this.bottomTop + "px";
                            if (this.leftElement) {
                                this.leftElement.style.height = this.middleHeight + "px";
                            }
                            if (this.centerElement) {
                                this.centerElement.style.height = this.middleHeight + "px";
                            }
                            if (this.rightElement) {
                                this.rightElement.style.height = this.middleHeight + "px";
                            }
                            this._updateCenterBottom(true);
                        }
                        else if (this.dragType == 'centerBottomResize') {
                            this.centerBottomHeight = this.centerBottomHeight || this.options.centerBottomHeight;
                            this.centerBottomHeight -= this.yResize.diff;
                            this.centerBottomElement.style.top = (parseInt(this.centerBottomElement.style.top) + this.yResize.diff) + "px";
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
                    if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari) {
                        document.body.onselectstart = null;
                    }
                    document.onmousedown = null;
                    document.onmousemove = null;
                    document.body.style.cursor = "";
                };
                Layout.prototype._drag = function (e) {
                    if (e === void 0) { e = null; }
                    if (this.xResize) {
                        this.xResize.diff = e.pageX - this.xResize.startX;
                        this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                        document.body.style.cursor = "col-resize";
                    }
                    else if (this.yResize) {
                        this.yResize.diff = e.pageY - this.yResize.startY;
                        this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                        document.body.style.cursor = "row-resize";
                    }
                };
                Layout.prototype._updateCenterBottom = function (isHeightResize) {
                    if (isHeightResize === void 0) { isHeightResize = false; }
                    if (this.centerBottomElement) {
                        if (isHeightResize) {
                            this.centerBottomElement.style.left = this.centerLeft + "px";
                            if (this.centerWidth >= 0)
                                this.centerBottomElement.style.width = this.centerWidth + "px";
                            var centerBottomHeight = this.centerBottomHeight || this.options.centerBottomHeight;
                            var centerHeight = zane.HtmlUtl.height(this.centerElement);
                            var centerTop = parseInt(this.centerElement.style.top);
                            this.centerBottomElement.style.height = centerBottomHeight + "px";
                            this.centerBottomElement.style.top = (centerTop + centerHeight - centerBottomHeight + 2) + "px";
                            this.centerElement.style.height = (centerHeight - centerBottomHeight - 2) + "px";
                        }
                        var centerLeft = parseInt(this.centerElement.style.left);
                        this.centerBottomElement.style.width = zane.HtmlUtl.width(this.centerElement) + "px";
                        this.centerBottomElement.style.left = centerLeft + "px";
                    }
                };
                Layout.prototype._setDropHandlePosition = function () {
                    if (this.leftDropElement) {
                        this.leftDropElement.style.left = (zane.HtmlUtl.width(this.leftElement) + parseInt(this.leftElement.style.left)) + "px";
                        this.leftDropElement.style.top = this.middleTop + "px";
                        this.leftDropElement.style.height = this.middleHeight + "px";
                    }
                    if (this.rightDropElement) {
                        this.rightDropElement.style.left = (parseInt(this.rightElement.style.left) - this.options.space) + "px";
                        this.rightDropElement.style.top = this.middleTop + "px";
                        this.rightDropElement.style.left = this.middleHeight + "px";
                    }
                    if (this.topDropElement) {
                        this.topDropElement.style.top = (zane.HtmlUtl.height(this.topElement) + parseInt(this.topElement.style.top)) + "px";
                        this.topDropElement.style.width = zane.HtmlUtl.width(this.topElement) + "px";
                    }
                    if (this.bottomDropElement) {
                        this.bottomDropElement.style.top = (parseInt(this.bottomElement.style.top) - this.options.space) + "px";
                        this.bottomDropElement.style.width = zane.HtmlUtl.width(this.bottomElement) + "px";
                    }
                    if (this.centerBottomDropElement) {
                        this.centerBottomDropElement.style.top = (parseInt(this.centerBottomElement.style.top) - this.options.space) + "px";
                        this.centerBottomDropElement.style.left = parseInt(this.centerElement.style.left) + "px";
                        this.centerBottomDropElement.style.width = zane.HtmlUtl.width(this.centerElement) + "px";
                    }
                };
                Layout.prototype._onResize = function () {
                    var h = 0;
                    var oldHeight = zane.HtmlUtl.height(this.element);
                    var windowHeight = zane.BrowserUtil.innerHeight();
                    var parentHeight = null;
                    if (typeof (this.options.height) == "string" && this.options.height.indexOf('%') > 0) {
                        if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body") {
                            parentHeight = windowHeight;
                            parentHeight -= parseInt(document.body.style.paddingTop);
                            parentHeight -= parseInt(document.body.style.paddingBottom);
                        }
                        else {
                            parentHeight = zane.HtmlUtl.height(this.parent);
                        }
                        h = parentHeight * parseFloat(this.options.height) * 0.01;
                        if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body")
                            h -= ((zane.HtmlUtl.getOffset(this.element).y - parseInt(document.body.style.paddingTop)));
                    }
                    else {
                        h = parseInt(this.options.height);
                    }
                    h += this.options.heightDiff;
                    this.element.style.height = h + "px";
                    this.layoutHeight = zane.HtmlUtl.height(this.element);
                    this.middleWidth = zane.HtmlUtl.width(this.element);
                    this.middleHeight = zane.HtmlUtl.height(this.element);
                    if (this.topElement) {
                        this.middleHeight -= zane.HtmlUtl.height(this.topElement);
                        this.middleHeight -= parseInt(this.topElement.style.borderTopWidth);
                        this.middleHeight -= parseInt(this.topElement.style.borderBottomWidth);
                        this.middleHeight -= this.options.space;
                    }
                    if (this.bottomElement) {
                        this.middleHeight -= zane.HtmlUtl.height(this.bottomElement);
                        this.middleHeight -= parseInt(this.bottomElement.style.borderTopWidth);
                        this.middleHeight -= parseInt(this.bottomElement.style.borderBottomWidth);
                        this.middleHeight -= this.options.space;
                    }
                    this.middleHeight -= 2;
                    if (this.hasBind('heightChanged') && this.layoutHeight != oldHeight) {
                        this.trigger('heightChanged', [{ layoutHeight: this.layoutHeight, diff: this.layoutHeight - oldHeight, middleHeight: this.middleHeight }]);
                    }
                    if (this.centerElement) {
                        this.centerWidth = this.middleWidth;
                        this.centerLeft = 0;
                        if (this.leftElement) {
                            if (this.options.isLeftCollapse) {
                                var cw = zane.HtmlUtl.width(this.leftCollapseElement);
                                this.centerWidth -= cw;
                                this.centerLeft += cw;
                            }
                            else {
                                this.centerWidth -= this.leftWidth;
                                this.centerLeft += this.leftWidth;
                            }
                            var borderLeftWidth = parseInt(this.leftCollapseElement.style.borderLeftWidth);
                            this.centerWidth -= borderLeftWidth;
                            this.centerLeft += borderLeftWidth;
                            var borderRightWidth = parseInt(this.leftCollapseElement.style.borderRightWidth);
                            this.centerWidth -= borderRightWidth;
                            this.centerLeft += borderRightWidth;
                            var left = parseInt(this.leftCollapseElement.style.left);
                            this.centerWidth -= left;
                            this.centerLeft += left;
                            this.centerWidth -= this.options.space;
                            this.centerLeft += this.options.space;
                        }
                        if (this.rightElement) {
                            if (this.options.isRightCollapse) {
                                this.centerWidth -= zane.HtmlUtl.width(this.rightCollapseElement);
                            }
                            else {
                                this.centerWidth -= this.rightWidth;
                            }
                            this.centerWidth -= parseInt(this.rightCollapseElement.style.borderLeftWidth);
                            this.centerWidth -= parseInt(this.rightCollapseElement.style.borderRightWidth);
                            this.centerWidth -= parseInt(this.rightCollapseElement.style.left);
                            this.centerWidth -= this.options.space;
                        }
                        this.centerElement.style.left = this.centerLeft + "px";
                        if (this.centerWidth >= 0)
                            this.centerElement.style.width = this.centerWidth + "px";
                        if (this.middleHeight >= 0) {
                            this.centerElement.style.height = this.middleHeight + "px";
                            this.centerContentElement.style.height = this.middleHeight + "px";
                        }
                        this._updateCenterBottom(true);
                    }
                    if (this.leftElement) {
                        this.leftCollapseElement.style.height = this.middleHeight + "px";
                        this.leftElement.style.height = this.middleHeight + "px";
                    }
                    if (this.rightElement) {
                        this.rightCollapseElement.style.height = this.middleHeight + "px";
                        this.rightElement.style.height = this.middleHeight + "px";
                        this.rightLeft = 0;
                        if (this.leftElement) {
                            if (this.options.isLeftCollapse) {
                                this.rightLeft += zane.HtmlUtl.width(this.leftCollapseElement);
                            }
                            else {
                                this.rightLeft += zane.HtmlUtl.width(this.leftElement);
                            }
                            this.rightLeft += parseInt(this.leftCollapseElement.style.borderLeftWidth);
                            this.rightLeft += parseInt(this.leftCollapseElement.style.borderRightWidth);
                            this.rightLeft += parseInt(this.leftCollapseElement.style.left);
                            this.rightLeft += this.options.space;
                        }
                        if (this.centerElement) {
                            this.rightLeft += zane.HtmlUtl.width(this.centerElement);
                            this.rightLeft += parseInt(this.centerElement.style.borderLeftWidth);
                            this.rightLeft += parseInt(this.centerElement.style.borderRightWidth);
                            this.rightLeft += this.options.space;
                        }
                        this.rightElement.style.left = this.rightLeft + "px";
                    }
                    if (this.bottomElement) {
                        this.bottomTop = this.layoutHeight - zane.HtmlUtl.height(this.bottomElement) - 2;
                        this.bottomElement.style.top = this.bottomTop + "px";
                    }
                    this._setDropHandlePosition();
                };
                Layout.CONTENT_NONE = 0x000000;
                Layout.CONTENT_TOP = 0x100000;
                Layout.CONTENT_LEFT = 0x010000;
                Layout.CONTENT_RIGHT = 0x001000;
                Layout.CONTENT_BOTTOM = 0x000100;
                Layout.CONTENT_CENTER = 0x000010;
                Layout.CONTENT_CENTER_BOTTOM = 0x000001;
                return Layout;
            }(component.Component));
            component.Layout = Layout;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var component;
        (function (component) {
            var LayoutOptions = (function () {
                function LayoutOptions() {
                    this.width = "100%";
                    this.height = '100%';
                    this.heightDiff = 0;
                    this.topHeight = 50;
                    this.bottomHeight = 50;
                    this.leftWidth = 110;
                    this.centerWidth = 300;
                    this.rightWidth = 170;
                    this.centerBottomHeight = 100;
                    this.allowCenterBottomResize = true;
                    this.inWindow = true;
                    this.allowLeftCollapse = true;
                    this.isLeftCollapse = false;
                    this.allowLeftResize = true;
                    this.allowRightCollapse = true;
                    this.isRightCollapse = false;
                    this.allowRightResize = true;
                    this.allowTopResize = true;
                    this.allowBottomResize = true;
                    this.space = 3;
                    this.minLeftWidth = 80;
                    this.minRightWidth = 80;
                    this.onEndResize = null;
                    this.onLeftToggle = null;
                    this.onRightToggle = null;
                    this.onHeightChanged = null;
                    this.content = component.Layout.CONTENT_CENTER;
                }
                return LayoutOptions;
            }());
            component.LayoutOptions = LayoutOptions;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
//# sourceMappingURL=zane.web.component.js.map