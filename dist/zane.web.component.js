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
                function Component(element, options) {
                    if (element === void 0) { element = null; }
                    if (options === void 0) { options = {}; }
                    this.events = {};
                    this.options = {};
                    this.children = {};
                    this.options = options || {};
                    this.element = element;
                    this._init();
                    this._preRender();
                    this.trigger('render');
                    this._render();
                    this.trigger('rendered');
                    this._rendered();
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
                function Layout(element, options) {
                    if (element === void 0) { element = null; }
                    if (options === void 0) { options = {}; }
                    _super.call(this, element, options);
                    this.topElement = null;
                    this.topContentElement = null;
                    this.topHeight = 50;
                    this.bottomElement = null;
                    this.bottomHeight = 50;
                    this.leftElement = null;
                    this.leftWidth = 110;
                    this.centerElement = null;
                    this.centerWidth = 300;
                    this.rightElement = null;
                    this.rightWidth = 170;
                    this.centerBottomElement = null;
                    this.centerBottomHeight = 100;
                    this.allowCenterBottomResize = true;
                    this.inWindow = true;
                    this.heightDiff = 0;
                    this.height = '100%';
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
                }
                Layout.prototype._init = function () {
                    zane.HtmlUtl.addClass(this.element, "layout");
                    var i, l;
                    var topElements = zane.HtmlUtl.find(this.element, "> div[position=top]");
                    console.log("topElements:" + topElements);
                };
                return Layout;
            }(component.Component));
            component.Layout = Layout;
        })(component = web.component || (web.component = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
//# sourceMappingURL=zane.web.component.js.map