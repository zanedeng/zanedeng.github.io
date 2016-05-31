/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * @class zane.web.gt.RemoveViewController
     */
    export class RemoveViewController extends mvc.Controller
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
            if (data.getVid() && this.retrieveView(data.getVid()))
            {
                this.removeView(data.getVid());

                if (data.getMid() && this.retrieveModel(data.getMid()))
                {
                    this.removeModel(data.getMid());
                }
            }
        }
    }
}