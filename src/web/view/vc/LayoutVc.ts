/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    import Layout = zane.web.component.Layout;
    import LayoutOptions = zane.web.component.LayoutOptions;
    /**
     * @class zane.web.gt.LayoutVc
     */
    export class LayoutVc
    {
        /**
         * 布局组件
         * @type {zane.web.component.Layout}
         */
        public layoutComp:Layout;

        constructor()
        {
            var layoutOptions = new LayoutOptions();
            layoutOptions.bottomHeight = 35;
            layoutOptions.allowTopResize = false;
            layoutOptions.allowBottomResize = false;
            layoutOptions.content = Layout.CONTENT_TOP|Layout.CONTENT_LEFT|
                Layout.CONTENT_RIGHT|Layout.CONTENT_CENTER|Layout.CONTENT_CENTER_BOTTOM|Layout.CONTENT_BOTTOM;
            this.layoutComp = new Layout(document.body, layoutOptions);

            this.layoutComp.setLeftCollapse(true);
        }
    }
}