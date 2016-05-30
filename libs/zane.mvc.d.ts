/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
declare module zane {
    /**
     * @class ss2d.mvc.IControllerClass
     */
    interface IControllerClass {
        new (cmd: string): Controller;
    }
}
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
declare module zane {
    /**
     * @class zane.Controller
     */
    class Controller {
        static controllerList: Controller[];
        private static hasController(cmd);
        private static removeController(cmd);
        static notifyControllers(cmd: string, data?: any, sponsor?: any): void;
        cmd: string;
        constructor(cmd: string);
        /**
         * 注册附加操作，需在子类中覆盖使用
         */
        onRegister(): void;
        /**
         * 注销附加操作，需在子类中覆盖使用
         */
        onRemove(): void;
        /**
         * 执行Controller逻辑处理，需在子类中覆盖使用
         */
        execute(data?: any, sponsor?: any): void;
        sendEvent(cmd: string, data?: any, strict?: boolean): void;
        registerView(name: string, viewClass: IViewClass, viewComponent: Object): void;
        retrieveView(name: string): View;
        removeView(name: string): void;
        registerController(cmd: string, controllClass: IControllerClass): void;
        removeController(cmd: string): void;
        registerModel(name: string, modelClass: IModelClass, data?: any): void;
        retrieveModel(name: string): Model;
        removeModel(name: string): void;
    }
}
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
declare module zane {
    /**
     * @class zane.IModelClass
     */
    interface IModelClass {
        new (name: string, data?: any): Model;
    }
}
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
declare module zane {
    /**
     * @class zane.Model
     */
    class Model {
        static modelList: Model[];
        static retrieveModel(name: string): Model;
        static removeModel(name: string): void;
        name: string;
        data: Object;
        constructor(name: string, data?: Object);
        onRegister(): void;
        onRemove(): void;
        sendEvent(type: string, data?: any): void;
    }
}
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
declare module zane {
    /**
     * @class zane.IViewClass
     */
    interface IViewClass {
        new (name: string, viewComponent: Object): View;
    }
}
/**
 * Created by zane.deng on 2014/9/21.
 * @module zane
 */
declare module zane {
    /**
     * @class zane.View
     */
    class View {
        static viewList: View[];
        static retrieveView(name: string): View;
        static removeView(name: string): void;
        static removeViews(...argArray: string[]): void;
        static removeAllView(...exception: string[]): void;
        static notifyViews(type: string, data?: any, sponsor?: any): void;
        name: string;
        viewComponent: any;
        eventList: string[];
        constructor(name: string, viewComponent: any);
        onRegister(): void;
        onRemove(): void;
        listEventInterests(): string[];
        handleEvent(type: string, data?: any, sponsor?: any): void;
        sendEvent(type: string, data?: any, strict?: boolean): void;
        registerView(name: string, viewClass: IViewClass, viewComponent: Object): void;
        retrieveView(name: string): View;
        retrieveModel(name: string): Model;
    }
}
/**
 * Created by zane.deng on 2014/9/22.
 * @module zane
 */
declare module zane {
    /**
     * @class ss2d.mvc.MVCApp
     */
    class MVCApp {
        constructor();
        /**
         * 注册控制器
         * @param controllClass 控制器类
         * @param cmd 控制器触发类型
         */
        registerController(cmd: string, controllClass: IControllerClass): void;
        /**
         * 注册数据模型管理器
         * @param name 数据模型管理器名称
         * @param modelClass 数据模型管理器类
         * @param data 数据模型管理器的初始化数据
         */
        registerModel(name: string, modelClass: IModelClass, data?: any): void;
        /**
         * 注册视图管理器
         * @param name 视图管理器名称
         * @param viewClass 视图管理器类
         * @param viewComponent 视图管理器管理的视图实例
         */
        registerView(name: string, viewClass: IViewClass, viewComponent: any): void;
    }
}
