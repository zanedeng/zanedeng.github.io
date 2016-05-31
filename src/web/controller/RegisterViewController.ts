/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * 注册视图类
     * @class zane.web.gt.RegisterViewController
     */
    export class RegisterViewController extends mvc.Controller
    {
        /**
         * 构造函数
         * @param cmd
         */
        constructor(cmd:string)
        {
            super(cmd);
        }

        /**
         *
         * @param data
         * @param sponsor
         */
        public execute(data:any = null, sponsor:any = null) : void
        {
            var viewClass    = data.getViewClass();
            var viewName     = data.getViewName();
            var vcClass      = data.getVcClass();
            var vcProperties = data.getVcProperties();
            var vcParameters = data.getVcParameters();
            var modelName    = data.getModelName();
            var modelClass   = data.getModelClass();
            var modelData    = data.getModelData();

            if (!viewClass) throw new Error("注册视图管理类不能为空！");
            if (!vcClass) throw new Error("注册视图类不能为空！");

            if (viewName && this.retrieveView(viewName)) this.removeView(viewName);
            if (modelName && modelClass) this.registerModel(modelName, modelClass, modelData);
            var vc = zane.createInstance(vcClass, vcProperties, vcParameters);
            this.registerView(viewName, viewClass, vc);
        }
    }
}