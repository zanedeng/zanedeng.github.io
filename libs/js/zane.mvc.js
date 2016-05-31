var zane;
(function (zane) {
    var mvc;
    (function (mvc) {
        var Controller = (function () {
            function Controller(cmd) {
                if (Controller.hasController(cmd))
                    throw new Error("Controller cmd [" + cmd + "] instance already constructed !");
                this.cmd = cmd;
                Controller.controllerList.push(this);
                this.onRegister();
            }
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
                        Controller.controllerList[i].onRemove();
                        Controller.controllerList[i] = null;
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
                        Controller.controllerList[i].execute(data, sponsor);
                    }
                    i++;
                }
            };
            Controller.prototype.onRegister = function () { };
            Controller.prototype.onRemove = function () { };
            Controller.prototype.execute = function (data, sponsor) {
                if (data === void 0) { data = null; }
                if (sponsor === void 0) { sponsor = null; }
            };
            Controller.prototype.sendEvent = function (cmd, data, strict) {
                if (data === void 0) { data = null; }
                if (strict === void 0) { strict = false; }
                if (!strict)
                    mvc.View.notifyViews(cmd, data, this);
                Controller.notifyControllers(cmd, data, this);
            };
            Controller.prototype.registerView = function (name, viewClass, viewComponent) {
                new viewClass(name, viewComponent);
            };
            Controller.prototype.retrieveView = function (name) {
                return mvc.View.retrieveView(name);
            };
            Controller.prototype.removeView = function (name) {
                mvc.View.removeView(name);
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
                return mvc.Model.retrieveModel(name);
            };
            Controller.prototype.removeModel = function (name) {
                mvc.Model.removeModel(name);
            };
            Controller.controllerList = [];
            return Controller;
        }());
        mvc.Controller = Controller;
    })(mvc = zane.mvc || (zane.mvc = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var mvc;
    (function (mvc) {
        var Model = (function () {
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
            Model.prototype.onRegister = function () { };
            Model.prototype.onRemove = function () { };
            Model.prototype.sendEvent = function (type, data) {
                if (data === void 0) { data = null; }
                mvc.View.notifyViews(type, data, this);
            };
            Model.modelList = [];
            return Model;
        }());
        mvc.Model = Model;
    })(mvc = zane.mvc || (zane.mvc = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var mvc;
    (function (mvc) {
        var View = (function () {
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
                    mvc.Controller.notifyControllers(type, data, this);
                View.notifyViews(type, data, this);
            };
            View.prototype.registerView = function (name, viewClass, viewComponent) {
                new viewClass(name, viewComponent);
            };
            View.prototype.retrieveView = function (name) {
                return View.retrieveView(name);
            };
            View.prototype.retrieveModel = function (name) {
                return mvc.Model.retrieveModel(name);
            };
            View.viewList = [];
            return View;
        }());
        mvc.View = View;
    })(mvc = zane.mvc || (zane.mvc = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var mvc;
    (function (mvc) {
        var MVCApp = (function () {
            function MVCApp() {
            }
            MVCApp.prototype.registerController = function (cmd, controllClass) {
                new controllClass(cmd);
            };
            MVCApp.prototype.registerModel = function (name, modelClass, data) {
                if (data === void 0) { data = null; }
                new modelClass(name, data);
            };
            MVCApp.prototype.registerView = function (name, viewClass, viewComponent) {
                new viewClass(name, viewComponent);
            };
            return MVCApp;
        }());
        mvc.MVCApp = MVCApp;
    })(mvc = zane.mvc || (zane.mvc = {}));
})(zane || (zane = {}));
//# sourceMappingURL=zane.mvc.js.map