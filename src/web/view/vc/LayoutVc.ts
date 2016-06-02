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
            layoutOptions.content = Layout.CONTENT_TOP|Layout.CONTENT_LEFT|
                Layout.CONTENT_RIGHT|Layout.CONTENT_BOTTOM;
            console.log(layoutOptions.content.toString(16));
            this.layoutComp = new Layout(document.body, layoutOptions);
        }
    }
}