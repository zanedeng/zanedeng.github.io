/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    import Layout = zane.web.component.Layout;
    import LayoutOptions = zane.web.component.LayoutOptions;
    import Menu = zane.web.component.Menu;
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

        public menu:Menu;

        constructor()
        {
            var layoutOptions = new LayoutOptions();
            layoutOptions.bottomHeight = 35;
            layoutOptions.allowTopResize = false;
            layoutOptions.allowBottomResize = false;
            layoutOptions.content = Layout.CONTENT_TOP|Layout.CONTENT_LEFT|
                Layout.CONTENT_RIGHT|Layout.CONTENT_CENTER|Layout.CONTENT_CENTER_BOTTOM|Layout.CONTENT_BOTTOM;
            this.layoutComp = new Layout(document.body, layoutOptions);

            var menuOptions = new MenuOptions();
            menuOptions.menuData = [
                { text: '增加', icon:'add' },
                { text: '修改'},
                { line: true },
                { text: '查看', children:
                    [
                        { text: '报表'},
                        { text: '导出', children: [{ text: 'Excel'}, { text: 'Word'}]
                        }
                    ] },
                { text: '关闭'}
            ];

            this.menu = new Menu(document.body, menuOptions);
            var self = this;
            document.addEventListener("contextmenu", function (e) {
                self.menu.show({ top: e.pageY, left: e.pageX });
                return false;
            });

        }
    }
}