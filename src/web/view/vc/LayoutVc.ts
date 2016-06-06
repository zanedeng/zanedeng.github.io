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

        public menuBar:MenuBar;

        constructor()
        {
            var layoutOptions = new LayoutOptions();
            layoutOptions.topHeight = 25;
            layoutOptions.bottomHeight = 35;
            layoutOptions.allowTopResize = false;
            layoutOptions.allowBottomResize = false;
            layoutOptions.content = Layout.CONTENT_TOP|Layout.CONTENT_LEFT|
                Layout.CONTENT_RIGHT|Layout.CONTENT_CENTER|Layout.CONTENT_CENTER_BOTTOM|Layout.CONTENT_BOTTOM;
            this.layoutComp = new Layout(document.body, layoutOptions);

            function itemclick(item)
            {
                alert(item.text);
            }

            var menuOptions1 = new MenuOptions();
            menuOptions1.width = 150;
            menuOptions1.shadow = true;
            menuOptions1.menuData = [
                { text: '保存', click: itemclick },
                { text: '列存为', click: itemclick },
                { line: true },
                { text: '关闭', click: itemclick }
            ];

            var menuOptions2 = new MenuOptions();
            menuOptions2.width = 150;
            menuOptions2.shadow = true;
            menuOptions2.menuData = [
                {
                    text: '文件', children:
                    [
                        { text: 'Excel', click: itemclick },
                        { text: 'Word', click: itemclick },
                        { text: 'PDF', click: itemclick },
                        { text: 'TXT', click: itemclick },
                        { line: true },
                        { text: 'XML', click: itemclick }
                    ]
                },
            ];


            var menuBarOptions = new MenuBarOptions();
            menuBarOptions.menuBarData = [
                { text: '文件', menu: menuOptions1 },
                { text: '导出', menu: menuOptions2 }
            ];

            this.menuBar = new MenuBar(this.layoutComp.topContentElement, menuBarOptions);

        }
    }
}