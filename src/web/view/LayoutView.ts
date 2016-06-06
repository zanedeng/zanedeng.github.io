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
            var vc = this.vc();
            vc.layoutComp.setParent(document.body);

            this.sendEvent(Command.REGISTER_VIEW, new RegisterViewData().setData(
                ViewName.TOP_MENU_BAR,
                TopMenuBarView,
                TopMenuBarVc
            ));
        }

        public onRemove():void
        {

        }
    }
}