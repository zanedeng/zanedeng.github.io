/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    import Layout = zane.web.component.Layout;
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
            var layoutElement:HTMLElement = document.createElement("div");
            layoutElement.innerHTML = "" +
                "<div position=\"left\"></div>" +
                "<div position=\"center\" title=\"标题\"></div>" +
                "<div position=\"right\"></div>" +
                "<div position=\"top\"></div>" +
                "<div position=\"bottom\"></div>";
            document.body.appendChild(layoutElement);

            this.layoutComp = new Layout(layoutElement);
        }
    }
}