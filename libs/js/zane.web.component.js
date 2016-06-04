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
                }
                Layout.prototype.setLeftCollapse = function (isCollapse) {
                    if (!this.leftElement)
                        return false;
                    this.isLeftCollapse = isCollapse;
                    var show = zane.HtmlUtl.show;
                    var hide = zane.HtmlUtl.hide;
                    if (this.isLeftCollapse) {
                        show(this.leftCollapseElement);
                        if (this.leftDropElement)
                            hide(this.leftDropElement);
                        hide(this.leftElement);
                    }
                    else {
                        hide(this.leftCollapseElement);
                        if (this.leftDropElement)
                            show(this.leftDropElement);
                        show(this.leftElement);
                    }
                    this._onResize();
                    this.trigger('leftToggle', [isCollapse]);
                    return true;
                };
                Layout.prototype.setRightCollapse = function (isCollapse) {
                    if (!this.rightElement)
                        return false;
                    this.isRightCollapse = isCollapse;
                    var show = zane.HtmlUtl.show;
                    var hide = zane.HtmlUtl.hide;
                    if (this.isRightCollapse) {
                        show(this.rightCollapseElement);
                        if (this.rightDropElement)
                            hide(this.rightDropElement);
                        hide(this.rightElement);
                    }
                    else {
                        hide(this.rightCollapseElement);
                        if (this.rightDropElement)
                            show(this.rightDropElement);
                        show(this.rightElement);
                    }
                    this._onResize();
                    this.trigger('rightToggle', [isCollapse]);
                    return true;
                };
                Layout.prototype._init = function () {
                    if (!this.options)
                        this.options = new component.LayoutOptions();
                    this.id = this.options.id || component.Component.generateId();
                    this.leftWidth = this.options.leftWidth;
                    this.rightWidth = this.options.rightWidth;
                    this.isLeftCollapse = this.options.isLeftCollapse;
                    this.isRightCollapse = this.options.isRightCollapse;
                    this.stopDragBindFun = this._stopDrag.bind(this);
                    this.dragBindFun = this._drag.bind(this);
                    this.resizeBindFun = this._onResize.bind(this);
                };
                Layout.prototype._render = function () {
                    this.element = document.createElement("div");
                    this.element.className = "layout";
                    this.element.id = this.id;
                    this.element.style.width = this.options.width;
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
                        this.centerElement.style.width = this.options.centerWidth + "px";
                        this.element.appendChild(this.centerElement);
                        this.centerContentElement = document.createElement("div");
                        this.centerContentElement.className = "layout-content";
                        this.centerElement.appendChild(this.centerContentElement);
                        if (content.substr(5, 1) == "1") {
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
                };
                Layout.prototype._addDropHandle = function () {
                    var self = this;
                    if (this.leftElement && this.options.allowLeftResize) {
                        this.leftDropElement = document.createElement("div");
                        this.leftDropElement.className = "layout-drop-left";
                        this.leftDropElement.style.display = "block";
                        this.leftDropElement.addEventListener("mousedown", function (e) {
                            self._startDrag("leftResize", e);
                        }, false);
                        this.element.appendChild(this.leftDropElement);
                    }
                    if (this.rightElement && this.options.allowRightResize) {
                        this.rightDropElement = document.createElement("div");
                        this.rightDropElement.className = "layout-drop-right";
                        this.rightDropElement.style.display = "block";
                        this.rightDropElement.addEventListener("mousedown", function (e) {
                            self._startDrag("rightResize", e);
                        }, false);
                        this.element.appendChild(this.rightDropElement);
                    }
                    if (this.topElement && this.options.allowTopResize) {
                        this.topDropElement = document.createElement("div");
                        this.topDropElement.className = "layout-drop-top";
                        this.topDropElement.style.display = "block";
                        this.topDropElement.addEventListener("mousedown", function (e) {
                            self._startDrag("topResize", e);
                        }, false);
                        this.element.appendChild(this.topDropElement);
                    }
                    if (this.bottomElement && this.options.allowBottomResize) {
                        this.bottomDropElement = document.createElement("div");
                        this.bottomDropElement.className = "layout-drop-bottom";
                        this.bottomDropElement.style.display = "block";
                        this.bottomDropElement.addEventListener("mousedown", function (e) {
                            self._startDrag("bottomResize", e);
                        }, false);
                        this.element.appendChild(this.bottomDropElement);
                    }
                    if (this.centerBottomElement && this.options.allowCenterBottomResize) {
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
                };
                Layout.prototype._startDrag = function (dragType, e) {
                    if (e === void 0) { e = null; }
                    this.dragType = dragType;
                    if (this.dragType == 'leftResize' || this.dragType == 'rightResize') {
                        this.xResize = { startX: e.pageX, diff: 0 };
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
                    else if (this.dragType == 'topResize' || this.dragType == 'bottomResize') {
                        this.yResize = { startY: e.pageY, diff: 0 };
                        this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                        this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                        this.draggingXLineElement.style.display = "block";
                        document.body.style.cursor = "ns-resize";
                        this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                        this.draggingMaskElement.style.display = "block";
                        zane.HtmlUtl.removeClass(this.draggingMaskElement, "layout-xmask");
                        zane.HtmlUtl.addClass(this.draggingMaskElement, "layout-ymask");
                    }
                    else if (this.dragType == 'centerBottomResize') {
                        this.yResize = { startY: e.pageY, diff: 0 };
                        this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                        this.draggingXLineElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                        this.draggingXLineElement.style.display = "block";
                        document.body.style.cursor = "ns-resize";
                        this.draggingMaskElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                        this.draggingMaskElement.style.display = "block";
                        zane.HtmlUtl.removeClass(this.draggingMaskElement, "layout-xmask");
                        zane.HtmlUtl.addClass(this.draggingMaskElement, "layout-ymask");
                    }
                    else {
                        return;
                    }
                    this.lockElement.style.width = zane.HtmlUtl.width(this.element) + "px";
                    this.lockElement.style.height = zane.HtmlUtl.height(this.element) + "px";
                    this.lockElement.style.display = "block";
                    if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari) {
                        document.body.onselectstart = function (e) {
                            return false;
                        };
                    }
                    document.addEventListener("mouseup", this.stopDragBindFun, false);
                    document.addEventListener("mousemove", this.dragBindFun, false);
                };
                Layout.prototype._setCollapse = function () {
                };
                Layout.prototype._build = function () {
                    var tempNum = 0;
                    this.middleTop = 0;
                    if (this.topElement) {
                        this.middleTop += parseInt(this.topElement.style.height);
                        tempNum = parseInt(this.topElement.style.borderTopWidth) || 1;
                        this.middleTop += tempNum;
                        tempNum = parseInt(this.topElement.style.borderBottomWidth) || 1;
                        this.middleTop += tempNum;
                        this.middleTop += this.options.space;
                    }
                    if (this.leftElement) {
                        this.leftElement.style.top = this.middleTop + "px";
                        this.leftCollapseElement.style.top = this.middleTop + "px";
                    }
                    if (this.centerElement) {
                        this.centerElement.style.top = this.middleTop + "px";
                    }
                    if (this.rightElement) {
                        this.rightElement.style.top = this.middleTop + "px";
                        this.rightCollapseElement.style.top = this.middleTop + "px";
                    }
                    if (this.leftElement)
                        this.leftElement.style.left = "0";
                    this._onResize();
                };
                Layout.prototype._stopDrag = function (e) {
                    if (e === void 0) { e = null; }
                    var diff, tempNum;
                    if (this.xResize) {
                        diff = this.xResize.diff;
                        if (this.dragType == "leftResize") {
                            if (this.leftWidth + this.xResize.diff < this.options.minLeftWidth) {
                                this.leftWidth = this.options.minLeftWidth;
                            }
                            else {
                                this.leftWidth += this.xResize.diff;
                            }
                            var leftDiff = this.leftWidth - parseInt(this.leftElement.style.width);
                            this.leftElement.style.width = this.leftWidth + "px";
                            if (this.centerElement) {
                                tempNum = parseInt(this.centerElement.style.width);
                                this.centerElement.style.width = (tempNum - leftDiff) + "px";
                                tempNum = parseInt(this.centerElement.style.left) || 0;
                                this.centerElement.style.left = (tempNum + leftDiff) + "px";
                            }
                            else if (this.rightElement) {
                                tempNum = parseInt(this.leftElement.style.width);
                                this.rightElement.style.width = (tempNum - leftDiff) + "px";
                                tempNum = parseInt(this.centerElement.style.left) || 0;
                                this.rightElement.style.left = (tempNum + leftDiff) + "px";
                            }
                        }
                        else if (this.dragType == "rightResize") {
                            if (this.rightWidth - this.xResize.diff < this.options.minRightWidth) {
                                this.rightWidth = this.options.minRightWidth;
                            }
                            else {
                                this.rightWidth -= this.xResize.diff;
                            }
                            var rightDiff = parseInt(this.rightElement.style.width) - this.rightWidth;
                            this.rightElement.style.width = this.rightWidth + "px";
                            tempNum = parseInt(this.rightElement.style.left) || 0;
                            this.rightElement.style.left = (tempNum + rightDiff) + "px";
                            if (this.centerElement) {
                                tempNum = parseInt(this.centerElement.style.width);
                                this.centerElement.style.width = (tempNum + rightDiff) + "px";
                            }
                            else if (this.leftElement) {
                                tempNum = parseInt(this.leftElement.style.width);
                                this.leftElement.style.width = (tempNum + rightDiff) + "px";
                            }
                        }
                        this._updateCenterBottom();
                    }
                    else if (this.yResize) {
                        diff = this.yResize.diff;
                        if (this.dragType == 'topResize') {
                            tempNum = parseInt(this.topElement.style.height);
                            this.topElement.style.height = (tempNum + this.yResize.diff) + "px";
                            this.middleTop += this.yResize.diff;
                            this.middleHeight -= this.yResize.diff;
                            if (this.leftElement) {
                                this.leftElement.style.top = this.middleTop + "px";
                                this.leftElement.style.height = this.middleHeight + "px";
                            }
                            if (this.centerElement) {
                                this.centerElement.style.top = this.middleTop + "px";
                                this.centerElement.style.height = this.middleHeight + "px";
                                this.centerContentElement.style.height = this.middleHeight + "px";
                            }
                            if (this.rightElement) {
                                this.rightElement.style.top = this.middleTop + "px";
                                this.rightElement.style.height = this.middleHeight + "px";
                            }
                            this._updateCenterBottom(true);
                        }
                        else if (this.dragType == 'bottomResize') {
                            tempNum = parseInt(this.bottomElement.style.height);
                            this.bottomElement.style.height = (tempNum - this.yResize.diff) + "px";
                            this.middleHeight += this.yResize.diff;
                            this.bottomTop += this.yResize.diff;
                            this.bottomElement.style.top = this.bottomTop + "px";
                            if (this.leftElement) {
                                this.leftElement.style.height = this.middleHeight + "px";
                            }
                            if (this.centerElement) {
                                this.centerElement.style.height = this.middleHeight + "px";
                                this.centerContentElement.style.height = this.middleHeight + "px";
                            }
                            if (this.rightElement) {
                                this.rightElement.style.height = this.middleHeight + "px";
                            }
                            this._updateCenterBottom(true);
                        }
                        else if (this.dragType == 'centerBottomResize') {
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
                    if (zane.BrowserUtil.isIE || zane.BrowserUtil.isSafari) {
                        document.body.onselectstart = null;
                    }
                    document.removeEventListener("mouseup", this.stopDragBindFun);
                    document.removeEventListener("mousemove", this.dragBindFun);
                    document.body.style.cursor = "";
                };
                Layout.prototype._drag = function (e) {
                    if (e === void 0) { e = null; }
                    if (this.xResize) {
                        this.xResize.diff = e.pageX - this.xResize.startX;
                        this.draggingYLineElement.style.left = (e.pageX - zane.HtmlUtl.getOffset(this.element).x) + "px";
                        document.body.style.cursor = "ew-resize";
                    }
                    else if (this.yResize) {
                        this.yResize.diff = e.pageY - this.yResize.startY;
                        this.draggingXLineElement.style.top = (e.pageY - zane.HtmlUtl.getOffset(this.element).y) + "px";
                        document.body.style.cursor = "ns-resize";
                    }
                };
                Layout.prototype._updateCenterBottom = function (isHeightResize) {
                    if (isHeightResize === void 0) { isHeightResize = false; }
                    if (this.centerBottomElement) {
                        if (isHeightResize) {
                            this.centerBottomElement.style.left = this.centerLeft + "px";
                            if (this.centerWidth >= 0) {
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
                };
                Layout.prototype._setDropHandlePosition = function () {
                    var tempNum = 0;
                    if (this.leftDropElement) {
                        tempNum = parseInt(this.leftElement.style.left) || 0;
                        this.leftDropElement.style.left = (parseInt(this.leftElement.style.width) + tempNum) + "px";
                        this.leftDropElement.style.top = this.middleTop + "px";
                        this.leftDropElement.style.height = this.middleHeight + "px";
                    }
                    if (this.rightDropElement) {
                        tempNum = parseInt(this.rightElement.style.left) || 0;
                        this.rightDropElement.style.left = (tempNum - this.options.space) + "px";
                        this.rightDropElement.style.top = this.middleTop + "px";
                        this.rightDropElement.style.height = this.middleHeight + "px";
                    }
                    if (this.topDropElement) {
                        tempNum = parseInt(this.topElement.style.top) || 0;
                        this.topDropElement.style.top = (parseInt(this.topElement.style.height) + tempNum) + "px";
                        this.topDropElement.style.width = zane.HtmlUtl.width(this.topElement) + "px";
                    }
                    if (this.bottomDropElement) {
                        tempNum = parseInt(this.bottomElement.style.top) || 0;
                        this.bottomDropElement.style.top = (tempNum - this.options.space) + "px";
                        this.bottomDropElement.style.width = zane.HtmlUtl.width(this.bottomElement) + "px";
                    }
                    if (this.centerBottomDropElement) {
                        tempNum = parseInt(this.centerBottomElement.style.top) || 0;
                        this.centerBottomDropElement.style.top = (tempNum - this.options.space) + "px";
                        tempNum = parseInt(this.centerElement.style.left) || 0;
                        this.centerBottomDropElement.style.left = tempNum + "px";
                        this.centerBottomDropElement.style.width = zane.HtmlUtl.width(this.centerElement) + "px";
                    }
                };
                Layout.prototype._onResize = function () {
                    if (this.isResize) {
                        setTimeout(this.resizeBindFun, 200);
                        return;
                    }
                    this.isResize = true;
                    var h = 0;
                    var oldHeight = zane.HtmlUtl.height(this.element);
                    var windowHeight = zane.BrowserUtil.innerHeight();
                    var parentHeight = 0;
                    var tempNum = 0;
                    if (typeof (this.options.height) == "string" && this.options.height.indexOf('%') > 0) {
                        if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body") {
                            parentHeight = windowHeight;
                            tempNum = parseInt(document.body.style.paddingTop) || 1;
                            parentHeight -= tempNum;
                            tempNum = parseInt(document.body.style.paddingBottom) || 1;
                            parentHeight -= tempNum;
                        }
                        else {
                            parentHeight = zane.HtmlUtl.height(this.parent);
                        }
                        h = parentHeight * parseFloat(this.options.height) * 0.01;
                        if (this.options.inWindow || this.parent.tagName.toLowerCase() == "body") {
                            tempNum = parseInt(document.body.style.paddingTop) || 1;
                            h -= ((zane.HtmlUtl.getOffset(this.element).y - tempNum));
                        }
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
                        tempNum = parseInt(this.topElement.style.borderTopWidth) || 1;
                        this.middleHeight -= tempNum;
                        tempNum = parseInt(this.topElement.style.borderBottomWidth) || 1;
                        this.middleHeight -= tempNum;
                        this.middleHeight -= this.options.space;
                    }
                    if (this.bottomElement) {
                        this.middleHeight -= zane.HtmlUtl.height(this.bottomElement);
                        tempNum = parseInt(this.bottomElement.style.borderTopWidth) || 1;
                        this.middleHeight -= tempNum;
                        tempNum = parseInt(this.bottomElement.style.borderBottomWidth) || 1;
                        this.middleHeight -= tempNum;
                        this.middleHeight -= this.options.space;
                    }
                    this.middleHeight -= 4;
                    if (this.hasBind('heightChanged') && this.layoutHeight != oldHeight) {
                        this.trigger('heightChanged', [{
                                layoutHeight: this.layoutHeight,
                                diff: this.layoutHeight - oldHeight,
                                middleHeight: this.middleHeight
                            }]);
                    }
                    if (this.centerElement) {
                        this.centerWidth = this.middleWidth;
                        this.centerLeft = 0;
                        if (this.leftElement) {
                            if (this.isLeftCollapse) {
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
                            else {
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
                        if (this.rightElement) {
                            if (this.isRightCollapse) {
                                tempNum = zane.HtmlUtl.width(this.rightCollapseElement) + 2;
                                this.centerWidth -= tempNum;
                                tempNum = parseInt(this.rightCollapseElement.style.borderLeftWidth) || 1;
                                this.centerWidth -= tempNum;
                                tempNum = parseInt(this.rightCollapseElement.style.borderRightWidth) || 1;
                                this.centerWidth -= tempNum;
                                tempNum = parseInt(this.rightCollapseElement.style.right) || 0;
                                this.centerWidth -= tempNum;
                            }
                            else {
                                this.centerWidth -= this.rightWidth;
                                tempNum = parseInt(this.rightElement.style.borderLeftWidth) || 1;
                                this.centerWidth -= tempNum;
                                tempNum = parseInt(this.rightElement.style.borderRightWidth) || 1;
                                this.centerWidth -= tempNum;
                            }
                            this.centerWidth -= this.options.space;
                        }
                        this.centerElement.style.left = this.centerLeft + "px";
                        if (this.centerWidth >= 0) {
                            this.centerWidth -= 2;
                            this.centerElement.style.width = this.centerWidth + "px";
                        }
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
                            if (this.isLeftCollapse) {
                                this.rightLeft += zane.HtmlUtl.width(this.leftCollapseElement) + 2;
                                tempNum = parseInt(this.leftCollapseElement.style.borderLeftWidth) || 1;
                                this.rightLeft += tempNum;
                                tempNum = parseInt(this.leftCollapseElement.style.borderRightWidth) || 1;
                                this.rightLeft += tempNum;
                                tempNum = parseInt(this.leftCollapseElement.style.left) || 0;
                                this.rightLeft += tempNum;
                            }
                            else {
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
                        if (this.centerElement) {
                            this.rightLeft += zane.HtmlUtl.width(this.centerElement) + 2;
                            tempNum = parseInt(this.centerElement.style.borderLeftWidth) || 1;
                            this.rightLeft += tempNum;
                            tempNum = parseInt(this.centerElement.style.borderRightWidth) || 1;
                            this.rightLeft += tempNum;
                            this.rightLeft += this.options.space;
                        }
                        this.rightElement.style.left = this.rightLeft + "px";
                    }
                    if (this.bottomElement) {
                        this.bottomTop = this.layoutHeight - zane.HtmlUtl.height(this.bottomElement) - 2;
                        this.bottomElement.style.top = this.bottomTop + "px";
                    }
                    this._setDropHandlePosition();
                    this.isResize = false;
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
            var Menu = (function (_super) {
                __extends(Menu, _super);
                function Menu(parent, options) {
                    if (options === void 0) { options = null; }
                    _super.call(this, parent, options);
                }
                Menu.prototype.show = function (options, menu) {
                    if (options === void 0) { options = null; }
                    if (menu === void 0) { menu = null; }
                    if (!menu)
                        menu = this.element;
                    if (options && options.left != undefined) {
                        menu.style.left = options.left + "px";
                    }
                    if (options && options.top != undefined) {
                        menu.style.top = options.top + "px";
                    }
                    zane.HtmlUtl.show(menu);
                    this.updateShadow();
                };
                Menu.prototype.hide = function (menu) {
                    if (menu === void 0) { menu = null; }
                    if (!menu)
                        menu = this.element;
                    this.hideAllSubMenu();
                    zane.HtmlUtl.hide(menu);
                    this.updateShadow();
                };
                Menu.prototype.toggle = function () {
                    zane.HtmlUtl.toggle(this.element);
                    this.updateShadow();
                };
                Menu.prototype.addItem = function (data, target) {
                    if (target === void 0) { target = null; }
                    if (!data)
                        return;
                    if (target == null)
                        target = this.element;
                    if (data.line) {
                        var menuItemLine = document.createElement("div");
                        menuItemLine.className = "menu-item-line";
                        target.appendChild(menuItemLine);
                    }
                    else {
                        var menuItem = document.createElement("div");
                        menuItem.className = "menu-item";
                        menuItem.setAttribute("menuItemID", (this.menuItemCount++).toString());
                        if (data.id) {
                            menuItem.id = data.id;
                        }
                        target.appendChild(menuItem);
                        var menuItemText = document.createElement("div");
                        menuItemText.className = "menu-item-text";
                        if (data.text) {
                            menuItemText.innerText = data.text;
                        }
                        menuItem.appendChild(menuItemText);
                        var menuItemIcon;
                        if (data.icon) {
                            menuItemIcon = document.createElement("div");
                            menuItemIcon.className = "menu-item-icon icon-" + data.icon;
                            menuItem.appendChild(menuItemIcon);
                        }
                        if (data.img) {
                            menuItemIcon = document.createElement("div");
                            menuItemIcon.className = "menu-item-ico";
                            menuItemIcon.innerHTML = "<img style=\"width:16px;height:16px;margin:2px;\" src=\"" + data.img + "\" />";
                            menuItem.appendChild(menuItemIcon);
                        }
                        if (data.disable || data.disabled) {
                            zane.HtmlUtl.addClass(menuItem, "menu-item-disable");
                        }
                        if (data.children) {
                            var menuItemArrow = document.createElement("div");
                            menuItemArrow.className = "menu-item-arrow";
                            menuItem.appendChild(menuItemArrow);
                            this.subMenuDict[menuItem.getAttribute("menuItemID")] = new Menu(this.parent, data.children);
                        }
                    }
                };
                Menu.prototype.removeItem = function () {
                };
                Menu.prototype.hideAllSubMenu = function () {
                };
                Menu.prototype._init = function () {
                    if (!this.options)
                        this.options = new component.MenuOptions();
                    this.menuItemCount = 0;
                    this.subMenuDict = {};
                    this.showedSubMenu = false;
                    this.mouseleaveBinFun = this.onMouseLeave.bind(this);
                };
                Menu.prototype._render = function () {
                    this.element = document.createElement("div");
                    this.element.className = "menu";
                    this.element.style.display = "none";
                    this.element.style.left = this.options.x + "px";
                    this.element.style.top = this.options.y + "px";
                    this.element.style.width = this.options.width + "px";
                    this.element.addEventListener("mouseleave", this.mouseleaveBinFun, false);
                    if (this.parent) {
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
                    if (this.options.shadow) {
                        this.shadowElement = document.createElement("div");
                        this.shadowElement.className = "menu-shadow";
                        this.parent.appendChild(this.shadowElement);
                        this.updateShadow();
                    }
                    if (this.options.customClass) {
                        this.element.className = this.options.customClass;
                    }
                    if (this.options.menuData) {
                        for (var i = 0, l = this.options.menuData.length; i < l; ++i) {
                            this.addItem(this.options.menuData[i]);
                        }
                    }
                };
                Menu.prototype.updateShadow = function () {
                    if (this.shadowElement) {
                        this.shadowElement.style.left = this.element.style.left;
                        this.shadowElement.style.top = this.element.style.top;
                        this.shadowElement.style.display = this.element.style.display;
                        this.shadowElement.style.width = zane.HtmlUtl.outerWidth(this.shadowElement) + "px";
                        this.shadowElement.style.height = zane.HtmlUtl.outerHeight(this.shadowElement) + "px";
                    }
                };
                Menu.prototype.onMouseLeave = function (e) {
                    if (!this.showedSubMenu) {
                        this.menuOverElement.style.top = "-24px";
                    }
                };
                return Menu;
            }(component.Component));
            component.Menu = Menu;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var component;
        (function (component) {
            var MenuBar = (function (_super) {
                __extends(MenuBar, _super);
                function MenuBar(parent, options) {
                    if (options === void 0) { options = null; }
                    _super.call(this, parent, options);
                }
                MenuBar.prototype._init = function () {
                    if (!this.options)
                        this.options = new component.LayoutOptions();
                };
                MenuBar.prototype._render = function () {
                };
                return MenuBar;
            }(component.Component));
            component.MenuBar = MenuBar;
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
                    this.minLeftWidth = 80;
                    this.centerWidth = 300;
                    this.rightWidth = 170;
                    this.minRightWidth = 80;
                    this.centerBottomHeight = 100;
                    this.inWindow = true;
                    this.isLeftCollapse = false;
                    this.isRightCollapse = false;
                    this.allowCenterBottomResize = true;
                    this.allowLeftResize = true;
                    this.allowRightResize = true;
                    this.allowTopResize = true;
                    this.allowBottomResize = true;
                    this.space = 0;
                    this.content = component.Layout.CONTENT_CENTER;
                }
                return LayoutOptions;
            }());
            component.LayoutOptions = LayoutOptions;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var component;
        (function (component) {
            var MenuOptions = (function () {
                function MenuOptions() {
                    this.width = 150;
                    this.x = 0;
                    this.y = 0;
                    this.customClass = null;
                    this.shadow = false;
                    this.menuData = null;
                }
                return MenuOptions;
            }());
            component.MenuOptions = MenuOptions;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
//# sourceMappingURL=zane.web.component.js.map