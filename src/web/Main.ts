///<reference path="../../libs/zane.mvc.d.ts" />
///<reference path="constants/Command.ts" />
///<reference path="constants/ModelName.ts" />
///<reference path="constants/ViewName.ts" />
///<reference path="controller/LoadAssetController.ts" />
///<reference path="controller/RegisterViewController.ts" />
///<reference path="controller/RemoveViewController.ts" />
///<reference path="model/MainModel.ts" />
///<reference path="view/MainView.ts" />

/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * 入口类
     * @class zane.web.gt.Main
     */
    export class Main extends mvc.MVCApp
    {
        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------
        /**
         * 构造
         */
        constructor()
        {
            super();
            this.startup();
        }


        // +----------------------------------------------------------------------
        // | private method
        // +----------------------------------------------------------------------

        /**
         * 启动
         */
        private startup():void
        {
            // +----------------------------------------------------------------------
            // | 注册控制器
            // +----------------------------------------------------------------------
            this.registerController(Command.LOAD_ASSET, LoadAssetController);
            this.registerController(Command.REGISTER_VIEW, RegisterViewController);
            this.registerController(Command.REMOVE_VIEW, RemoveViewController);

            // +----------------------------------------------------------------------
            // | 注册数据模型
            // +----------------------------------------------------------------------
            this.registerModel(ModelName.MAIN, MainModel);

            // +----------------------------------------------------------------------
            // | 注册视图
            // +----------------------------------------------------------------------
            this.registerView(ViewName.MAIN, MainView, this);
        }
    }
}