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

        /**
         * 获取布局视图管理器
         * @returns {LayoutView}
         */
        public layoutView():LayoutView
        {
            return <LayoutView>this.retrieveView(ViewName.LAYOUT);
        }

        public onRegister():void
        {
            var vc = this.vc();
            var layoutVc = this.layoutView().vc();
            vc.menuBarComp.setParent(layoutVc.layoutComp.topContentElement);

            this.addProjectMenuItem();
            this.addFileMenuItem();
            this.addEditMenuItem();
        }

        public onRemove():void
        {
            
        }


        private addProjectMenuItem():void
        {
            var vc = this.vc();
            var projectMenuOptions = new MenuOptions();
            projectMenuOptions.width = 150;
            projectMenuOptions.shadow = true;
            projectMenuOptions.menuData = [
                { text: '新建项目',  command:"newProject", click: this.menuItemClick },
                { text: '重命名项目', command:"renameProject", click: this.menuItemClick },
                { line: true },
                {
                    text: '保存项目',
                    children:[
                        { text: '保存到 Dropbox', command:"saveAtDropbox", click: this.menuItemClick },
                        { text: '保存到 Github', command:"saveAtGithub", click: this.menuItemClick },
                        { text: '保存到 Google Drive', command:"saveAtGoogleDrive", click: this.menuItemClick },
                        { text: '保存到 OneDrive', command:"saveAtOneDrive", click: this.menuItemClick },
                    ]
                },
                {
                    text: '导入项目',
                    childre:[
                        { text: '从 Dropbox 导入', command:"importFromDropbox", click: this.menuItemClick },
                        { text: '从 Github 导入', command:"importFromGithub", click: this.menuItemClick },
                        { text: '从 Google Drive 导入', command:"importFromGoogleDrive", click: this.menuItemClick },
                        { text: '从 OneDrive 导入', command:"importFromOneDrive", click: this.menuItemClick },
                    ]
                },
                {
                    text: '删除项目',
                    childre:[
                        { text: '从 Dropbox 删除', command:"deleteFromDropbox", click: this.menuItemClick },
                        { text: '从 Github 删除', command:"deleteFromGithub", click: this.menuItemClick },
                        { text: '从 Google Drive 删除', command:"deleteFromGoogleDrive", click: this.menuItemClick },
                        { text: '从 OneDrive 删除', command:"deleteFromOneDrive", click: this.menuItemClick },
                    ]
                },
                { line: true },
                { text: '分享项目', command:"shareProject", click: this.menuItemClick },
            ];

            vc.menuBarComp.addItem({text:"项目", menu:projectMenuOptions});
        }

        private addFileMenuItem():void
        {
            var vc = this.vc();
            var fileMenuOptions = new MenuOptions();
            fileMenuOptions.width = 150;
            fileMenuOptions.shadow = true;
            fileMenuOptions.menuData = [
                { text: '新建文件',  command:"createFile", click: this.menuItemClick },
                { text: '保存所有文件', command:"saveFiles", click: this.menuItemClick },
                { text: '删除文件', command:"deleteFile", click: this.menuItemClick },
                { text: '重命名文件', command:"renameFile", click: this.menuItemClick },
                { text: '下载文件', command:"downloadFile", click: this.menuItemClick },
                { text: '上传文件', command:"uploadFile", click: this.menuItemClick },
                { line: true },
                { text: '新建文件夹', command:"newDirectory", click: this.menuItemClick },
                { text: '删除文件夹', command:"deleteDirectory", click: this.menuItemClick },
                { text: '重命名文件夹', command:"renameDirectory", click: this.menuItemClick },
            ];

            vc.menuBarComp.addItem({text:"文件", menu:fileMenuOptions});
        }

        private addEditMenuItem():void
        {
            var vc = this.vc();
            var editMenuOptions = new MenuOptions();
            editMenuOptions.width = 150;
            editMenuOptions.shadow = true;
            editMenuOptions.menuData = [
                { text: '撤销',  command:"undo", click: this.menuItemClick },
                { text: '重做', command:"redo", click: this.menuItemClick },
                { line: true },
                { text: '剪切', command:"cut", click: this.menuItemClick },
                { text: '拷贝', command:"copy", click: this.menuItemClick },
                { text: '粘贴', command:"paste", click: this.menuItemClick },
                { text: '删除', command:"delete", click: this.menuItemClick },
                { text: '全选', command:"selectAll", click: this.menuItemClick },
                { line: true },
                { text: '查找', command:"find", click: this.menuItemClick },
                { text: '查找和替换', command:"findAndReplace", click: this.menuItemClick },
            ];

            vc.menuBarComp.addItem({text:"编辑", menu:editMenuOptions});
        }

        private menuItemClick(menuItemData:any):void
        {

        }
    }
}