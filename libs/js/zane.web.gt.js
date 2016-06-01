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
                ViewName.LAYOUT = "layout_view";
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
                    var viewClass = data.getViewClass();
                    var viewName = data.getViewName();
                    var vcClass = data.getVcClass();
                    var vcProperties = data.getVcProperties();
                    var vcParameters = data.getVcParameters();
                    var modelName = data.getModelName();
                    var modelClass = data.getModelClass();
                    var modelData = data.getModelData();
                    if (!viewClass)
                        throw new Error("注册视图管理类不能为空！");
                    if (!vcClass)
                        throw new Error("注册视图类不能为空！");
                    if (viewName && this.retrieveView(viewName))
                        this.removeView(viewName);
                    if (modelName && modelClass)
                        this.registerModel(modelName, modelClass, modelData);
                    var vc = zane.createInstance(vcClass, vcProperties, vcParameters);
                    this.registerView(viewName, viewClass, vc);
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
                    if (data.getVid() && this.retrieveView(data.getVid())) {
                        this.removeView(data.getVid());
                        if (data.getMid() && this.retrieveModel(data.getMid())) {
                            this.removeModel(data.getMid());
                        }
                    }
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
                    this.sendEvent(gt.Command.REGISTER_VIEW, new gt.RegisterViewData().setData(gt.ViewName.LAYOUT, gt.LayoutView, gt.LayoutVc));
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
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var RegisterViewData = (function () {
                function RegisterViewData() {
                }
                RegisterViewData.prototype.setData = function (name, cls, vcCls, vcProperties, vcParameters, modelName, modelCls) {
                    if (vcProperties === void 0) { vcProperties = null; }
                    if (vcParameters === void 0) { vcParameters = null; }
                    if (modelName === void 0) { modelName = null; }
                    if (modelCls === void 0) { modelCls = null; }
                    this._viewName = name;
                    this._viewClass = cls;
                    this._vcClass = vcCls;
                    this._vcProperties = vcProperties;
                    this._vcParameters = vcParameters;
                    this._modelName = modelName;
                    this._modelClass = modelCls;
                    return this;
                };
                RegisterViewData.prototype.getViewName = function () { return this._viewName; };
                RegisterViewData.prototype.getViewClass = function () { return this._viewClass; };
                RegisterViewData.prototype.getVcClass = function () { return this._vcClass; };
                RegisterViewData.prototype.getVcProperties = function () { return this._vcProperties; };
                RegisterViewData.prototype.getVcParameters = function () { return this._vcParameters; };
                RegisterViewData.prototype.getModelName = function () { return this._modelName; };
                RegisterViewData.prototype.getModelClass = function () { return this._modelClass; };
                RegisterViewData.prototype.getModelData = function () { return this._modelData; };
                return RegisterViewData;
            }());
            gt.RegisterViewData = RegisterViewData;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var RemoveViewData = (function () {
                function RemoveViewData() {
                }
                RemoveViewData.prototype.setVid = function (value) { this._vid = value; return this; };
                RemoveViewData.prototype.getVid = function () { return this._vid; };
                RemoveViewData.prototype.setMid = function (value) { this._mid = value; return this; };
                RemoveViewData.prototype.getMid = function () { return this._mid; };
                return RemoveViewData;
            }());
            gt.RemoveViewData = RemoveViewData;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var LayoutView = (function (_super) {
                __extends(LayoutView, _super);
                function LayoutView(name, viewComponent) {
                    _super.call(this, name, viewComponent);
                }
                LayoutView.prototype.vc = function () { return this.viewComponent; };
                LayoutView.prototype.onRegister = function () {
                };
                LayoutView.prototype.onRemove = function () {
                };
                return LayoutView;
            }(zane.mvc.View));
            gt.LayoutView = LayoutView;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
var zane;
(function (zane) {
    var web;
    (function (web) {
        var gt;
        (function (gt) {
            var Layout = zane.web.component.Layout;
            var LayoutOptions = zane.web.component.LayoutOptions;
            var LayoutVc = (function () {
                function LayoutVc() {
                    var layoutOptions = new LayoutOptions();
                    layoutOptions.content = Layout.CONTENT_TOP | Layout.CONTENT_LEFT |
                        Layout.CONTENT_RIGHT | Layout.CONTENT_CENTER | Layout.CONTENT_CENTER_BOTTOM | Layout.CONTENT_BOTTOM;
                    this.layoutComp = new Layout(layoutOptions);
                    document.body.appendChild(this.layoutComp.element);
                }
                return LayoutVc;
            }());
            gt.LayoutVc = LayoutVc;
        })(gt = web.gt || (web.gt = {}));
    })(web = zane.web || (zane.web = {}));
})(zane || (zane = {}));
//# sourceMappingURL=zane.web.gt.js.map