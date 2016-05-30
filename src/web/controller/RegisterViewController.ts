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

        }
    }
}