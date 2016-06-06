/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    import MenuOptions = zane.web.component.MenuOptions;
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

        /**
         * 获取视图组件
         * @returns {TopMenuBarVc}
         */
        public vc():TopMenuBarVc { return <TopMenuBarVc>this.viewComponent; }


        public onRegister():void
        {
            var vc = this.vc();

            var fileMenuOptions = new MenuOptions();
            fileMenuOptions.width = 150;
            fileMenuOptions.shadow = true;
            fileMenuOptions.menuData = [
                { text: '保存',  command:"", click: this.menuItemClick },
                { text: '列存为', command:"", click: this.menuItemClick },
                { line: true },
                { text: '关闭', command:"", click: this.menuItemClick }
            ];

            vc.menuBarComp.addItem({text:"文件", menu:fileMenuOptions});

        }

        public onRemove():void
        {

        }

        private menuItemClick(menuItemData:any):void
        {
            
        }
    }
}