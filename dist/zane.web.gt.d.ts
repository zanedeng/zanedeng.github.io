/// <reference path="../libs/zane.mvc.d.ts" />
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
