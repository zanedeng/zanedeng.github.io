/**
 * @module zane.web.component
 */
module zane.web.component
{
    /**
     * @class Component
     */
    export class Component
    {
        // +----------------------------------------------------------------------
        // | private static property
        // +----------------------------------------------------------------------
        /**
         * 组件自增ID
         * @type {number}
         * @private
         */
        private static __uid:number = 1000;

        /**
         *
         * @type {*}
         * @private
         */
        private static __instances:any = {};

        // +----------------------------------------------------------------------
        // | public static method
        // +----------------------------------------------------------------------

        /**
         * 添加一个实例对象
         * @param item
         */
        public static addInstance(item:Component):void
        {
            if (!item.id) item.id = Component.generateId();
            Component.__instances[item.id] = item;
        }

        /**
         * 移除一个实例对象
         * @param item
         */
        public static removeInstance(item:any):boolean
        {
            if (typeof item == "string" || typeof item == "number")
            {
                delete Component.__instances[item];
                return true;
            }
            else if (typeof item == "object")
            {
                if (item.hasOwnProperty("id"))
                {
                    delete Component.__instances[item.id];
                    return true;
                }
            }
            return false;
        }

        /**
         * 获取指定索引id的实例对象
         * @param id
         * @returns {Component}
         */
        public static getInstance(id:string):Component
        {
            return Component.__instances[id];
        }

        /**
         * 获取所有实例对象
         * @returns {Array<Component>}
         */
        public static getAllInstance():Array<Component>
        {
            return Component.__instances;
        }

        /**
         * 生成组件ID
         */
        public static generateId(prev:string = null):string
        {
            prev = prev || "ui";
            return prev + (Component.__uid++);
        }


        // +----------------------------------------------------------------------
        // | public property
        // +----------------------------------------------------------------------

        /**
         *
         */
        public id:string;

        /**
         * HTMLElement 对象
         */
        public element:HTMLElement;

        /**
         * 事件容器
         * @type {*}
         */
        public events:any = {};

        /**
         * 配置参数
         * @type {*}
         */
        public options:any = {};

        /**
         * 子组件缓存池
         * @type {*}
         */
        public children:any = {};


        // +----------------------------------------------------------------------
        // | constructor
        // +----------------------------------------------------------------------
        /**
         * 构造函数
         * @param options
         */
        constructor(options:any = null)
        {
            this.options = options;
            this._init();
            this._preRender();
            this.trigger('render');
            this._render();
            this.trigger('rendered');
            this._rendered();
            Component.addInstance(this);
        }

        // +----------------------------------------------------------------------
        // | public method
        // +----------------------------------------------------------------------
        /**
         * 触发事件
         * @param arg
         * @param data
         * @returns {boolean}
         */
        public trigger(arg:string, data:any = null):boolean
        {
            if (!arg) return false;
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (!event) return false;
            data = data || [];
            if ((data instanceof Array) == false)
            {
                data = [data];
            }
            for (var i = 0; i < event.length; i++)
            {
                var ev = event[i];
                if (ev.handler.apply(ev.context, data) == false)
                    return false;
            }
            return true;
        }

        /**
         * 绑定事件
         * @param {string|Object} arg 绑定要侦听的事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} context 事件处理函数的作用域
         */
        public bind(arg:any, handler:Function, context:any = null):void
        {
            if (typeof arg == 'object')
            {
                for (var p in arg)
                {
                    this.bind(p, arg[p]);
                }
                return;
            }
            if (typeof handler != 'function') return;
            var name = arg.toLowerCase();
            var event = this.events[name] || [];
            context = context || this;
            event.push({ handler: handler, context: context });
            this.events[name] = event;
        }

        /**
         * 解除绑定
         * @param arg
         * @param handler
         */
        public unbind(arg:string, handler:Function):void
        {
            if (!arg)
            {
                this.events = {};
                return;
            }
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (!event || !event.length) return;
            if (!handler)
            {
                delete this.events[name];
            }
            else
            {
                for (var i = 0, l = event.length; i < l; i++)
                {
                    if (event[i].handler == handler)
                    {
                        event.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * 是否绑定事件
         * @param arg
         * @returns {boolean}
         */
        public hasBind(arg:string):boolean
        {
            var name = arg.toLowerCase();
            var event = this.events[name];
            if (event && event.length) return true;
            return false;
        }

        /**
         * 销毁
         */
        public destroy():void
        {
            Component.removeInstance(this);
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

        }

        /**
         * 渲染前处理
         * @private
         */
        protected _preRender():void
        {

        }

        /**
         * 开始渲染视图
         * @private
         */
        protected _render():void
        {

        }

        /**
         * 渲染后处理
         * @private
         */
        protected _rendered():void
        {

        }
    }
}