/// <reference path="../libs/ts/zane.utils.d.ts" />
/// <reference path="../libs/ts/zane.mvc.d.ts" />
/// <reference path="../libs/ts/zane.web.component.d.ts" />
declare module zane.web.gt {
    class Command {
        static LOAD_ASSET: string;
        static REGISTER_VIEW: string;
        static REMOVE_VIEW: string;
    }
}
declare module zane.web.gt {
    class ModelName {
        static MAIN: string;
    }
}
declare module zane.web.gt {
    class ViewName {
        static MAIN: string;
        static LAYOUT: string;
    }
}
declare module zane.web.gt {
    class LoadAssetController extends mvc.Controller {
        constructor(cmd: string);
        execute(data?: any, sponsor?: any): void;
    }
}
declare module zane.web.gt {
    class RegisterViewController extends mvc.Controller {
        constructor(cmd: string);
        execute(data?: any, sponsor?: any): void;
    }
}
declare module zane.web.gt {
    class RemoveViewController extends mvc.Controller {
        constructor(cmd: string);
        execute(data?: any, sponsor?: any): void;
    }
}
declare module zane.web.gt {
    class MainModel extends mvc.Model {
        constructor(name: string, data?: Object);
    }
}
declare module zane.web.gt {
    class MainView extends mvc.View {
        constructor(name: string, viewComponent: any);
        onRegister(): void;
        onRemove(): void;
    }
}
declare module zane.web.gt {
    class Main extends mvc.MVCApp {
        constructor();
        private startup();
    }
}
declare module zane.web.gt {
    class RegisterViewData {
        private _viewName;
        private _viewClass;
        private _vcClass;
        private _vcProperties;
        private _vcParameters;
        private _modelName;
        private _modelClass;
        private _modelData;
        constructor();
        setData(name: string, cls: zane.mvc.IViewClass, vcCls: any, vcProperties?: Object, vcParameters?: Array<any>, modelName?: string, modelCls?: any): RegisterViewData;
        getViewName(): string;
        getViewClass(): zane.mvc.IViewClass;
        getVcClass(): any;
        getVcProperties(): any;
        getVcParameters(): any;
        getModelName(): string;
        getModelClass(): zane.mvc.IModelClass;
        getModelData(): any;
    }
}
declare module zane.web.gt {
    class RemoveViewData {
        private _vid;
        private _mid;
        constructor();
        setVid(value: string): RemoveViewData;
        getVid(): string;
        setMid(value: string): RemoveViewData;
        getMid(): string;
    }
}
declare module zane.web.gt {
    class LayoutView extends mvc.View {
        constructor(name: string, viewComponent: any);
        vc(): LayoutVc;
        onRegister(): void;
        onRemove(): void;
    }
}
declare module zane.web.gt {
    import Layout = zane.web.component.Layout;
    class LayoutVc {
        layoutComp: Layout;
        constructor();
    }
}
