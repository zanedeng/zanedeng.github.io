/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * 菜单组件
     * @class zane.web.component.Tree
     */
    export class Tree extends Component
    {
        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------

        /**
         * 构造函数
         * @param parent
         * @param options
         */
        constructor(options:any = null, parent:HTMLElement = null)
        {
            super(options, parent);
            if (this.options.single) this.options.autoCheckboxEven = false;
        }
    }
}