/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * @class zane.web.component.MenuOptions
     */
    export class MenuOptions
    {
        public id:string;
        /**
         * 定义菜单的宽度
         */
        public width:number = 150;

        /**
         * 定义菜单显示的横坐标
         * @type {number}
         */
        public x:number = 0;

        /**
         * 定义菜单显示的纵坐标
         * @type {number}
         */
        public y:number = 0;

        /**
         * 自定义样式
         * @type {string}
         */
        public customClass:string = null;

        /**
         * 是否添加阴影
         * @type {boolean}
         */
        public shadow:boolean = true;

        /**
         * 菜单数据
         * @type {Array}
         */
        public menuData:Array<any> = null;

    }
}