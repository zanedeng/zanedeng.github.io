/**
 * @module zane.web.gt
 */
module zane.web.gt
{
    /**
     * @class zane.web.gt.RemoveViewData
     */
    export class RemoveViewData
    {
        /**
         *
         */
        private _vid:string;

        /**
         *
         */
        private _mid:string;

        /**
         * 构造函数
         */
        constructor()
        {

        }

        /**
         * 设置需要注销的视图名称
         * @param value
         * @returns {zane.web.gt.RemoveViewData}
         */
        public setVid(value:string):RemoveViewData { this._vid = value; return this; }

        /**
         * 获取需要注销的视图名称
         * @returns {string}
         */
        public getVid():string { return this._vid; }

        /**
         * 设置需要注销的视图的数据模型名称
         * @param value
         * @returns {zane.web.gt.RemoveViewData}
         */
        public setMid(value:string):RemoveViewData { this._mid = value; return this; }

        /**
         * 获取需要注销的视图的数据模型名称
         * @returns {string}
         */
        public getMid():string { return this._mid; }
    }
}