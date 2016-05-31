/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * @class zane.web.gt.RegisterViewData
     */
    export class RegisterViewData
    {
        /**
         *
         * @type {string}
         * @private
         */
        private _viewName:string;

        /**
         *
         * @type {zane.mvc.IViewClass}
         * @private
         */
        private _viewClass:zane.mvc.IViewClass;

        /**
         *
         * @type {*}
         * @private
         */
        private _vcClass:any;

        /**
         *
         * @type {*}
         * @private
         */
        private _vcProperties:any;

        /**
         *
         * @type {Array}
         * @private
         */
        private _vcParameters:Array<any>;

        /**
         *
         * @type {string}
         * @private
         */
        private _modelName:string;

        /**
         *
         * @type {zane.mvc.IModelClass}
         * @private
         */
        private _modelClass:zane.mvc.IModelClass;

        /**
         *
         * @type {*}
         * @private
         */
        private _modelData:any;

        /**
         * 构造函数
         */
        constructor()
        {

        }

        /**
         *
         * @param name
         * @param cls
         * @param vcCls
         * @param vcProperties
         * @param vcParameters
         * @param modelName
         * @param modelCls
         * @returns {zane.web.gt.RegisterViewData}
         */
        public setData(name:string, cls:zane.mvc.IViewClass,
                       vcCls:any, vcProperties:Object = null, vcParameters:Array<any> = null,
                       modelName:string = null, modelCls:any = null):RegisterViewData
        {
            this._viewName = name;
            this._viewClass = cls;
            this._vcClass = vcCls;
            this._vcProperties = vcProperties;
            this._vcParameters = vcParameters;
            this._modelName = modelName;
            this._modelClass = modelCls;
            return this;
        }

        /**
         * 获取视图名称
         * @returns {string}
         */
        public getViewName():string { return this._viewName; }

        /**
         * 获取视图类
         * @returns {zane.mvc.IViewClass}
         */
        public getViewClass():zane.mvc.IViewClass { return this._viewClass; }

        /**
         * 获取视图组件类
         * @returns {*}
         */
        public getVcClass():any { return this._vcClass; }

        /**
         * 获取视图组件初始属性值
         * @returns {*}
         */
        public getVcProperties():any { return this._vcProperties; }

        /**
         * 获取视图组件实例化时的参数
         * @returns {Array}
         */
        public getVcParameters():any { return this._vcParameters; }

        /**
         * 获取该视图的数据模型名称
         * @returns {string}
         */
        public getModelName():string { return this._modelName; }

        /**
         * 获取该视图的数据模型类
         * @returns {zane.mvc.IModelClass}
         */
        public getModelClass():zane.mvc.IModelClass { return this._modelClass; }

        /**
         * 获取该视图的数据模型初始数据
         * @returns {*}
         */
        public getModelData():any { return this._modelData; }
    }
}