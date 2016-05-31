/**
 * http://www.zane.com
 * Released under the MIT license
 */
var zane = (function() {
var zane = {};

/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
var zane;
(function (zane) {
    /**
     * @class zane.Controller
     */
    var Controller = (function () {
        ////////////////////////////////////////////////////////////////////////////
        //  constructor
        ////////////////////////////////////////////////////////////////////////////
        function Controller(cmd) {
            if (Controller.hasController(cmd))
                throw new Error("Controller cmd [" + cmd + "] instance already constructed !");
            this.cmd = cmd;
            Controller.controllerList.push(this);
            this.onRegister();
        }
        ////////////////////////////////////////////////////////////////////////////
        //  private static methods
        ////////////////////////////////////////////////////////////////////////////
        Controller.hasController = function (cmd) {
            var len = Controller.controllerList.length;
            for (var i = 0; i < len; ++i) {
                if (Controller.controllerList[i].cmd == cmd) {
                    return true;
                }
            }
            return false;
        };
        Controller.removeController = function (cmd) {
            var len = Controller.controllerList.length;
            for (var i = len - 1; i <= 0; ++i) {
                if (Controller.controllerList[i].cmd == cmd) {
                    //注销附加操作
                    Controller.controllerList[i].onRemove();
                    Controller.controllerList[i] = null;
                    //确保controller总是非空
                    Controller.controllerList.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        Controller.notifyControllers = function (cmd, data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
            var i = 0;
            while (i < Controller.controllerList.length) {
                if (Controller.controllerList[i].cmd == cmd) {
                    //执行一个或多个命令（FIFO）
                    Controller.controllerList[i].execute(data, sponsor);
                }
                i++;
            }
        };
        ////////////////////////////////////////////////////////////////////////////
        //  public methods
        ////////////////////////////////////////////////////////////////////////////
        /**
         * 注册附加操作，需在子类中覆盖使用
         */
        Controller.prototype.onRegister = function () { };
        /**
         * 注销附加操作，需在子类中覆盖使用
         */
        Controller.prototype.onRemove = function () { };
        /**
         * 执行Controller逻辑处理，需在子类中覆盖使用
         */
        Controller.prototype.execute = function (data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
        };
        Controller.prototype.sendEvent = function (cmd, data, strict) {
            if (data === void 0) { data = null; }
            if (strict === void 0) { strict = false; }
            if (!strict)
                zane.View.notifyViews(cmd, data, this);
            Controller.notifyControllers(cmd, data, this);
        };
        Controller.prototype.registerView = function (name, viewClass, viewComponent) {
            new viewClass(name, viewComponent);
        };
        Controller.prototype.retrieveView = function (name) {
            return zane.View.retrieveView(name);
        };
        Controller.prototype.removeView = function (name) {
            zane.View.removeView(name);
        };
        Controller.prototype.registerController = function (cmd, controllClass) {
            new controllClass(cmd);
        };
        Controller.prototype.removeController = function (cmd) {
            Controller.removeController(cmd);
        };
        Controller.prototype.registerModel = function (name, modelClass, data) {
            if (data === void 0) { data = null; }
            new modelClass(name, data);
        };
        Controller.prototype.retrieveModel = function (name) {
            return zane.Model.retrieveModel(name);
        };
        Controller.prototype.removeModel = function (name) {
            zane.Model.removeModel(name);
        };
        ////////////////////////////////////////////////////////////////////////////
        // protected static property
        ////////////////////////////////////////////////////////////////////////////
        Controller.controllerList = [];
        return Controller;
    })();
    zane.Controller = Controller;
})(zane || (zane = {}));
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
var zane;
(function (zane) {
    /**
     * @class zane.Model
     */
    var Model = (function () {
        ////////////////////////////////////////////////////////////////////////////
        //  constructor
        ////////////////////////////////////////////////////////////////////////////
        function Model(name, data) {
            if (data === void 0) { data = null; }
            this.data = {};
            if (name == undefined || name == "")
                throw new Error("Model name can not undefined!");
            if (Model.retrieveModel(name) != null)
                throw new Error("Model[" + name + "]" + " instance  already constructed !");
            this.name = name;
            if (data != null) {
                for (var i in data)
                    this.data[i] = data[i];
            }
            Model.modelList.push(this);
            this.onRegister();
        }
        ////////////////////////////////////////////////////////////////////////////
        //  public static methods
        ////////////////////////////////////////////////////////////////////////////
        Model.retrieveModel = function (name) {
            var len = Model.modelList.length;
            for (var i = 0; i < len; ++i) {
                if (Model.modelList[i].name == name) {
                    return Model.modelList[i];
                }
            }
            return null;
        };
        Model.removeModel = function (name) {
            var len = Model.modelList.length;
            for (var i = 0; i < len; ++i) {
                if (Model.modelList[i].name == name) {
                    Model.modelList[i].onRemove();
                    Model.modelList[i].data = null;
                    Model.modelList[i] = null;
                    Model.modelList.splice(i, 1);
                    break;
                }
            }
        };
        ////////////////////////////////////////////////////////////////////////////
        //  public methods
        ////////////////////////////////////////////////////////////////////////////
        Model.prototype.onRegister = function () { };
        Model.prototype.onRemove = function () { };
        Model.prototype.sendEvent = function (type, data) {
            if (data === void 0) { data = null; }
            zane.View.notifyViews(type, data, this);
        };
        ////////////////////////////////////////////////////////////////////////////
        // public static property
        ////////////////////////////////////////////////////////////////////////////
        Model.modelList = [];
        return Model;
    })();
    zane.Model = Model;
})(zane || (zane = {}));
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
var zane;
(function (zane) {
    /**
     * @class zane.View
     */
    var View = (function () {
        ////////////////////////////////////////////////////////////////////////////
        //  constructor
        ////////////////////////////////////////////////////////////////////////////
        function View(name, viewComponent) {
            this.eventList = [];
            if (name == undefined || name == "")
                throw new Error("View name can not undefined!");
            if (View.retrieveView(name) != null)
                throw new Error("View[" + name + "] instance already constructed !");
            this.name = name;
            this.viewComponent = viewComponent;
            this.eventList = this.listEventInterests();
            View.viewList.push(this);
            this.onRegister();
        }
        ////////////////////////////////////////////////////////////////////////////
        //  public static methods
        ////////////////////////////////////////////////////////////////////////////
        View.retrieveView = function (name) {
            var len = View.viewList.length;
            for (var i = 0; i < len; ++i) {
                if (View.viewList[i].name == name) {
                    return View.viewList[i];
                }
            }
            return null;
        };
        View.removeView = function (name) {
            var len = View.viewList.length;
            for (var i = 0; i < len; ++i) {
                if (View.viewList[i].name == name) {
                    View.viewList[i].onRemove();
                    View.viewList[i].viewComponent = null;
                    View.viewList[i].eventList = null;
                    View.viewList[i] = null;
                    View.viewList.splice(i, 1);
                    break;
                }
            }
        };
        View.removeViews = function () {
            var argArray = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                argArray[_i - 0] = arguments[_i];
            }
            var len = argArray.length;
            for (var i = 0; i < len; ++i) {
                View.removeView(argArray[i]);
            }
        };
        View.removeAllView = function () {
            var exception = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                exception[_i - 0] = arguments[_i];
            }
            var len = View.viewList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (exception.indexOf(View.viewList[i].name) == -1) {
                    View.viewList[i].onRemove();
                    View.viewList[i].viewComponent = null;
                    View.viewList[i].eventList = null;
                    View.viewList[i] = null;
                    View.viewList.splice(i, 1);
                }
            }
        };
        View.notifyViews = function (type, data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
            var len = View.viewList.length;
            var motifyList = [];
            for (var i = 0; i < len; ++i) {
                var eventLen = View.viewList[i].eventList.length;
                for (var k = 0; k < eventLen; ++k) {
                    if (View.viewList[i].eventList[k] == type) {
                        motifyList.push(View.viewList[i]);
                    }
                }
            }
            for (var j = 0; j < motifyList.length; j++) {
                motifyList[j].handleEvent(type, data, sponsor);
            }
        };
        ////////////////////////////////////////////////////////////////////////////
        //  public methods
        ////////////////////////////////////////////////////////////////////////////
        View.prototype.onRegister = function () { };
        View.prototype.onRemove = function () { };
        View.prototype.listEventInterests = function () { return []; };
        View.prototype.handleEvent = function (type, data, sponsor) {
            if (data === void 0) { data = null; }
            if (sponsor === void 0) { sponsor = null; }
        };
        View.prototype.sendEvent = function (type, data, strict) {
            if (data === void 0) { data = null; }
            if (strict === void 0) { strict = false; }
            if (!strict)
                zane.Controller.notifyControllers(type, data, this);
            View.notifyViews(type, data, this);
        };
        View.prototype.registerView = function (name, viewClass, viewComponent) {
            new viewClass(name, viewComponent);
        };
        View.prototype.retrieveView = function (name) {
            return View.retrieveView(name);
        };
        View.prototype.retrieveModel = function (name) {
            return zane.Model.retrieveModel(name);
        };
        ////////////////////////////////////////////////////////////////////////////
        // protected static property
        ////////////////////////////////////////////////////////////////////////////
        View.viewList = [];
        return View;
    })();
    zane.View = View;
})(zane || (zane = {}));
/**
 * Created by zane.deng on 2014/9/22.
 * @module zane
 */
var zane;
(function (zane) {
    /**
     * @class ss2d.mvc.MVCApp
     */
    var MVCApp = (function () {
        ////////////////////////////////////////////////////////////////////////////
        //  constructor
        ////////////////////////////////////////////////////////////////////////////
        function MVCApp() {
        }
        ////////////////////////////////////////////////////////////////////////////
        //  public methods
        ////////////////////////////////////////////////////////////////////////////
        /**
         * 注册控制器
         * @param controllClass 控制器类
         * @param cmd 控制器触发类型
         */
        MVCApp.prototype.registerController = function (cmd, controllClass) {
            new controllClass(cmd);
        };
        /**
         * 注册数据模型管理器
         * @param name 数据模型管理器名称
         * @param modelClass 数据模型管理器类
         * @param data 数据模型管理器的初始化数据
         */
        MVCApp.prototype.registerModel = function (name, modelClass, data) {
            if (data === void 0) { data = null; }
            new modelClass(name, data);
        };
        /**
         * 注册视图管理器
         * @param name 视图管理器名称
         * @param viewClass 视图管理器类
         * @param viewComponent 视图管理器管理的视图实例
         */
        MVCApp.prototype.registerView = function (name, viewClass, viewComponent) {
            new viewClass(name, viewComponent);
        };
        return MVCApp;
    })();
    zane.MVCApp = MVCApp;
})(zane || (zane = {}));

return zane;
})();
