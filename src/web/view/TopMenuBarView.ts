/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * @class zane.web.gt.TopMenuBarView
     */
    export class TopMenuBarView extends mvc.View
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

        public onRegister():void
        {
            this.sendEvent(Command.REGISTER_VIEW, new RegisterViewData().setData(
                ViewName.LAYOUT,
                LayoutView,
                LayoutVc
            ));
        }

        public onRemove():void
        {

        }
    }
}