/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * @class zane.web.gt.Command
     */
    export class Command
    {
        /**
         * 加载资源
         * @type {string}
         */
        public static LOAD_ASSET:string = "load_asset";

        /**
         * 注册视图
         * @type {string}
         */
        public static REGISTER_VIEW:string = "register_view";

        /**
         * 移除视图
         * @type {string}
         */
        public static REMOVE_VIEW:string = "remove_view";
    }
}