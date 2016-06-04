/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * 菜单组件
     * @class zane.web.component.MenuBar
     */
    export class MenuBar extends Component
    {
        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------

        /**
         * 构造函数
         * @param parent
         * @param options
         */
        constructor(parent:HTMLElement, options:any = null)
        {
            super(parent, options);
        }

        // +----------------------------------------------------------------------
        // | protected method
        // +----------------------------------------------------------------------

        /**
         * 初始化
         * @private
         */
        protected _init():void
        {
            if (!this.options) this.options = new LayoutOptions();
        }

        /**
         * 渲染视图组件
         * @private
         */
        protected _render():void
        {

        }
    }
}