declare module zane.mvc {
    interface IControllerClass {
        new (cmd: string): Controller;
    }
}
declare module zane.mvc {
    class Controller {
        static controllerList: Controller[];
        private static hasController(cmd);
        private static removeController(cmd);
        static notifyControllers(cmd: string, data?: any, sponsor?: any): void;
        cmd: string;
        constructor(cmd: string);
        onRegister(): void;
        onRemove(): void;
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
declare module zane.mvc {
    interface IModelClass {
        new (name: string, data?: any): Model;
    }
}
declare module zane.mvc {
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
declare module zane.mvc {
    interface IViewClass {
        new (name: string, viewComponent: Object): View;
    }
}
declare module zane.mvc {
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
declare module zane.mvc {
    class MVCApp {
        constructor();
        registerController(cmd: string, controllClass: IControllerClass): void;
        registerModel(name: string, modelClass: IModelClass, data?: any): void;
        registerView(name: string, viewClass: IViewClass, viewComponent: any): void;
    }
}
