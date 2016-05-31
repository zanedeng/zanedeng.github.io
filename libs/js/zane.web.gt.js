var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var Command = (function () {
                function Command() {
                }
                Command.LOAD_ASSET = "load_asset";
                Command.REGISTER_VIEW = "register_view";
                Command.REMOVE_VIEW = "remove_view";
                return Command;
            }());
            gt.Command = Command;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var ModelName = (function () {
                function ModelName() {
                }
                ModelName.MAIN = "main_model";
                return ModelName;
            }());
            gt.ModelName = ModelName;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var ViewName = (function () {
                function ViewName() {
                }
                ViewName.MAIN = "main_view";
                return ViewName;
            }());
            gt.ViewName = ViewName;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var LoadAssetController = (function (_super) {
                __extends(LoadAssetController, _super);
                function LoadAssetController(cmd) {
                    _super.call(this, cmd);
                }
                LoadAssetController.prototype.execute = function (data, sponsor) {
                    if (data === void 0) { data = null; }
                    if (sponsor === void 0) { sponsor = null; }
                };
                return LoadAssetController;
            }(zane.mvc.Controller));
            gt.LoadAssetController = LoadAssetController;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var RegisterViewController = (function (_super) {
                __extends(RegisterViewController, _super);
                function RegisterViewController(cmd) {
                    _super.call(this, cmd);
                }
                RegisterViewController.prototype.execute = function (data, sponsor) {
                    if (data === void 0) { data = null; }
                    if (sponsor === void 0) { sponsor = null; }
                };
                return RegisterViewController;
            }(zane.mvc.Controller));
            gt.RegisterViewController = RegisterViewController;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var RemoveViewController = (function (_super) {
                __extends(RemoveViewController, _super);
                function RemoveViewController(cmd) {
                    _super.call(this, cmd);
                }
                RemoveViewController.prototype.execute = function (data, sponsor) {
                    if (data === void 0) { data = null; }
                    if (sponsor === void 0) { sponsor = null; }
                };
                return RemoveViewController;
            }(zane.mvc.Controller));
            gt.RemoveViewController = RemoveViewController;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var MainModel = (function (_super) {
                __extends(MainModel, _super);
                function MainModel(name, data) {
                    if (data === void 0) { data = null; }
                    _super.call(this, name, data);
                }
                return MainModel;
            }(zane.mvc.Model));
            gt.MainModel = MainModel;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var MainView = (function (_super) {
                __extends(MainView, _super);
                function MainView(name, viewComponent) {
                    _super.call(this, name, viewComponent);
                }
                MainView.prototype.onRegister = function () {
                };
                MainView.prototype.onRemove = function () {
                };
                return MainView;
            }(zane.mvc.View));
            gt.MainView = MainView;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var Main = (function (_super) {
                __extends(Main, _super);
                function Main() {
                    _super.call(this);
                    this.startup();
                }
                Main.prototype.startup = function () {
                    this.registerController(gt.Command.LOAD_ASSET, gt.LoadAssetController);
                    this.registerController(gt.Command.REGISTER_VIEW, gt.RegisterViewController);
                    this.registerController(gt.Command.REMOVE_VIEW, gt.RemoveViewController);
                    this.registerModel(gt.ModelName.MAIN, gt.MainModel);
                    this.registerView(gt.ViewName.MAIN, gt.MainView, this);
                };
                return Main;
            }(zane.mvc.MVCApp));
            gt.Main = Main;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
//# sourceMappingURL=zane.web.gt.js.map