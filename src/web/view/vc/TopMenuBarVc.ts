/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    import MenuBar = zane.web.component.MenuBar;
    import MenuBarOptions = zane.web.component.MenuBarOptions;
    import MenuOptions = zane.web.component.MenuOptions;

    /**
     * @class zane.web.gt.TopMenuBarVc
     */
    export class TopMenuBarVc
    {

        public menuBarComp:MenuBar;

        constructor()
        {
            // var menuOptions1 = new MenuOptions();
            // menuOptions1.width = 150;
            // menuOptions1.shadow = true;
            // menuOptions1.menuData = [
            //     { text: '保存', click: itemclick },
            //     { text: '列存为', click: itemclick },
            //     { line: true },
            //     { text: '关闭', click: itemclick }
            // ];
            //
            // var menuOptions2 = new MenuOptions();
            // menuOptions2.width = 150;
            // menuOptions2.shadow = true;
            // menuOptions2.menuData = [
            //     {
            //         text: '文件', children:
            //         [
            //             { text: 'Excel', click: itemclick },
            //             { text: 'Word', click: itemclick },
            //             { text: 'PDF', click: itemclick },
            //             { text: 'TXT', click: itemclick },
            //             { line: true },
            //             { text: 'XML', click: itemclick }
            //         ]
            //     },
            // ];


            // var menuBarOptions = new MenuBarOptions();
            // menuBarOptions.menuBarData = [
            //     { text: '文件', menu: menuOptions1 },
            //     { text: '导出', menu: menuOptions2 }
            // ];

            this.menuBarComp = new MenuBar();
        }
    }
}