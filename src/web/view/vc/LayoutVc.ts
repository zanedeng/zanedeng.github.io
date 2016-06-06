/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    import Layout = zane.web.component.Layout;
    import LayoutOptions = zane.web.component.LayoutOptions;
    import MenuBar = zane.web.component.MenuBar;
    import MenuBarOptions = zane.web.component.MenuBarOptions;
    import MenuOptions = zane.web.component.MenuOptions;
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
            layoutOptions.topHeight = 25;
            layoutOptions.bottomHeight = 35;
            layoutOptions.allowTopResize = false;
            layoutOptions.allowBottomResize = false;
            layoutOptions.content = Layout.CONTENT_TOP|Layout.CONTENT_LEFT|
                Layout.CONTENT_RIGHT|Layout.CONTENT_CENTER|Layout.CONTENT_CENTER_BOTTOM|Layout.CONTENT_BOTTOM;
            this.layoutComp = new Layout(layoutOptions);
        }
    }
}