/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * @class zane.web.gt.LayoutView
     */
    export class LayoutView extends mvc.View
    {
        /**
         *
         * @param name
         * @param viewComponent
         */
        constructor(name:string, viewComponent:any)
        {
            super(name, viewComponent);
        }

        /**
         * 获取视图组件
         * @returns {LayoutVc}
         */
        public vc():LayoutVc { return <LayoutVc>this.viewComponent; }


        public onRegister():void
        {
            
        }

        public onRemove():void
        {

        }
    }
}