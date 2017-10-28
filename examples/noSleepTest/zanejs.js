var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var BaseObjectPool = (function () {
            function BaseObjectPool() {
            }
            /**
             * 设置对象池的大小
             */
            BaseObjectPool.setMaxCount = function (clazz, maxCount) {
                if (clazz === void 0) { clazz = null; }
                if (maxCount === void 0) { maxCount = -1; }
                if (maxCount < 0) {
                    maxCount = 0;
                }
                if (clazz) {
                    BaseObjectPool.maxCountMap[String(clazz)] = maxCount;
                }
                else {
                    Object.keys(BaseObjectPool.poolsMap).map(function (classType) {
                        BaseObjectPool.maxCountMap[classType] = maxCount;
                    });
                }
            };
            /**
             * 填充对象池，用于程序控制内存的创建
             */
            BaseObjectPool.fullFill = function (clazz, maxCount) {
                if (maxCount === void 0) { maxCount = -1; }
                var classType = String(clazz);
                var pool = BaseObjectPool.poolsMap[classType] =
                    BaseObjectPool.poolsMap[classType] || [];
                if (maxCount < 0) {
                    maxCount = classType in BaseObjectPool.maxCountMap
                        ? BaseObjectPool.maxCountMap[classType]
                        : 0;
                }
                var i = pool.length;
                for (; i < maxCount; i++) {
                    pool.push(new clazz());
                }
            };
            /**
             * 填充对象池，用于程序控制内存的创建
             */
            BaseObjectPool.fullFillAll = function (maxCount) {
                if (maxCount === void 0) { maxCount = -1; }
                Object.keys(BaseObjectPool.poolsMap).map(function (classType) {
                    BaseObjectPool.fullFill(eval(classType), maxCount);
                });
            };
            /**
             * 释放对象池，用于程序控制内存的释放
             */
            BaseObjectPool.release = function (classType, maxCount) {
                if (maxCount === void 0) { maxCount = -1; }
                var pool = BaseObjectPool.poolsMap[classType] =
                    BaseObjectPool.poolsMap[classType] || [];
                if (maxCount < 0) {
                    maxCount = classType in BaseObjectPool.maxCountMap
                        ? BaseObjectPool.maxCountMap[classType]
                        : 0;
                }
                pool.length = maxCount;
            };
            /**
             * 释放对象池，用于程序控制内存的释放
             */
            BaseObjectPool.releaseAll = function (maxCount) {
                if (maxCount === void 0) { maxCount = -1; }
                Object.keys(BaseObjectPool.poolsMap).map(function (classType) {
                    BaseObjectPool.release(classType, maxCount);
                });
            };
            BaseObjectPool.maxCountMap = {};
            return BaseObjectPool;
        }());
        zanejs.BaseObjectPool = BaseObjectPool;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path="BaseObjectPool.ts"/>
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var BaseObject = (function () {
            function BaseObject() {
                this.hashCode = BaseObject.hashCode++;
            }
            /**
             * 创建对象，如果pool有就从pool里取
             * @param {T} clazz
             * @returns {T}
             */
            BaseObject.create = function (clazz) {
                var pool = BaseObject.poolsMap[String(clazz)];
                return (pool && pool.length > 0) ? pool.pop() : new clazz();
            };
            /**
             * 回收对象，安全起见，不要直接调用，必须由对象自身的dispose调用
             * @param {common.BaseObject} object
             */
            BaseObject.recycle = function (object) {
                var classType = String(object.constructor);
                var pool = BaseObject.poolsMap[classType] = BaseObject.poolsMap[classType] || [];
                console.assert(pool.indexOf(object) < 0);
                pool.push(object);
            };
            /**
             * 清除数据并返还对象池。
             */
            BaseObject.prototype.dispose = function () {
                this.onDispose();
                BaseObject.recycle(this);
            };
            BaseObject.prototype.onDispose = function () {
                // todo
            };
            BaseObject.hashCode = 0;
            BaseObject.poolsMap = zanejs.BaseObjectPool.poolsMap = {};
            return BaseObject;
        }());
        zanejs.BaseObject = BaseObject;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class com.zanejs.Event
         */
        var Event = (function () {
            /**
             *
             * @param type
             * @param data
             */
            function Event(type, data) {
                if (data === void 0) { data = null; }
                /**
                 *
                 * @type {string}
                 */
                this.type = null;
                /**
                 *
                 * @type {*}
                 */
                this.target = null;
                /**
                 *
                 * @type {*}
                 */
                this.currentTarget = null;
                /**
                 *
                 * @type {*}
                 */
                this.data = null;
                this.type = type;
                this.data = data;
            }
            /**
             *
             * @param type
             * @param data
             * @returns {Event}
             */
            Event.fromPool = function (type, data) {
                if (data === void 0) { data = null; }
                if (Event._eventPool.length) {
                    return Event._eventPool.pop().reset(type, data);
                }
                else {
                    return new Event(type, data);
                }
            };
            /**
             *
             * @param event
             */
            Event.toPool = function (event) {
                event.data = event.target = event.currentTarget = null;
                Event._eventPool[Event._eventPool.length] = event;
            };
            /**
             *
             * @returns {zane.Event}
             */
            Event.prototype.clone = function () {
                return new Event(this.type, this.data);
            };
            /**
             * @param type
             * @param data
             * @returns {zane.Event}
             */
            Event.prototype.reset = function (type, data) {
                if (data === void 0) { data = null; }
                this.type = type;
                this.data = data;
                return this;
            };
            /**
             *
             * @type {string}
             */
            Event.classType = '[class Event]';
            /**
             *
             * @type {string}
             */
            Event.COMPLETE = 'complete';
            /**
             *
             * @type {string}
             */
            Event.INIT = 'init';
            /**
             *
             * @type {string}
             */
            Event.OPEN = 'open';
            /**
             *
             * @type {string}
             */
            Event.ENTER_FRAME = 'enterFrame';
            /**
             *
             * @type {string}
             */
            Event.RESIZE = 'resize';
            /**
             *
             * @type {string}
             */
            Event.ERROR = 'error';
            /**
             *
             * @type {string}
             */
            Event.CHANGE = 'change';
            /**
             *
             * @type {string}
             */
            Event.REMOVE_FROM_JUGGLER = 'removeFromJuggler';
            /**
             *
             * @type {Array}
             * @private
             */
            Event._eventPool = [];
            return Event;
        }());
        zanejs.Event = Event;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path="../core/BaseObject.ts" />
///<reference path="IEventDispatcher.ts"/>
///<reference path="IEventClass.ts"/>
/**
 * @module zane
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var EventDispatcher = (function (_super) {
            __extends(EventDispatcher, _super);
            /**
             * 构造函数
             * @param target
             */
            function EventDispatcher(target) {
                if (target === void 0) { target = null; }
                var _this = _super.call(this) || this;
                /**
                 * 侦听函数缓存池
                 */
                _this._listeners = null;
                return _this;
            }
            /**
             * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。
             * @method addEventListener
             * @param type 事件的类型。
             * @param listener 处理事件的侦听器函数。
             * @param argsArr 处理事件的侦听器函数的参数。
             * @param thisArg 处理事件的侦听器函数的作用域。
             * @public
             */
            EventDispatcher.prototype.addEventListener = function (type, listener, thisArg, argsArr) {
                if (thisArg === void 0) { thisArg = null; }
                if (argsArr === void 0) { argsArr = null; }
                var listenerItem = new ListenerItem(listener, thisArg, argsArr);
                if (!this._listeners) {
                    this._listeners = {};
                }
                if (!this._listeners[type]) {
                    this._listeners[type] = [listenerItem];
                }
                else if (this.getEventListenerIndex(type, listener, thisArg) === -1) {
                    this._listeners[type].push(listenerItem);
                }
            };
            /**
             * 从 EventDispatcher 对象中删除侦听器。
             * 如果没有向 EventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
             * @method removeEventListener
             * @param type 事件的类型。
             * @param listener 要删除的侦听器对象。
             * @param thisArg
             * @public
             */
            EventDispatcher.prototype.removeEventListener = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                if (this._listeners) {
                    var listenerArray = this._listeners[type];
                    if (listenerArray) {
                        var l = listenerArray.length;
                        var remainingListeners = [];
                        for (var i = 0; i < l; ++i) {
                            var listenerItem = listenerArray[i];
                            if (listenerItem.listener !== listener) {
                                remainingListeners.push(listenerItem);
                            }
                            else if (thisArg && thisArg.hashCode !== this.hashCode) {
                                remainingListeners.push(listenerItem);
                            }
                        }
                        this._listeners[type] = remainingListeners;
                    }
                }
            };
            /**
             * 从 EventDispatcher 对象中删除指定事件类型的侦听器。
             * @method removeEventListeners
             * @param type 事件的类型。
             * @public
             */
            EventDispatcher.prototype.removeEventListeners = function (type) {
                if (type === void 0) { type = null; }
                if (type && this._listeners) {
                    delete this._listeners[type];
                }
                else {
                    this._listeners = null;
                }
            };
            /**
             * 优化将事件调度到事件流中的过程。如果大量重复调度事件时，用这个函数就避免了重复的去创建事件实例。
             * @method dispatchPooledEvent
             * @param eventClass 需要调度的事件类
             * @param eventType 调度到事件流中的事件类型。
             * @param data 传递的数据。
             * @public
             */
            EventDispatcher.prototype.dispatchPooledEvent = function (eventClass, eventType, data) {
                if (data === void 0) { data = null; }
                var pooledEvent = EventDispatcher._eventPool[eventClass.classType];
                if (!pooledEvent) {
                    EventDispatcher._eventPool[eventClass.classType] = pooledEvent = new eventClass(eventType);
                }
                pooledEvent.reset(eventType, data);
                if (this.hasEventListener(eventType)) {
                    this.dispatchEvent(pooledEvent);
                }
            };
            /**
             *
             * @param type
             * @param data
             */
            EventDispatcher.prototype.dispatchEventWith = function (type, data) {
                if (data === void 0) { data = null; }
                if (this.hasEventListener(type)) {
                    var event_1 = zanejs.Event.fromPool(type, data);
                    this.dispatchEvent(event_1);
                    zanejs.Event.toPool(event_1);
                }
            };
            /**
             * 将事件调度到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
             * @method dispatchEvent
             * @param event
             * @public
             */
            EventDispatcher.prototype.dispatchEvent = function (event) {
                if (this._listeners == null || !(event.type in this._listeners)) {
                    return;
                }
                var listenerArray = this._listeners[event.type];
                if (listenerArray) {
                    event.target = this;
                    var l = listenerArray.length;
                    for (var i = 0; i < l; ++i) {
                        var listenerItem = listenerArray[i];
                        if (listenerItem) {
                            var listener = listenerItem.listener;
                            var argsArr = listenerItem.argsArr ? [event].concat(listenerItem.argsArr) : [event];
                            var thisArg = listenerItem.thisArg;
                            listener.apply(thisArg, argsArr);
                        }
                    }
                }
            };
            /**
             * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。
             * 这样，您就可以确定 EventDispatcher 对象在事件流层次结构中的哪个位置改变了对事件类型的处理。
             * @method hasEventListener
             * @param type 事件的类型。
             * @param listener 处理事件的侦听器函数
             * @param thisArg 侦听器函数的作用域
             * @returns {boolean}  如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
             * @public
             */
            EventDispatcher.prototype.hasEventListener = function (type, listener, thisArg) {
                if (listener === void 0) { listener = null; }
                if (thisArg === void 0) { thisArg = null; }
                return (this.getEventListenerIndex(type, listener, thisArg) !== -1);
            };
            /**
             * 获取指定类型的侦听器的索引位置。
             * @method getEventListenerIndex
             * @param type
             * @param listener
             * @param thisArg
             * @returns {number}
             * @private
             */
            EventDispatcher.prototype.getEventListenerIndex = function (type, listener, thisArg) {
                if (thisArg === void 0) { thisArg = null; }
                if (this._listeners) {
                    var listenerArray = this._listeners[type];
                    if (listenerArray) {
                        var l = listenerArray.length;
                        if (listener == null) {
                            return 0;
                        }
                        for (var i = 0; i < l; ++i) {
                            var listenerItem = listenerArray[i];
                            if (thisArg == null) {
                                if (listener === listenerItem.listener) {
                                    return i;
                                }
                            }
                            else {
                                if (listener === listenerItem.listener &&
                                    thisArg.hashCode === listenerItem.thisArg.hashCode) {
                                    return i;
                                }
                            }
                        }
                    }
                }
                return -1;
            };
            /**
             * 事件对象池
             * @type {Object}
             * @private
             */
            EventDispatcher._eventPool = {};
            return EventDispatcher;
        }(zanejs.BaseObject));
        zanejs.EventDispatcher = EventDispatcher;
        /**
         *
         * @class ListenerItem
         */
        var ListenerItem = (function (_super) {
            __extends(ListenerItem, _super);
            /**
             *
             * @param listener
             * @param thisArg
             * @param argsArr
             */
            function ListenerItem(listener, thisArg, argsArr) {
                if (thisArg === void 0) { thisArg = null; }
                if (argsArr === void 0) { argsArr = null; }
                var _this = _super.call(this) || this;
                /**
                 * 处理事件的侦听器函数的作用域
                 * @type {*}
                 */
                _this.thisArg = null;
                /**
                 * 处理事件的侦听器函数的参数
                 * @type {Array}
                 */
                _this.argsArr = null;
                _this.listener = listener;
                _this.thisArg = thisArg;
                _this.argsArr = argsArr;
                return _this;
            }
            return ListenerItem;
        }(zanejs.BaseObject));
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path='./Event.ts' />
/**
 * @module zane
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class LoaderEvent
         */
        var LoaderEvent = (function (_super) {
            __extends(LoaderEvent, _super);
            /**
             * 构造函数
             * @param type
             * @param data
             */
            function LoaderEvent(type, data) {
                if (data === void 0) { data = null; }
                return _super.call(this, type, data) || this;
            }
            /**
             *
             * @type {string}
             */
            LoaderEvent.classType = '[class LoaderEvent]';
            /**
             *
             * @type {string}
             */
            LoaderEvent.START = 'loader_start';
            /**
             *
             * @type {string}
             */
            LoaderEvent.COMPLETE = 'loader_complete';
            /**
             *
             * @type {string}
             */
            LoaderEvent.PROGRESS = 'loader_progress';
            /**
             *
             * @type {string}
             */
            LoaderEvent.ERROR = 'loader_error';
            return LoaderEvent;
        }(zanejs.Event));
        zanejs.LoaderEvent = LoaderEvent;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path="./Event.ts" />
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class LoaderQueueEvent
         */
        var LoaderQueueEvent = (function (_super) {
            __extends(LoaderQueueEvent, _super);
            /**
             * 构造函数
             * @param type
             * @param data
             */
            function LoaderQueueEvent(type, data) {
                if (data === void 0) { data = null; }
                return _super.call(this, type, data) || this;
            }
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.classType = '[class LoaderQueueEvent]';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.ITEM_START = 'queue_item_start';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.ITEM_COMPLETE = 'queue_item_complete';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.ITEM_PROGRESS = 'queue_item_progress';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.ITEM_ERROR = 'queue_item_error';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.START = 'queue_start';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.COMPLETE = 'queue_complete';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.PROGRESS = 'queue_progress';
            /**
             *
             * @type {string}
             */
            LoaderQueueEvent.ERROR = 'queue_error';
            return LoaderQueueEvent;
        }(zanejs.Event));
        zanejs.LoaderQueueEvent = LoaderQueueEvent;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 在数组中的索引
         * @param arr
         * @param value
         * @returns {number}
         */
        function inArray(value, arr) {
            for (var i = 0, l = arr.length; i < l; ++i) {
                if (arr[i] === value) {
                    return i;
                }
            }
            return -1;
        }
        zanejs.inArray = inArray;
        /**
         * 根据数组中 object 对象的属性值获取该元素在数组中的索引位置
         * @param arr
         * @param attribute
         * @param value
         * @returns {number}
         */
        function indexByObjectValue(arr, attribute, value) {
            for (var i = 0, l = arr.length; i < l; ++i) {
                var o = arr[i];
                if (o[attribute] === value) {
                    return i;
                }
            }
            return -1;
        }
        zanejs.indexByObjectValue = indexByObjectValue;
        /**
         * 将一个数组分割成多个数组，其中每个数组的单元数目由 size 决定。最后一个数组的单元数目可能会少于 size 个。
         *
         * example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2)
         * returns 1: [['Kevin', 'van'], ['Zonneveld']]
         *
         * example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true)
         * returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
         *
         * example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2)
         * returns 3: [['Kevin', 'van'], ['Zonneveld']]
         *
         * example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true)
         * returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]
         * @param input
         * @param size
         * @param preserveKeys
         * @returns {*}
         */
        function array_chunk(input, size, preserveKeys) {
            if (preserveKeys === void 0) { preserveKeys = false; }
            var x;
            var p = '';
            var i = 0;
            var c = -1;
            var l = input.length || 0;
            var n = [];
            if (size < 1) {
                return null;
            }
            if (Object.prototype.toString.call(input) === '[object Array]') {
                if (preserveKeys) {
                    while (i < l) {
                        (x = i % size)
                            ? n[c][i] = input[i]
                            : n[++c] = {};
                        n[c][i] = input[i];
                        i++;
                    }
                }
                else {
                    while (i < l) {
                        (x = i % size)
                            ? n[c][x] = input[i]
                            : n[++c] = [input[i]];
                        i++;
                    }
                }
            }
            else {
                if (preserveKeys) {
                    for (p in input) {
                        if (input.hasOwnProperty(p)) {
                            (x = i % size)
                                ? n[c][p] = input[p]
                                : n[++c] = {};
                            n[c][p] = input[p];
                            i++;
                        }
                    }
                }
                else {
                    for (p in input) {
                        if (input.hasOwnProperty(p)) {
                            (x = i % size)
                                ? n[c][x] = input[p]
                                : n[++c] = [input[p]];
                            i++;
                        }
                    }
                }
            }
            return n;
        }
        zanejs.array_chunk = array_chunk;
        /**
         * 创建一个对象，用一个数组的值作为其键名，另一个数组的值作为其值
         *
         * example 1: array_combine([0,1,2], ['kevin','van','zonneveld'])
         * returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}
         *
         * @param keys
         * @param values
         * @returns {*}
         */
        function array_combine(keys, values) {
            var newArray = {};
            if (typeof keys !== 'object') {
                return false;
            }
            if (typeof values !== 'object') {
                return false;
            }
            if (typeof keys.length !== 'number') {
                return false;
            }
            if (typeof values.length !== 'number') {
                return false;
            }
            if (!keys.length) {
                return false;
            }
            if (keys.length !== values.length) {
                return false;
            }
            for (var i = 0; i < keys.length; i++) {
                newArray[keys[i]] = values[i];
            }
            return newArray;
        }
        zanejs.array_combine = array_combine;
        /**
         * 统计数组中所有的值出现的次数
         *
         * example 1: array_count_values([ 3, 5, 3, "foo", "bar", "foo" ])
         * returns 1: {3:2, 5:1, "foo":2, "bar":1}
         *
         * example 2: array_count_values({ p1: 3, p2: 5, p3: 3, p4: "foo", p5: "bar", p6: "foo" })
         * returns 2: {3:2, 5:1, "foo":2, "bar":1}
         *
         * example 3: array_count_values([ true, 4.2, 42, "fubar" ])
         * returns 3: {42:1, "fubar":1}
         *
         * @param array - 统计这个数组的值
         * @returns {{}} 返回一个数组，该数组用 input 数组中的值作为键名，该值在 input 数组中出现的次数作为值。
         */
        function array_count_values(array) {
            var tmpArr = {};
            var key = '';
            var _getType = function (obj) {
                var _t = typeof obj;
                _t = _t.toLowerCase();
                if (_t === 'object') {
                    _t = 'array';
                }
                return _t;
            };
            var _countValue = function (_tmpArr, value) {
                if (typeof value === 'number') {
                    if (Math.floor(value) !== value) {
                        return;
                    }
                }
                else if (typeof value !== 'string') {
                    return;
                }
                if (value in _tmpArr && _tmpArr.hasOwnProperty(value)) {
                    ++_tmpArr[value];
                }
                else {
                    _tmpArr[value] = 1;
                }
            };
            var t = _getType(array);
            if (t === 'array') {
                for (key in array) {
                    if (array.hasOwnProperty(key)) {
                        _countValue.call(this, tmpArr, array[key]);
                    }
                }
            }
            return tmpArr;
        }
        zanejs.array_count_values = array_count_values;
        /**
         * 计算数组的差集
         *
         * example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld'])
         * returns 1: {0:'Kevin'}
         *
         * @param args
         * @returns {{}}
         */
        function array_diff() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var retArr = {};
            var arr1 = args[0];
            var argLen = args.length;
            var arr = {};
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    for (var i = 1; i < argLen; i++) {
                        arr = args[i];
                        for (var k in arr) {
                            if (arr[k] === arr1[k1]) {
                                arr1keys();
                            }
                        }
                        retArr[k1] = arr1[k1];
                    }
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_diff = array_diff;
        /**
         * 带索引检查计算数组的差集
         *
         * example 1: array_diff_assoc({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'})
         * returns 1: {1: 'van', 2: 'Zonneveld'}
         *
         * @param args
         * @returns {{}}
         */
        function array_diff_assoc() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var retArr = {};
            var arr1 = args[0];
            var argl = args.length;
            var i = 1;
            var k = '';
            var arr = {};
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    for (i = 1; i < argl; i++) {
                        arr = args[i];
                        for (k in arr) {
                            if (arr[k] === arr1[k1] && k === k1) {
                                arr1keys();
                            }
                        }
                        retArr[k1] = arr1[k1];
                    }
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_diff_assoc = array_diff_assoc;
        /**
         * 使用键名比较计算数组的差集
         *
         * example 1: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5})
         * returns 1: {"green":2, "blue":3, "white":4}
         *
         * example 2: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5}, {red: 5})
         * returns 2: {"green":2, "blue":3, "white":4}
         *
         * @param args
         * @returns {{}}
         */
        function array_diff_key() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var arr1 = args[0];
            var argl = args.length;
            var retArr = {};
            var arr = {};
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    for (var i = 1; i < argl; i++) {
                        arr = args[i];
                        for (var k in arr) {
                            if (k === k1) {
                                arr1keys();
                            }
                        }
                        retArr[k1] = arr1[k1];
                    }
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_diff_key = array_diff_key;
        /**
         * 用用户提供的回调函数做索引检查来计算数组的差集
         *
         * example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
         * example 1: let $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
         * example 1: array_diff_uassoc($array1, $array2, function (key1, key2) {
         *      return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1))
         *  })
         * returns 1: {b: 'brown', c: 'blue', 0: 'red'}
         *
         * @param args
         * @returns {{}}
         */
        function array_diff_uassoc() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var retArr = {};
            var arr1 = args[0];
            var arglm1 = args.length - 1;
            var cb = args[arglm1];
            var arr = {};
            cb = (typeof cb === 'string')
                ? window[cb]
                : (Object.prototype.toString.call(cb) === '[object Array]')
                    ? window[cb[0]][cb[1]]
                    : cb;
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    for (var i = 1; i < arglm1; i++) {
                        arr = args[i];
                        for (var k in arr) {
                            if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
                                arr1keys();
                            }
                        }
                        retArr[k1] = arr1[k1];
                    }
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_diff_uassoc = array_diff_uassoc;
        /**
         * 用回调函数对键名比较计算数组的差集
         *
         * example 1: let $array1 = {blue: 1, red: 2, green: 3, purple: 4}
         * example 1: let $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
         * example 1: array_diff_ukey($array1, $array2, function (key1, key2){
         *      return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1));
         *  })
         * returns 1: {red: 2, purple: 4}
         *
         * @param args
         * @returns {{}}
         */
        function array_diff_ukey() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var retArr = {};
            var arr1 = args[0];
            var arglm1 = args.length - 1;
            var cb = args[arglm1];
            var arr = {};
            cb = (typeof cb === 'string')
                ? window[cb]
                : (Object.prototype.toString.call(cb) === '[object Array]')
                    ? window[cb[0]][cb[1]]
                    : cb;
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    for (var i = 1; i < arglm1; i++) {
                        arr = args[i];
                        for (var k in arr) {
                            if (cb(k, k1) === 0) {
                                arr1keys();
                            }
                        }
                        retArr[k1] = arr1[k1];
                    }
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_diff_ukey = array_diff_ukey;
        /**
         * 用给定的值填充数组
         *
         * example 1: array_fill(5, 6, 'banana')
         * returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }
         *
         * @param startIndex - 返回的数组的第一个索引值。
         * @param num - 插入元素的数量。 必须大于 0。
         * @param mixedVal - 用来填充的值。
         * @returns {{}}
         */
        function array_fill(startIndex, num, mixedVal) {
            var key;
            var tmpArr = {};
            if (!isNaN(startIndex) && !isNaN(num)) {
                for (key = 0; key < num; key++) {
                    tmpArr[(key + startIndex)] = mixedVal;
                }
            }
            return tmpArr;
        }
        zanejs.array_fill = array_fill;
        /**
         * 使用指定的键和值填充数组
         *
         * example 1: let $keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
         * example 1: array_fill_keys($keys, 'banana')
         * returns 1: {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"}
         *
         * @param keys - 使用该数组的值作为键。非法值将被转换为字符串。
         * @param value - 填充使用的值
         * @returns {{}}
         */
        function array_fill_keys(keys, value) {
            var retObj = {};
            Object.keys(keys).map(function (key) {
                retObj[keys[key]] = value;
            });
            return retObj;
        }
        zanejs.array_fill_keys = array_fill_keys;
        /**
         * 用回调函数过滤数组中的单元
         *
         * example 1: let odd = function (num) {return (num & 1);}
         * example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
         * returns 1: {"a": 1, "c": 3, "e": 5}
         *
         * example 2: let even = function (num) {return (!(num & 1));}
         * example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
         * returns 2: [ 6, , 8, , 10, , 12 ]
         *
         * example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
         * returns 3: {"a":1, "c":-1}
         * @param arr
         * @param func
         * @returns {{}}
         */
        function array_filter(arr, func) {
            var retObj = {};
            var k;
            func = func || function (v) {
                return v;
            };
            if (Object.prototype.toString.call(arr) === '[object Array]') {
                retObj = [];
            }
            for (k in arr) {
                if (func(arr[k])) {
                    retObj[k] = arr[k];
                }
            }
            return retObj;
        }
        zanejs.array_filter = array_filter;
        /**
         * 交换数组中的键和值
         * example 1: array_flip( {a: 1, b: 1, c: 2} )
         * returns 1: {1: 'b', 2: 'c'}
         *
         * @param trans - 要交换键/值对的数组。
         * @returns {{}}
         */
        function array_flip(trans) {
            var key;
            var tmpArr = {};
            for (key in trans) {
                if (!trans.hasOwnProperty(key)) {
                    continue;
                }
                tmpArr[trans[key]] = key;
            }
            return tmpArr;
        }
        zanejs.array_flip = array_flip;
        /**
         * 计算数组的交集
         *
         * example 1: let $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
         * example 1: let $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
         * example 1: let $array3 = ['green', 'red']
         * example 1: let $result = array_intersect($array1, $array2, $array3)
         * returns 1: {0: 'red', a: 'green'}
         *
         * @param arr1
         * @returns {{}}
         */
        function array_intersect() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var retArr = {};
            var arr1 = args[0];
            var argl = args.length;
            var arglm1 = argl - 1;
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    function arrs() {
                        for (var i = 1; i < argl; i++) {
                            var arr = arguments[i];
                            for (var k in arr) {
                                if (arr[k] === arr1[k1]) {
                                    if (i === arglm1) {
                                        retArr[k1] = arr1[k1];
                                    }
                                    arrs();
                                }
                            }
                            arr1keys();
                        }
                    }
                    arrs();
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_intersect = array_intersect;
        /**
         * 带索引检查计算数组的交集
         *
         * example 1: let $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
         * example 1: let $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
         * example 1: array_intersect_assoc($array1, $array2)
         *
         * returns 1: {a: 'green'}
         *
         * @param arr1
         * @returns {{}}
         */
        function array_intersect_assoc() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var retArr = {};
            var arr1 = args[0];
            var argl = args.length;
            var arglm1 = argl - 1;
            function arr1keys() {
                Object.keys(arr1).map(function (k1) {
                    function arrs() {
                        for (var i = 1; i < argl; i++) {
                            var arr = args[i];
                            for (var k in arr) {
                                if (arr[k] === arr1[k1] && k === k1) {
                                    if (i === arglm1) {
                                        retArr[k1] = arr1[k1];
                                    }
                                    arrs();
                                }
                            }
                            arr1keys();
                        }
                    }
                    arrs();
                });
            }
            arr1keys();
            return retArr;
        }
        zanejs.array_intersect_assoc = array_intersect_assoc;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path='../events/EventDispatcher.ts'/>
///<reference path="../utils/ArrayUtil.ts"/>
/**
 *
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class com.zanejs.Loader
         */
        var Loader = (function (_super) {
            __extends(Loader, _super);
            /**
             * 构造函数
             * @param {Object} defaultOptions 加载类默认配置选项。
             * @param {HTMLElement} defaultOptions.container
             * @param {boolean} defaultOptions.noCache
             * @param {string} defaultOptions.id
             */
            function Loader(defaultOptions) {
                if (defaultOptions === void 0) { defaultOptions = null; }
                var _this = _super.call(this) || this;
                /**
                 *
                 * @type {HTMLDivElement}
                 * @protected
                 */
                _this.containerElement = null;
                /**
                 *
                 * @type {Array}
                 */
                _this.items = [];
                /**
                 *
                 * @type {Object}
                 */
                _this.options = {};
                if (defaultOptions) {
                    _this.options = defaultOptions;
                }
                if (_this.options && _this.options.container) {
                    _this.containerElement = _this.options.container;
                }
                else {
                    if (document) {
                        _this.containerElement = document.createElement('div');
                        _this.containerElement.style.display = 'none';
                        document.body.appendChild(_this.containerElement);
                    }
                    else {
                        throw new Error('Document is not available. Please pass a valid containerElement.');
                    }
                }
                return _this;
            }
            /**
             *
             * @param src
             * @param noCache
             * @returns {string}
             */
            Loader.evaluateURL = function (src, noCache) {
                if (noCache === void 0) { noCache = false; }
                if (noCache === true) {
                    var newUrl;
                    if (src.indexOf('?') === -1) {
                        newUrl = src + '?cache=' + new Date().getDate();
                    }
                    else {
                        newUrl = src + '&cache=' + new Date().getDate();
                    }
                    return newUrl;
                }
                else {
                    return src;
                }
            };
            /**
             *
             * @returns {boolean}
             */
            Loader.isXHR2Supported = function () {
                var xhr = new XMLHttpRequest;
                var w = window;
                return (typeof xhr.upload !== 'undefined' && (
                // Web worker
                typeof w.postMessage !== 'undefined' || (typeof w.FormData !== 'undefined' &&
                    typeof w.File !== 'undefined' &&
                    typeof w.Blob !== 'undefined')));
            };
            /**
             * 鉴定加载方式
             * @param loaderItemType
             * @returns {string}
             */
            Loader.identifyLoadingType = function (loaderItemType) {
                if (zanejs.LoaderItem.isBinary(loaderItemType) === true) {
                    if (Loader.isXHR2Supported()) {
                        return Loader.LOAD_AS_TAGS;
                    }
                    else {
                        return Loader.LOAD_AS_TAGS;
                    }
                }
                else {
                    if (zanejs.LoaderItem.isData(loaderItemType)) {
                        return Loader.LOAD_AS_XHR;
                    }
                    else {
                        return Loader.LOAD_AS_TAGS;
                    }
                }
            };
            /**
             *
             * @param loaderItemType
             * @param src
             * @returns {HTMLElement}
             */
            Loader.generateTagByType = function (loaderItemType, src) {
                switch (loaderItemType) {
                    case zanejs.LoaderItemType.TYPE_CSS:
                        return Loader.createCssTag(src);
                    case zanejs.LoaderItemType.TYPE_JAVASCRIPT:
                        return Loader.createJavascriptTag(src);
                    case zanejs.LoaderItemType.TYPE_IMAGE:
                        return Loader.createImageTag(src);
                    case zanejs.LoaderItemType.TYPE_SVG:
                        return Loader.createSVGTag(src);
                    case zanejs.LoaderItemType.TYPE_SOUND:
                        return Loader.createSoundTag(src);
                    case zanejs.LoaderItemType.TYPE_VIDEO:
                        return Loader.createVideoTag(src);
                    default:
                        return null;
                }
            };
            /**
             *
             * @param src
             * @returns {HTMLLinkElement|HTMLElement}
             */
            Loader.createCssTag = function (src) {
                var linkElement = document.createElement('link');
                linkElement.setAttribute('rel', 'stylesheet');
                linkElement.setAttribute('type', 'text/css');
                linkElement.setAttribute('href', src);
                return linkElement;
            };
            /**
             *
             * @param src
             * @returns {HTMLScriptElement|HTMLElement}
             */
            Loader.createJavascriptTag = function (src) {
                var scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.setAttribute('src', src);
                return scriptElement;
            };
            /**
             *
             * @param src
             * @returns {HTMLImageElement|HTMLElement}
             */
            Loader.createImageTag = function (src) {
                var imageElement = document.createElement('img');
                imageElement.setAttribute('src', src);
                return imageElement;
            };
            /**
             *
             * @param src
             * @returns {HTMLObjectElement|HTMLElement}
             */
            Loader.createSVGTag = function (src) {
                var objectElement = document.createElement('object');
                objectElement.setAttribute('type', 'image/svg+xml');
                objectElement.setAttribute('src', src);
                return objectElement;
            };
            /**
             *
             * @param src
             * @returns {HTMLAudioElement|HTMLElement}
             */
            Loader.createSoundTag = function (src) {
                var audioElement = document.createElement('audio');
                audioElement.setAttribute('type', 'audio/ogg');
                audioElement.setAttribute('preload', 'auto');
                audioElement.setAttribute('src', src);
                return audioElement;
            };
            /**
             *
             * @returns {HTMLVideoElement|HTMLElement}
             */
            Loader.createVideoTag = function (src) {
                var videoElement = document.createElement('video');
                videoElement.setAttribute('preload', 'auto');
                videoElement.setAttribute('src', src);
                return videoElement;
            };
            /**
             *
             * @param {string} src
             * @param {Object} options
             * @param {boolean} autoLoad
             * @returns {LoaderItem}
             */
            Loader.prototype.load = function (src, options, autoLoad) {
                if (options === void 0) { options = null; }
                if (autoLoad === void 0) { autoLoad = false; }
                var currentItem = this.generateLoaderItem(src, options);
                this.items.push(currentItem);
                if (autoLoad) {
                    currentItem.load();
                }
                return currentItem;
            };
            /**
             *
             * @param value
             * @returns {LoaderItem}
             */
            Loader.prototype.get = function (value) {
                return this.getElementByAttribute('id', value);
            };
            /**
             *
             * @param attribute
             * @param value
             * @returns {LoaderItem}
             */
            Loader.prototype.getElementByAttribute = function (attribute, value) {
                return this.items[zanejs.indexByObjectValue(this.items, attribute, value)];
            };
            /**
             *
             * @param src
             * @param options
             * @returns {LoaderItem}
             */
            Loader.prototype.generateLoaderItem = function (src, options) {
                if (options === void 0) { options = null; }
                var item = new zanejs.LoaderItem(this, src, options);
                if (options) {
                    if (options.loadingType) {
                        item.loadingType = options.loadingType;
                    }
                    else {
                        item.loadingType = Loader.identifyLoadingType(item.type);
                    }
                }
                else {
                    item.loadingType = Loader.identifyLoadingType(item.type);
                }
                return item;
            };
            /**
             * @property LOAD_AS_TAGS
             * @public
             * @static
             * @type {string}
             */
            Loader.LOAD_AS_TAGS = 'tag';
            /**
             * @property LOAD_AS_XHR
             * @public
             * @static
             * @type {string}
             */
            Loader.LOAD_AS_XHR = 'xhr';
            /**
             * @property LOAD_AS_BLOB
             * @public
             * @static
             * @type {string}
             */
            Loader.LOAD_AS_BLOB = 'blob';
            /**
             * @property LOAD_AS_BLOB
             * @public
             * @static
             * @type {string}
             */
            Loader.LOAD_AS_ARRAY_BUFFER = 'arraybuffer';
            /**
             * @property DEFAULT_LOAD_TYPE
             * @protected
             * @static
             * @type {string}
             */
            Loader.DEFAULT_LOAD_TYPE = 'tag';
            return Loader;
        }(zanejs.EventDispatcher));
        zanejs.Loader = Loader;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class URLRequestMethod
         */
        var URLRequestMethod = (function () {
            function URLRequestMethod() {
            }
            /**
             *
             * @type {string}
             */
            URLRequestMethod.GET = 'get';
            /**
             *
             * @type {string}
             */
            URLRequestMethod.POST = 'post';
            return URLRequestMethod;
        }());
        zanejs.URLRequestMethod = URLRequestMethod;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path='../net/URLRequestMethod.ts' />
///<reference path="../core/BaseObject.ts"/>
///<reference path="../events/LoaderEvent.ts"/>
/**
 *
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var LoaderItem = (function (_super) {
            __extends(LoaderItem, _super);
            /**
             * 构造函数
             * @param loader
             * @param src
             * @param options
             */
            function LoaderItem(loader, src, options) {
                if (options === void 0) { options = null; }
                var _this = _super.call(this) || this;
                _this.id = 'asset-item-' + loader.items.length;
                _this.src = src;
                _this.options = {};
                _this.loader = loader;
                _this.loadCompleteHandler = _this.onItemLoadComplete.bind(_this);
                _this.loadProgressHandler = _this.onItemLoadProgress.bind(_this);
                _this.loadErrorHandler = _this.onItemLoadError.bind(_this);
                _this.params = {};
                _this.retries = 0;
                _this.retriesLeft = 0;
                _this.noCache = false;
                _this.state = LoaderItem.STATE_UNLOADED;
                _this.method = zanejs.URLRequestMethod.GET;
                _this.bytesTotal = 0;
                _this.bytesLoaded = 0;
                _this.progress = 0;
                if (options) {
                    _this.options = options;
                    if (options.id) {
                        _this.id = options.id;
                    }
                    if (options.type) {
                        _this.type = options.type;
                    }
                    else {
                        _this.type = zanejs.LoaderItemType.getLoaderItemType(src);
                    }
                    if (options.method) {
                        _this.method = options.method;
                    }
                    if (options.noCache) {
                        _this.noCache = options.noCache;
                    }
                    if (options.retries) {
                        _this.retries = options.retries;
                    }
                }
                else {
                    _this.type = zanejs.LoaderItemType.getLoaderItemType(src);
                }
                return _this;
            }
            /**
             * 是否二进制数据形式
             */
            LoaderItem.isBinary = function (type) {
                switch (type) {
                    case zanejs.LoaderItemType.TYPE_IMAGE:
                    case zanejs.LoaderItemType.TYPE_SOUND:
                        return true;
                    default:
                        return false;
                }
            };
            /**
             *
             * @param type
             * @returns {boolean}
             */
            LoaderItem.isData = function (type) {
                switch (type) {
                    case zanejs.LoaderItemType.TYPE_JSON:
                    case zanejs.LoaderItemType.TYPE_TEXT:
                    case zanejs.LoaderItemType.TYPE_XML:
                        return true;
                    default:
                        return false;
                }
            };
            /**
             * 获取文件地址的后缀
             * @param src
             * @returns {string}
             */
            LoaderItem.getExtension = function (src) {
                return src.split('.').pop();
            };
            /**
             * 开始加载
             * @returns {boolean}
             */
            LoaderItem.prototype.load = function () {
                this.state = LoaderItem.STATE_STARTED;
                this.loader.dispatchPooledEvent(zanejs.LoaderEvent, zanejs.LoaderEvent.START);
                this.state = LoaderItem.STATE_LOADING;
                if (this.queue !== undefined) {
                    this.queue.onQueueItemStart(this);
                }
                if (this.loadingType === zanejs.Loader.LOAD_AS_TAGS) {
                    var htmlElement = zanejs.Loader.generateTagByType(this.type, zanejs.Loader.evaluateURL(this.src, this.noCache));
                    this.element = htmlElement;
                    if (this.type === zanejs.LoaderItemType.TYPE_SOUND) {
                        htmlElement.addEventListener('loadeddata', this.loadCompleteHandler, false);
                    }
                    else if (this.type === zanejs.LoaderItemType.TYPE_VIDEO) {
                        htmlElement.addEventListener('canplaythrough', this.loadCompleteHandler, false);
                    }
                    else {
                        htmlElement.addEventListener('load', this.loadCompleteHandler, false);
                    }
                    htmlElement.addEventListener('error', this.loadErrorHandler, false);
                    try {
                        if (this.options.container === undefined) {
                            this.loader.containerElement.appendChild(htmlElement);
                        }
                        else {
                            this.options.container.appendChild(htmlElement);
                        }
                    }
                    catch (e) {
                        throw new Error('Cannot appendChild script on the given container element.');
                    }
                }
                else if (this.loadingType === zanejs.Loader.LOAD_AS_XHR ||
                    this.loadingType === zanejs.Loader.LOAD_AS_BLOB ||
                    this.loadingType === zanejs.Loader.LOAD_AS_ARRAY_BUFFER) {
                    var request = void 0;
                    var win = window;
                    if (win.XMLHttpRequest) {
                        request = new win.XMLHttpRequest();
                    }
                    else {
                        try {
                            request = new win.ActiveXObject('MSXML2.XMLHTTP.3.0');
                        }
                        catch (ex) {
                            return false;
                        }
                    }
                    // IE9 doesn't support .overrideMimeType(), so we need to check for it.
                    if (this.type === zanejs.LoaderItemType.TYPE_TEXT && request.overrideMimeType) {
                        request.overrideMimeType('text/plain; charset=x-user-defined');
                    }
                    // load the XHR
                    request.open(this.method, zanejs.Loader.evaluateURL(this.src, this.noCache), true);
                    request.send();
                    // if xhr2 is supported and the file is binary
                    if (LoaderItem.isBinary(this.type) && zanejs.Loader.isXHR2Supported()) {
                        if (this.loadingType === zanejs.Loader.LOAD_AS_BLOB) {
                            // if is Blob
                            request.responseType = 'blob';
                        }
                        else if (this.loadingType === zanejs.Loader.LOAD_AS_ARRAY_BUFFER) {
                            // If is a array buffer
                            request.responseType = 'arraybuffer';
                        }
                    }
                    request.addEventListener('progress', this.loadProgressHandler, false);
                    request.addEventListener('load', this.loadCompleteHandler, false);
                    request.addEventListener('error', this.loadErrorHandler, false);
                    this.element = request;
                    return true;
                }
                return false;
            };
            /**
             * 移除监听事件
             * @param {HTMLElement|XMLHttpRequest|ActiveXObject} element
             */
            LoaderItem.prototype.removeEventsFromElement = function (element) {
                element.removeEventListener('load', this.loadCompleteHandler);
                element.removeEventListener('error', this.loadErrorHandler);
                element.removeEventListener('progress', this.loadProgressHandler);
            };
            /**
             * 加载完成
             * @param event
             */
            LoaderItem.prototype.onItemLoadComplete = function (event) {
                this.state = LoaderItem.STATE_FINISHED;
                this.progress = 100;
                if (this.loadingType === zanejs.Loader.LOAD_AS_BLOB ||
                    this.loadingType === zanejs.Loader.LOAD_AS_XHR) {
                    this.element = event.currentTarget;
                }
                if (this.loadingType === zanejs.Loader.LOAD_AS_TAGS) {
                    this.data = this.element;
                }
                else if (this.loadingType === zanejs.Loader.LOAD_AS_XHR) {
                    this.data = event.currentTarget.response;
                }
                else if (this.loadingType === zanejs.Loader.LOAD_AS_BLOB ||
                    this.loadingType === zanejs.Loader.LOAD_AS_ARRAY_BUFFER) {
                    this.data = event.currentTarget.response;
                }
                if (this.queue !== undefined) {
                    this.queue.onQueueItemComplete(this);
                }
                this.removeEventsFromElement(this.element);
                this.loader.dispatchPooledEvent(zanejs.LoaderEvent, zanejs.LoaderEvent.COMPLETE, this);
            };
            /**
             * 加载进度
             * @param event
             */
            LoaderItem.prototype.onItemLoadProgress = function (event) {
                if (event.loaded > 0 && event.total === 0) {
                    return;
                }
                this.state = LoaderItem.STATE_LOADING;
                this.bytesLoaded = event.loaded;
                this.bytesTotal = event.total;
                this.progress = Math.round((100 * this.bytesLoaded) / this.bytesTotal);
                if (this.queue !== undefined) {
                    this.queue.onQueueItemProgress(this);
                }
                this.loader.dispatchPooledEvent(zanejs.LoaderEvent, zanejs.LoaderEvent.PROGRESS, this.progress);
            };
            /**
             * 加载错误
             */
            LoaderItem.prototype.onItemLoadError = function () {
                this.removeEventsFromElement(this.element);
                if (this.retriesLeft > 0) {
                    this.retriesLeft--;
                    setTimeout(function () {
                        this.loader.executeLoad(this);
                    }, 100);
                }
                else {
                    this.state = LoaderItem.STATE_ERROR;
                    if (this.queue !== undefined) {
                        this.queue.onQueueItemError(this);
                    }
                    this.loader.dispatchPooledEvent(zanejs.LoaderEvent, zanejs.LoaderEvent.ERROR);
                }
            };
            /**
             * 未加载状态
             * @type {string}
             */
            LoaderItem.STATE_UNLOADED = 'unloaded';
            /**
             * 开始加载状态
             * @type {string}
             */
            LoaderItem.STATE_STARTED = 'started';
            /**
             * 加载中状态
             * @type {string}
             */
            LoaderItem.STATE_LOADING = 'loading';
            /**
             * 加载完成状态
             * @type {string}
             */
            LoaderItem.STATE_FINISHED = 'complete';
            /**
             * 加载出错状态
             * @type {string}
             */
            LoaderItem.STATE_ERROR = 'error';
            return LoaderItem;
        }(zanejs.BaseObject));
        zanejs.LoaderItem = LoaderItem;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class LoaderItemType
         */
        var LoaderItemType = (function () {
            function LoaderItemType() {
            }
            /**
             * 获取资源类型
             * @param src
             */
            LoaderItemType.getLoaderItemType = function (src) {
                var strExtension = zanejs.LoaderItem.getExtension(src);
                switch (strExtension) {
                    case 'ogg':
                    case 'mp3':
                    case 'wav':
                        return LoaderItemType.TYPE_SOUND;
                    case 'mp4':
                    case 'webm':
                    case 'ogv':
                        return LoaderItemType.TYPE_VIDEO;
                    case 'jpeg':
                    case 'jpg':
                    case 'gif':
                    case 'png':
                        return LoaderItemType.TYPE_IMAGE;
                    case 'json':
                        return LoaderItemType.TYPE_JSON;
                    case 'xml':
                        return LoaderItemType.TYPE_XML;
                    case 'css':
                        return LoaderItemType.TYPE_CSS;
                    case 'js':
                        return LoaderItemType.TYPE_JAVASCRIPT;
                    case 'svg':
                        return LoaderItemType.TYPE_SVG;
                    default:
                        return LoaderItemType.TYPE_TEXT;
                }
            };
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_JAVASCRIPT = 'script';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_CSS = 'css';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_IMAGE = 'image';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_SOUND = 'sound';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_VIDEO = 'video';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_JSON = 'json';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_XML = 'xml';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_SVG = 'svg';
            /**
             *
             * @type {string}
             */
            LoaderItemType.TYPE_TEXT = 'text';
            return LoaderItemType;
        }());
        zanejs.LoaderItemType = LoaderItemType;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
///<reference path="../events/LoaderQueueEvent.ts" />
///<reference path="./Loader.ts" />
///<reference path="./LoaderItem.ts" />
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class LoaderQueue
         */
        var LoaderQueue = (function (_super) {
            __extends(LoaderQueue, _super);
            /**
             *
             * @param {Object}      defaultOptions
             * @param {string}      defaultOptions.id
             * @param {boolean}     defaultOptions.noCache
             * @param {HTMLElement} defaultOptions.container
             * @param {boolean}     defaultOptions.ignoreErrors
             */
            function LoaderQueue(defaultOptions) {
                if (defaultOptions === void 0) { defaultOptions = null; }
                var _this = _super.call(this, defaultOptions) || this;
                /**
                 *
                 * @type {number}
                 * @private
                 */
                _this._currentIndex = 0;
                /**
                 *
                 * @type {null}
                 * @protected
                 */
                _this._currentItem = null;
                /**
                 *
                 * @type {boolean}
                 * @protected
                 */
                _this._isPaused = false;
                /**
                 *
                 * @type {boolean}
                 * @protected
                 */
                _this._firstStart = true;
                /**
                 *
                 * @type {number}
                 * @protected
                 */
                _this._total = 0;
                /**
                 *
                 * @type {number}
                 * @protected
                 */
                _this._totalLoaded = 0;
                /**
                 *
                 * @type {number}
                 * @protected
                 */
                _this._progress = 0;
                /**
                 *
                 * @type {boolean}
                 */
                _this.ignoreErrors = true;
                /**
                 *
                 * @type {Object}
                 */
                _this.options = {};
                _this._loader = new zanejs.Loader(defaultOptions);
                if (defaultOptions) {
                    _this.options = defaultOptions;
                }
                if (_this.options !== undefined) {
                    if (_this.options.ignoreErrors !== undefined) {
                        _this.ignoreErrors = _this.options.ignoreErrors;
                    }
                }
                return _this;
            }
            /**
             * 获取加载进度
             * @returns {number}
             */
            LoaderQueue.prototype.progress = function () {
                return this._progress;
            };
            /**
             *
             * @param {Array|string} srcArr
             * @param {Object} options
             */
            LoaderQueue.prototype.add = function (srcArr, options) {
                if (options === void 0) { options = null; }
                var filteredPath = [], totalPaths, i, currentItem;
                if (Object.prototype.toString.call(srcArr) === '[object Array]') {
                    filteredPath = srcArr;
                }
                else {
                    filteredPath.push(srcArr);
                }
                totalPaths = filteredPath.length;
                for (i = 0; i < totalPaths; i++) {
                    currentItem = this.load(filteredPath[i], options, false);
                    currentItem.queue = this;
                    currentItem.loader = this._loader;
                    this._total = this.items.length;
                }
            };
            /**
             * 开始
             */
            LoaderQueue.prototype.start = function () {
                if (this.items.length === 0) {
                    return;
                }
                if (this._firstStart === true) {
                    this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.START);
                    this.updateQueueProgress();
                }
                this._currentItem = this.items[this._currentIndex];
                this._currentItem.load();
                this._firstStart = false;
            };
            /**
             * 暂停加载
             */
            LoaderQueue.prototype.pause = function () {
                this._isPaused = true;
            };
            /**
             * 加载下一个
             */
            LoaderQueue.prototype.next = function () {
                this._currentIndex++;
                this.start();
            };
            /**
             * 加载上一个
             */
            LoaderQueue.prototype.previous = function () {
                this._currentIndex--;
                this.start();
            };
            /**
             * 验证列队是否到尾部
             * @returns {boolean}
             */
            LoaderQueue.prototype.verifyQueueEnd = function () {
                return this._currentIndex >= (this._total - 1);
            };
            /**
             *
             * @param item
             */
            LoaderQueue.prototype.onQueueItemStart = function (item) {
                this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.ITEM_START, item);
            };
            /**
             * 列队元素加载完成
             * @param item
             */
            LoaderQueue.prototype.onQueueItemComplete = function (item) {
                this._totalLoaded++;
                this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.ITEM_COMPLETE);
                this.updateQueueProgress();
                if (!this.verifyQueueEnd()) {
                    this.next();
                }
                else {
                    this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.COMPLETE);
                }
            };
            /**
             * 列队元素加载出错
             * @param item
             */
            LoaderQueue.prototype.onQueueItemError = function (item) {
                this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.ITEM_ERROR);
                if (this.ignoreErrors === true) {
                    item.progress = 100;
                    this.updateQueueProgress();
                    if (!this.verifyQueueEnd()) {
                        this.next();
                    }
                    else {
                        this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.COMPLETE);
                    }
                }
                else {
                    this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.ERROR);
                }
            };
            /**
             * 列队元素加载进度
             * @param item
             */
            LoaderQueue.prototype.onQueueItemProgress = function (item) {
                this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.ITEM_PROGRESS, item.progress);
                this.updateQueueProgress();
            };
            /**
             * 更新加载进度
             */
            LoaderQueue.prototype.updateQueueProgress = function () {
                var numTotalProgress = 0;
                for (var i = 0; i < this.items.length; i++) {
                    numTotalProgress += this.items[i].progress;
                }
                this._progress = Math.round((numTotalProgress * 100) / (100 * this.items.length));
                this.dispatchPooledEvent(zanejs.LoaderQueueEvent, zanejs.LoaderQueueEvent.PROGRESS, this._progress);
            };
            return LoaderQueue;
        }(zanejs.Loader));
        zanejs.LoaderQueue = LoaderQueue;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 *  @module zane
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 网络监视器
         * @class com.zanejs.NetworkMonitor
         */
        var NetworkMonitor = (function () {
            function NetworkMonitor() {
            }
            /**
             * 注册网络在线的侦听函数
             * @param callback
             */
            NetworkMonitor.registerForOnline = function (callback) {
                NetworkMonitor.onlineListeners.push(callback);
            };
            /**
             * 注册网络离线的侦听函数
             * @param callback
             */
            NetworkMonitor.registerForOffline = function (callback) {
                NetworkMonitor.offlineListeners.push(callback);
            };
            /**
             * 是否在线
             * @returns {boolean}
             */
            NetworkMonitor.isOnline = function () {
                return window.navigator.onLine;
            };
            /**
             * 网络在线监听事件列表
             * @type {Array}
             */
            NetworkMonitor.onlineListeners = [];
            /**
             * 网络离线监听事件列表
             * @type {Array}
             */
            NetworkMonitor.offlineListeners = [];
            return NetworkMonitor;
        }());
        zanejs.NetworkMonitor = NetworkMonitor;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
window.addEventListener('online', function () {
    var onlineListeners = com.zanejs.NetworkMonitor.onlineListeners;
    var listenerCount = onlineListeners.length, listener = null;
    while (listenerCount--) {
        listener = onlineListeners.pop();
        listener();
    }
});
window.addEventListener('offline', function () {
    var offlineListeners = com.zanejs.NetworkMonitor.offlineListeners;
    var listenerCount = offlineListeners.length, listener = null;
    while (listenerCount--) {
        listener = offlineListeners.pop();
        listener();
    }
});
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class URLLoaderDataFormat
         */
        var URLLoaderDataFormat = (function () {
            function URLLoaderDataFormat() {
            }
            /**
             * 指定以原始二进制数据形式接收下载的数据。
             * @type {string}
             */
            URLLoaderDataFormat.BINARY = 'binary';
            /**
             * 指定以文本形式接收已下载的数据。
             * @type {string}
             */
            URLLoaderDataFormat.TEXT = 'text';
            return URLLoaderDataFormat;
        }());
        zanejs.URLLoaderDataFormat = URLLoaderDataFormat;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 *
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         *
         * @param options
         */
        function ajax(options) {
            var url = options.url || '', // 请求的链接
            type = (options.type || 'get').toLowerCase(), // 请求的方法,默认为get
            data = options.data || null, // 请求的数据
            contentType = options.contentType || '', // 请求头
            dataType = options.dataType || '', // 请求的类型
            async = options.async === undefined && true, // 是否异步，默认为true.
            timeOut = options.timeOut, // 超时时间。
            before = options.before || function () { }, // 发送之前执行的函数
            error = options.error || function () { }, // 错误执行的函数
            success = options.success || function () { }, // 请求成功的回调函数
            timeoutBool = false, // 是否请求超时
            timeoutFlag = null, // 超时标识
            xhr = null; // xhr对象
            /**
             * 编码数据
             */
            function setData() {
                var name, value;
                if (data) {
                    if (typeof data === 'string') {
                        data = data.split('&');
                        for (var i = 0, len = data.length; i < len; i++) {
                            name = data[i].split('=')[0];
                            value = data[i].split('=')[1];
                            data[i] = encodeURIComponent(name) + '=' + encodeURIComponent(value);
                        }
                        data = data.replace('/%20/g', '+');
                    }
                    else if (typeof data === 'object') {
                        var arr = [];
                        Object.keys(data).map(function (key) {
                            value = data[key].toString();
                            key = encodeURIComponent(key);
                            value = encodeURIComponent(value);
                            arr.push(key + '=' + value);
                        });
                        data = arr.join('&').replace('/%20/g', '+');
                    }
                    // 若是使用get方法或JSONP，则手动添加到URL中
                    if (type === 'get' || dataType === 'jsonp') {
                        url += url.indexOf('?') > -1 ? data : '?' + data;
                    }
                }
            }
            /**
             * JSONP
             */
            function createJsonp() {
                var script = document.createElement('script'), timeName = new Date().getTime() + Math.round(Math.random() * 1000), callback = 'JSONP_' + timeName;
                window[callback] = function ($data) {
                    clearTimeout(timeoutFlag);
                    document.body.removeChild(script);
                    success($data);
                };
                script.src = url + (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + callback;
                script.type = 'text/javascript';
                document.body.appendChild(script);
                setTime(callback, script);
            }
            /**
             * 设置请求超时
             * @param callback
             * @param script
             */
            function setTime(callback, script) {
                if (timeOut !== undefined) {
                    timeoutFlag = setTimeout(function () {
                        if (dataType === 'jsonp') {
                            delete window[callback];
                            document.body.removeChild(script);
                        }
                        else {
                            timeoutBool = true;
                            if (xhr) {
                                xhr.abort();
                            }
                        }
                        console.log('timeout');
                    }, timeOut);
                }
            }
            // XHR
            function createXHR() {
                // 由于IE6的XMLHttpRequest对象是通过MSXML库中的一个ActiveX对象实现的。
                // 所以创建XHR对象，需要在这里做兼容处理。
                function getXHR() {
                    if (typeof XMLHttpRequest !== 'undefined') {
                        return new XMLHttpRequest();
                    }
                    else {
                        // 遍历IE中不同版本的ActiveX对象
                        var versions = ['Microsoft', 'msxm3', 'msxml2', 'msxml1'];
                        for (var i = 0; i < versions.length; i++) {
                            try {
                                var version = versions[i] + '.XMLHTTP';
                                var cls = 'ActiveXObject';
                                return new window[cls](version);
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
                // 创建对象。
                xhr = getXHR();
                xhr.responseType = dataType;
                xhr.open(type, url, async);
                // 设置请求头
                if (type === 'post' && !contentType) {
                    // 若是post提交，则设置content-Type 为application/x-www-four-urlencoded
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
                }
                else if (contentType) {
                    xhr.setRequestHeader('Content-Type', contentType);
                }
                // 添加监听
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (timeOut !== undefined) {
                            // 由于执行abort()方法后，有可能触发onreadystatechange事件，
                            // 所以设置一个timeout_bool标识，来忽略中止触发的事件。
                            if (timeoutBool) {
                                return;
                            }
                            clearTimeout(timeoutFlag);
                        }
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                            success(xhr.response || xhr.responseText);
                        }
                        else {
                            error(xhr.status, xhr.statusText);
                        }
                    }
                };
                // 发送请求
                xhr.send(type === 'get' ? null : data);
                setTime(null, null); // 请求超时
            }
            setData();
            before();
            if (dataType === 'jsonp') {
                createJsonp();
            }
            else {
                createXHR();
            }
        }
        zanejs.ajax = ajax;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module zane
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isIE() {
            return ua.match(/msie/i) != null;
        }
        /**
         * 是否 IE 浏览器
         * @type {boolean}
         */
        zanejs.isIE = _isIE();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isChrome() {
            return ua.match(/chrome/i) != null;
        }
        /**
         * 是否 Chrome 浏览器
         * @type {boolean}
         */
        zanejs.isChrome = _isChrome();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isChromeIOS() {
            return /CriOS\/[\d]+/.test(ua);
        }
        /**
         * 是否 IOS Chrome 浏览器
         * @type {boolean}
         */
        zanejs.isChromeIOS = _isChromeIOS();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isWebkit() {
            return ua.match(/webkit/i) != null;
        }
        /**
         * 是否 Webkit 内核的浏览器
         * @type {boolean}
         */
        zanejs.isWebkit = _isWebkit();
        /**
         * Safari浏览器
         * @returns {boolean}
         */
        function _isSafari() {
            return (ua.toLowerCase().indexOf('safari') !== -1);
        }
        /**
         * 是否 Safari 浏览器
         * @type {boolean}
         */
        zanejs.isSafari = _isSafari();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isWeiXin() {
            return ua.match(/MicroMessenger/i) != null;
        }
        /**
         * 是否微信内嵌浏览器
         * @type {boolean}
         */
        zanejs.isWeiXin = _isWeiXin();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isQQBrowser() {
            return ua.match(/MQQBrowser/i) != null;
        }
        /**
         * 是否QQ浏览器
         * @type {boolean}
         */
        zanejs.isQQBrowser = _isQQBrowser();
        function _isOpera() {
            return ua.match(/opera/i) != null;
        }
        /**
         * Opera浏览器
         * @returns {boolean}
         */
        zanejs.isOpera = _isOpera();
        /**
         *
         * @returns {string}
         * @private
         */
        function _network() {
            var nav = navigator;
            var connection = nav.connection || nav.mozConnection || nav.webkitConnection || { type: 'unknown' };
            var typeText = ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none'];
            if (typeof (connection.type) === 'number') {
                return typeText[connection.type];
            }
            else if (typeof (connection.bandwidth) === 'number') {
                if (connection.bandwidth > 10) {
                    return 'wifi';
                }
                else if (connection.bandwidth > 2) {
                    return '3g';
                }
                else if (connection.bandwidth > 0) {
                    return '2g';
                }
                else if (connection.bandwidth === 0) {
                    return 'none';
                }
            }
            return 'unknown';
        }
        /**
         * 获取网络类型
         * @type {string}
         */
        zanejs.network = _network();
        /**
         * 是否支持触屏事件
         * @returns {boolean}
         */
        function touchSupported() {
            var win = window;
            var doc = document;
            return (('ontouchstart' in win) ||
                ('undefined' !== typeof win.TouchEvent) ||
                ('undefined' !== typeof doc.createTouch));
        }
        zanejs.touchSupported = touchSupported;
        /**
         * 获取当前页面由网址传递过来的参数
         */
        function getParams() {
            return getUrlParams(document.location.href);
        }
        zanejs.getParams = getParams;
        /**
         * 获取URL传递的参数
         * @param url
         * @returns {Object}
         */
        function getUrlParams(url) {
            url = url.split('?')[1];
            var pl = /\+/g;
            var search = /([^&=]+)=?([^&]*)/g;
            var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
            var urlParams = {};
            var match;
            while (match = search.exec(url)) {
                urlParams[decode(match[1])] = decode(match[2]);
            }
            return urlParams;
        }
        zanejs.getUrlParams = getUrlParams;
        /**
         * 获取浏览器的高度
         * @returns {number}
         */
        function innerHeight() {
            var _height;
            if (window.innerHeight) {
                _height = window.innerHeight;
            }
            else {
                if (document.compatMode === 'CSS1Compat') {
                    _height = document.documentElement.clientHeight;
                }
                else {
                    _height = document.body.clientHeight;
                }
            }
            return _height;
        }
        zanejs.innerHeight = innerHeight;
        /**
         * 获取浏览器的宽度
         * @returns {number}
         */
        function innerWidth() {
            var _width;
            if (window.innerWidth) {
                _width = window.innerWidth;
            }
            else {
                if (document.compatMode === 'CSS1Compat') {
                    _width = document.documentElement.clientWidth;
                }
                else {
                    _width = document.body.clientWidth;
                }
            }
            return _width;
        }
        zanejs.innerWidth = innerWidth;
        /**
         * 获取设备当前屏幕横竖屏模式
         * @returns {number} 0:ANY, 1:LANDSCAPE, 2:PORTRAIT
         */
        function getOrientation() {
            if (typeof window.orientation === 'undefined') {
                var w = innerWidth();
                var h = innerHeight();
                return w > h ? 1 : 2;
            }
            else {
                // 竖向
                if (window.orientation === 180 || window.orientation === 0) {
                    return 2;
                }
                else if (window.orientation === 90 || window.orientation === -90) {
                    return 1;
                }
                return 0;
            }
        }
        zanejs.getOrientation = getOrientation;
        /**
         * 全屏
         * @param element
         * @param options
         */
        function requestFullscreen(element, options) {
            var requestFunction = element.requestFullscreen ||
                element.msRequestFullscreen ||
                element.webkitRequestFullscreen ||
                element.mozRequestFullScreen;
            if (!requestFunction) {
                return;
            }
            requestFunction.call(element, options);
        }
        zanejs.requestFullscreen = requestFullscreen;
        /**
         * 退出全屏
         */
        function exitFullscreen() {
            var doc = document;
            var exit = doc.exitFullscreen ||
                doc.mozCancelFullScreen ||
                doc.webkitCancelFullScreen ||
                doc.msCancelFullScreen;
            if (!exit) {
                return;
            }
            exit();
        }
        zanejs.exitFullscreen = exitFullscreen;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 *
 * Created by zane.deng on 2016/5/4.
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         *
         * @param workerFunction
         * @param workerExportNames
         * @param mainExportNames
         * @param mainExportHandles
         */
        function BuildBridgedWorker(workerFunction, workerExportNames, mainExportNames, mainExportHandles) {
            var baseWorkerStr = workerFunction.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
            var extraWorkerStr = [];
            extraWorkerStr.push('var main = {};\n');
            for (var i = 0; i < mainExportNames.length; i++) {
                var name_1 = mainExportNames[i];
                if (name_1.charAt(name_1.length - 1) === '*') {
                    name_1 = name_1.substr(0, name_1.length - 1);
                    mainExportNames[i] = name_1; // we need this trimmed version back in main
                    extraWorkerStr.push('main.' + name_1 + ' = function(/* arguments */){\n ' +
                        'var args = Array.prototype.slice.call(arguments); ' +
                        'var buffers = args.pop(); \n ' +
                        'self.postMessage({foo:\'' + name_1 + '\', args:args}, buffers)\n' +
                        '}; \n');
                }
                else {
                    extraWorkerStr.push('main.' + name_1 + ' = function(/* arguments */){\n ' +
                        'var args = Array.prototype.slice.call(arguments); \n ' +
                        'self.postMessage({foo:\'' + name_1 + '\', args:args})\n' +
                        '}; \n');
                }
            }
            var tmpStr = [];
            for (var i = 0; i < workerExportNames.length; i++) {
                var name_2 = workerExportNames[i];
                name_2 = name_2.charAt(name_2.length - 1) === '*' ? name_2.substr(0, name_2.length - 1) : name_2;
                tmpStr.push(name_2 + ': ' + name_2);
            }
            extraWorkerStr.push('var foos={' + tmpStr.join(',') + '};\n');
            extraWorkerStr.push('self.onmessage = function(e){\n');
            extraWorkerStr.push('if(e.data.foo in foos) \n  ' +
                'foos[e.data.foo].apply(null, e.data.args); \n ' +
                'else \n ' +
                'throw(new Error(\'Main thread requested function \' + e.data.foo + \'. But it is not available.\'));\n');
            extraWorkerStr.push('\n};\n');
            var fullWorkerStr = baseWorkerStr +
                '\n\n/*==== STUFF ADDED BY BuildBridgeWorker ==== */\n\n' + extraWorkerStr.join('');
            // create the worker
            var url = window.URL.createObjectURL(new Blob([fullWorkerStr], { type: 'text/javascript' }));
            var theWorker = new Worker(url);
            theWorker.onmessage = function (e) {
                var fooInd = mainExportNames.indexOf(e.data.foo);
                if (fooInd !== -1) {
                    mainExportHandles[fooInd].apply(null, e.data.args);
                }
                else {
                    throw (new Error('Worker requested function ' + e.data.foo + '. But it is not available.'));
                }
            };
            var ret = { blobURL: url };
            var makePostMessageForFunction = function (name, hasBuffers) {
                if (hasBuffers) {
                    return function () {
                        var args = Array.prototype.slice.call(arguments);
                        var buffers = args.pop();
                        theWorker.postMessage({ foo: name, args: args }, buffers);
                    };
                }
                else {
                    return function () {
                        var args = Array.prototype.slice.call(arguments);
                        theWorker.postMessage({ foo: name, args: args });
                    };
                }
            };
            for (var i = 0; i < workerExportNames.length; i++) {
                var name_3 = workerExportNames[i];
                if (name_3.charAt(name_3.length - 1) === '*') {
                    name_3 = name_3.substr(0, name_3.length - 1);
                    ret[name_3] = makePostMessageForFunction(name_3, true);
                }
                else {
                    ret[name_3] = makePostMessageForFunction(name_3, false);
                }
            }
            return ret;
        }
        zanejs.BuildBridgedWorker = BuildBridgedWorker;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module zane
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @returns {Function}
         */
        function cancelRequestAnimationFrame() {
            var w = window;
            return w.cancelAnimationFrame ||
                w.webkitCancelAnimationFrame ||
                w.webkitCancelRequestAnimationFrame ||
                w.mozCancelAnimationFrame ||
                w.mozCancelRequestAnimationFrame ||
                w.oCancelRequestAnimationFrame ||
                w.msCancelRequestAnimationFrame ||
                function (timeoutId) {
                    return window.clearTimeout(timeoutId);
                };
        }
        zanejs.cancelRequestAnimationFrame = cancelRequestAnimationFrame;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * canvas 下的混色模式算法
         * @param mode
         * @param srcA
         * @param srcB
         * @param dst
         * @returns {ImageData}
         */
        function canvasBlend(mode, srcA, srcB, dst) {
            var _canvas = document.createElement('canvas'), _context = _canvas.getContext('2d');
            if (!dst) {
                dst = _context.createImageData(srcA);
            }
            /**
             *
             * @param formula
             * @returns {Function}
             */
            function channelBlend(formula) {
                return new Function(
                // Arguments
                'dst', 'i', 'ra', 'ga', 'ba', 'rb', 'gb', 'bb', 'a', 
                // Function body
                'var v;' +
                    'dst[i] = ' + formula.replace(/#a/g, 'ra').replace(/#b/g, 'rb') + ';' +
                    'dst[i + 1] = ' + formula.replace(/#a/g, 'ga').replace(/#b/g, 'gb') + ';' +
                    'dst[i + 2] = ' + formula.replace(/#a/g, 'ba').replace(/#b/g, 'bb') + ';' +
                    'dst[i + 3] = a;');
            }
            /**
             * setSat
             *
             * @see http://www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_archives/blend_modes.pdf
             * @private
             */
            function setSat(_dst, _i, r, g, b, sr, sg, sb) {
                var smax, smin, s, max, min;
                smax = sr > sg ? sr > sb ? sr : sb : sg > sb ? sg : sb;
                smin = sr < sg ? sr < sb ? sr : sb : sg < sb ? sg : sb;
                s = smax - smin;
                max = r > g ? r > b ? r : b : g > b ? g : b;
                min = r < g ? r < b ? r : b : g < b ? g : b;
                if (max === r) {
                    if (min === g) {
                        // max: r, mid: b, min: g
                        if (max === min) {
                            b = r = 0;
                        }
                        else {
                            b = (b - g) * s / (r - g);
                            r = s;
                        }
                        g = 0;
                    }
                    else {
                        // max: r, mid: g, min: b
                        if (max === min) {
                            g = r = 0;
                        }
                        else {
                            g = (g - b) * s / (r - b);
                            r = s;
                        }
                        b = 0;
                    }
                }
                else if (max === g) {
                    if (min === r) {
                        // max: g, mid: b, min: r
                        if (max === min) {
                            b = g = 0;
                        }
                        else {
                            b = (b - r) * s / (g - r);
                            g = s;
                        }
                        r = 0;
                    }
                    else {
                        // max: g, mid: r, min: b
                        if (max === min) {
                            r = g = 0;
                        }
                        else {
                            r = (r - b) * s / (g - b);
                            g = s;
                        }
                        b = 0;
                    }
                }
                else {
                    if (min === r) {
                        // max: b, mid: g, min: r
                        if (max === min) {
                            g = b = 0;
                        }
                        else {
                            g = (g - r) * s / (b - r);
                            b = s;
                        }
                        r = 0;
                    }
                    else {
                        // max: b, mid: r, min: g
                        if (max === min) {
                            r = b = 0;
                        }
                        else {
                            r = (r - g) * s / (b - g);
                            b = s;
                        }
                        g = 0;
                    }
                }
                _dst[_i] = r;
                _dst[_i + 1] = g;
                _dst[_i + 2] = b;
            }
            /**
             * setLum
             * @see http://www.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_archives/blend_modes.pdf
             * @private
             */
            function setLum(_dst, _i, r, g, b, lr, lg, lb) {
                var d, l, max, min, t, s;
                d = (0.2989 * lr + 0.587 * lg + 0.114 * lb) - (0.2989 * r + 0.587 * g + 0.114 * b);
                r += d;
                g += d;
                b += d;
                l = 0.2989 * r + 0.587 * g + 0.114 * b;
                max = r > g ? r > b ? r : b : g > b ? g : b;
                min = r < g ? r < b ? r : b : g < b ? g : b;
                if (min < 0) {
                    s = l - min;
                    r = l + (r - l) * l / s;
                    g = l + (g - l) * l / s;
                    b = l + (b - l) * l / s;
                }
                if (max > 255) {
                    t = 255 - l;
                    s = max - l;
                    r = l + (r - l) * t / s;
                    g = l + (g - l) * t / s;
                    b = l + (b - l) * t / s;
                }
                _dst[_i] = r;
                _dst[_i + 1] = g;
                _dst[_i + 2] = b;
            }
            var BlendModes = {
                // 变暗模式
                darken: channelBlend('#a < #b ? #a : #b'),
                // 正片叠底模式
                multiply: channelBlend('#a * #b / 255'),
                // 颜色加深模式
                colorburn: channelBlend('#b === 0 ? 0 : (v = 255 - ((255 - #a) * 255) / #b) > 0 ? v : 0;'),
                // 线性颜色加深模式
                linearburn: channelBlend('(v = #a + #b) < 255 ? 0 : v - 255;'),
                // 较暗的颜色模式
                darkercolor: function (_dst, _i, ra, ga, ba, rb, gb, bb, a) {
                    if (ra + ga + ba < rb + gb + bb) {
                        _dst[_i] = ra;
                        _dst[_i + 1] = ga;
                        _dst[_i + 2] = ba;
                    }
                    else {
                        _dst[_i] = rb;
                        _dst[_i + 1] = gb;
                        _dst[_i + 2] = bb;
                    }
                    _dst[_i + 3] = a;
                },
                // 变亮模式
                lighten: channelBlend('#a > #b ? #a : #b'),
                // 滤色模式
                screen: channelBlend('#a + #b - #a * #b / 255'),
                // 颜色减淡模式
                colordodge: channelBlend('#b === 0xFF ? 255 : (v = #a * 255 / (255 - #b)) < 255 ? v : 255'),
                // 线型减淡模式
                lineardodge: channelBlend('(v = #a + #b) > 255 ? 255 : v'),
                // 淡化色彩模式
                lightercolor: function (_dst, _i, ra, ga, ba, rb, gb, bb, a) {
                    if (ra + ga + ba > rb + gb + bb) {
                        _dst[_i] = ra;
                        _dst[_i + 1] = ga;
                        _dst[_i + 2] = ba;
                    }
                    else {
                        _dst[_i] = rb;
                        _dst[_i + 1] = gb;
                        _dst[_i + 2] = bb;
                    }
                    _dst[_i + 3] = a;
                },
                // 叠加模式
                overlay: channelBlend('#a > 128 ? #b + (2 * #a - 255) - ' +
                    '#b * (2 * #a - 255) / 255 : #b * 2 * #a / 255'),
                // 柔光模式
                softlight: channelBlend('#b < 128 ? #a + (#a - #a * #a / 255) ' +
                    '* (2 * #b / 255 - 1) : #a <= 32 ? #a + (#a - #a * a / 255) * (2 * #b / 255 - 1) * ' +
                    '(3 - 8 * #a / 255) : #a + (Math.sqrt(#a * 255) - #a) * (2 * #b / 255 - 1)'),
                // 强光模式
                hardlight: channelBlend('#b > 128 ? #a + (2 * #b - 255) - #a *' +
                    ' (2 * #b - 255) / 255 : #a * 2 * #b / 255'),
                // 艳光模式
                vividlight: channelBlend('#b < 128 ? #a <= 255 - 2 * #b ? 0 : (#a - (255 - 2 * #b)) ' +
                    '/ #b * 127.5 : #a < 510 - 2 * #b ? #a / (2 - #b / 127.5) : 255'),
                // 线性光模式
                linearlight: channelBlend('#b < 128 ? #a < 255 - 2 * #b ? 0 : 2 * #b + ' +
                    '#a - 255 : #a < 510 - 2 * #b ? 2 * #b + #a - 255 : 255'),
                // 固定光模式
                pinlight: channelBlend('#b < 128 ? 2 * #b < #a ? 2 * #b : #a : 2 * ' +
                    '#b - 255 < #a ? #a : 2 * #b - 255'),
                // 强混合模式
                hardmix: channelBlend('(#b < 128 ? #a <= 255 - 2 * #b ? 0 : (#a - (255 - 2 * #b)) / ' +
                    '#b * 255 / 2 : #a < 510 - 2 * #b ? #a / (2 - #b * 2 / 255) : 255) < 128 ? 0 : 255'),
                // 差值模式
                difference: channelBlend('(v = #a - #b) < 0 ? -v : v'),
                // 排除模式
                exclusion: channelBlend('#a + #b - 2 * #a * #b / 255'),
                // 减去
                subtract: channelBlend('(v = #a - #b) < 0 ? 0 : v'),
                // 划分
                divide: channelBlend('#a / (#b / 255)'),
                // 色相
                hue: function (_dst, _i, ra, ga, ba, rb, gb, bb, a) {
                    setSat(_dst, _i, rb, gb, bb, ra, ga, ba);
                    setLum(_dst, _i, dst[_i], dst[_i + 1], dst[_i + 2], ra, ga, ba);
                    _dst[_i + 3] = a;
                },
                // 彩度
                saturation: function (_dst, _i, ra, ga, ba, rb, gb, bb, a) {
                    setSat(_dst, _i, ra, ga, ba, rb, gb, bb);
                    setLum(_dst, _i, dst[_i], dst[_i + 1], dst[_i + 2], ra, ga, ba);
                    _dst[_i + 3] = a;
                },
                // 颜色模式
                color: function (_dst, _i, ra, ga, ba, rb, gb, bb, a) {
                    setLum(_dst, _i, rb, gb, bb, ra, ga, ba);
                    _dst[_i + 3] = a;
                },
                // 亮度模式
                luminosity: function (_dst, _i, ra, ga, ba, rb, gb, bb, a) {
                    setLum(_dst, _i, ra, ga, ba, rb, gb, bb);
                    _dst[_i + 3] = a;
                }
            };
            var blend = BlendModes[mode.toLowerCase()], srcAWidth = srcA.width, srcAHeight = srcA.height, srcAPixels = srcA.data, srcBWidth = srcB.width, srcBHeight = srcB.height, srcBPixels = srcB.data, dstWidth = dst.width, dstHeight = dst.height, dstPixels = dst.data, x, y, yi, yj, yk, bInY, i, j, k;
            for (y = 0; y < dstHeight; y++) {
                yi = y * dstWidth;
                yj = y * srcAWidth;
                if ((bInY = y < srcAHeight && y < srcBHeight)) {
                    yk = y * srcBWidth;
                }
                for (x = 0; x < dstWidth; x++) {
                    i = (x + yi) * 4;
                    j = (x + yj) * 4;
                    if (bInY && x < srcAWidth && x < srcBWidth) {
                        k = (x + yk) * 4;
                        blend(dstPixels, i, srcAPixels[j], srcAPixels[j + 1], srcAPixels[j + 2], srcBPixels[k], srcBPixels[k + 1], srcBPixels[k + 2], srcAPixels[j + 3]);
                    }
                    else {
                        dstPixels[i] = srcAPixels[j];
                        dstPixels[i + 1] = srcAPixels[j + 1];
                        dstPixels[i + 2] = srcAPixels[j + 2];
                        dstPixels[i + 3] = srcAPixels[j + 3];
                    }
                }
            }
            return dst;
        }
        zanejs.canvasBlend = canvasBlend;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module zane
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 创建一个实例对象
         * @param {any} clazz
         * @param {array} args
         * @returns {any}
         */
        function createInstance(clazz, args) {
            if (Object.prototype.toString.call(args) !== '[object Array]') {
                args = [args];
            }
            var instance = Object.create(clazz.prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }
        zanejs.createInstance = createInstance;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var Color = (function () {
            /**
             *
             * @param r
             * @param g
             * @param b
             * @param a
             */
            function Color(r, g, b, a) {
                if (r === void 0) { r = 0.0; }
                if (g === void 0) { g = 0.0; }
                if (b === void 0) { b = 0.0; }
                if (a === void 0) { a = 0.0; }
                /**
                 *
                 * @type {number}
                 */
                this.r = 0.0;
                /**
                 *
                 * @type {number}
                 */
                this.g = 0.0;
                /**
                 *
                 * @type {number}
                 */
                this.b = 0.0;
                /**
                 *
                 * @type {number}
                 */
                this.a = 0.0;
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
            /**
             *
             * @param color
             * @returns {boolean}
             */
            Color.prototype.equals = function (color) {
                return this.a === color.a && this.g === color.g && this.b === color.b && this.r === color.r;
            };
            /**
             *
             * @returns {Float32Array}
             */
            Color.prototype.rgba = function () {
                return new Float32Array([this.r, this.g, this.b, this.a]);
            };
            /**
             *
             * @returns {Float32Array}
             */
            Color.prototype.rgb = function () {
                return new Float32Array([this.r, this.g, this.b]);
            };
            /**
             * 白色
             * @type {zane.Color}
             */
            Color.white = new Color(1.0, 1.0, 1.0, 1.0);
            /**
             * 黑色
             * @type {zane.Color}
             */
            Color.black = new Color(0.0, 0.0, 0.0, 1.0);
            /**
             * 红色
             * @type {zane.Color}
             */
            Color.red = new Color(1.0, 0.0, 0.0, 1.0);
            /**
             * 绿色
             * @type {zane.Color}
             */
            Color.green = new Color(0.0, 1.0, 0.0, 1.0);
            /**
             * 蓝色
             * @type {zane.Color}
             */
            Color.blue = new Color(0.0, 0.0, 1.0, 1.0);
            return Color;
        }());
        zanejs.Color = Color;
        /**
         *
         * @param float32Color
         * @returns {number[]}
         */
        function float32ColorToARGB(float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            return [a, r, g, b];
        }
        zanejs.float32ColorToARGB = float32ColorToARGB;
        /**
         *
         * @param a
         * @param r
         * @param g
         * @param b
         * @returns {number}
         * @constructor
         */
        function ARGBtoFloat32(a, r, g, b) {
            return ((a << 24) | (r << 16) | (g << 8) | b);
        }
        zanejs.ARGBtoFloat32 = ARGBtoFloat32;
        /**
         *
         * @param c
         * @returns {string}
         */
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        zanejs.componentToHex = componentToHex;
        /**
         *
         * @param argb
         * @returns {string}
         * @constructor
         */
        function RGBToHexString(argb) {
            return '#' +
                componentToHex(argb[1]) +
                componentToHex(argb[2]) +
                componentToHex(argb[3]);
        }
        zanejs.RGBToHexString = RGBToHexString;
        /**
         *
         * @param argb
         * @returns {string}
         * @constructor
         */
        function ARGBToHexString(argb) {
            return '#' +
                componentToHex(argb[0]) +
                componentToHex(argb[1]) +
                componentToHex(argb[2]) +
                componentToHex(argb[3]);
        }
        zanejs.ARGBToHexString = ARGBToHexString;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 检查由参数构成的日期的合法性。如果每个参数都正确定义了则会被认为是有效的。
         *
         * example 1: checkdate(12, 31, 2000)
         * returns 1: true
         *
         * example 2: checkdate(2, 29, 2001)
         * returns 2: false
         *
         * example 3: checkdate(3, 31, 2008)
         * returns 3: true
         *
         * example 4: checkdate(1, 390, 2000)
         * returns 4: false
         *
         * @param m  - m值是从 1 到 12。
         * @param d  - d 的值在给定的 m 所应该具有的天数范围之内，闰年已经考虑进去了。
         * @param y  - y 的值是从 1 到 32767。
         * @returns {boolean} 如果给出的日期有效则返回 TRUE，否则返回 FALSE。
         */
        function checkdate(m, d, y) {
            return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
                .getDate();
        }
        zanejs.checkdate = checkdate;
        /**
         * 格式化一个本地时间／日期
         *
         *
         * example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
         * returns 1: '07:09:40 m is month'
         *
         * example 2: date('F j, Y, g:i a', 1062462400)
         * returns 2: 'September 2, 2003, 12:26 am'
         *
         * example 3: date('Y W o', 1062462400)
         * returns 3: '2003 36 2003'
         *
         * example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
         * example 4: $x = $x + ''
         * example 4: var $result = $x.length // 2009 01 09
         * returns 4: 10
         *
         * example 5: date('W', 1104534000)
         * returns 5: '52'
         *
         * example 6: date('B t', 1104534000)
         * returns 6: '999 31'
         *
         * example 7: date('W U', 1293750000.82); // 2010-12-31
         * returns 7: '52 1293750000'
         *
         * example 8: date('W', 1293836400); // 2011-01-01
         * returns 8: '52'
         *
         * example 9: date('W Y-m-d', 1293974054); // 2011-01-02
         * returns 9: '52 2011-01-02'
         *
         * @param format
         * @param timestamp
         * @returns {string|void}
         */
        function date(format, timestamp) {
            var jsdate, f;
            var txtWords = [
                'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            var formatChr = /\\?(.?)/gi;
            var formatChrCb = function (t, s) {
                return f[t] ? f[t]() : s;
            };
            var _pad = function (n, c) {
                n = String(n);
                while (n.length < c) {
                    n = '0' + n;
                }
                return n;
            };
            f = {
                // 月份中的第几天，有前导零的 2 位数字
                d: function () {
                    // Day of month w/leading 0; 01..31
                    return _pad(f.j(), 2);
                },
                // 星期中的第几天，文本表示，3 个字母
                D: function () {
                    // Shorthand day name; Mon...Sun
                    return f.l()
                        .slice(0, 3);
                },
                // 月份中的第几天，没有前导零
                j: function () {
                    // Day of month; 1..31
                    return jsdate.getDate();
                },
                // 星期几，完整的文本格式
                l: function () {
                    // Full day name; Monday...Sunday
                    return txtWords[f.w()] + 'day';
                },
                // ISO-8601 格式数字表示的星期中的第几天
                N: function () {
                    // ISO-8601 day of week; 1[Mon]..7[Sun]
                    return f.w() || 7;
                },
                // 每月天数后面的英文后缀，2 个字符
                S: function () {
                    // Ordinal suffix for day of month; st, nd, rd, th
                    var j = f.j();
                    var i = j % 10;
                    if (i <= 3 && parseInt(((j % 100) / 10) + '', 10) === 1) {
                        i = 0;
                    }
                    return ['st', 'nd', 'rd'][i - 1] || 'th';
                },
                // 星期中的第几天，数字表示
                w: function () {
                    // Day of week; 0[Sun]..6[Sat]
                    return jsdate.getDay();
                },
                // 年份中的第几天
                z: function () {
                    // Day of year; 0..365
                    var a = new Date(f.Y(), f.n() - 1, f.j());
                    var b = new Date(f.Y(), 0, 1);
                    return Math.round((a - b) / 864e5);
                },
                // ISO-8601 格式年份中的第几周，每周从星期一开始
                W: function () {
                    // ISO-8601 week number
                    var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
                    var b = new Date(a.getFullYear(), 0, 4);
                    return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
                },
                // 月份，完整的文本格式，例如 January 或者 March
                F: function () {
                    // Full month name; January...December
                    return txtWords[6 + f.n()];
                },
                // 数字表示的月份，有前导零
                m: function () {
                    // Month w/leading 0; 01...12
                    return _pad(f.n(), 2);
                },
                // 三个字母缩写表示的月份
                M: function () {
                    // Shorthand month name; Jan...Dec
                    return f.F()
                        .slice(0, 3);
                },
                // 数字表示的月份，没有前导零
                n: function () {
                    // Month; 1...12
                    return jsdate.getMonth() + 1;
                },
                // 给定月份所应有的天数
                t: function () {
                    // Days in month; 28...31
                    return (new Date(f.Y(), f.n(), 0))
                        .getDate();
                },
                // 是否为闰年
                L: function () {
                    // Is leap year?; 0 or 1
                    var j = f.Y();
                    return (j % 4 === 0) && (j % 100 !== 0) || (j % 400 === 0);
                },
                // ISO-8601 格式年份数字。这和 Y 的值相同，只除了如果 ISO 的星期数（W）属于前一年或下一年，则用那一年。
                o: function () {
                    // ISO-8601 year
                    var n = f.n();
                    var W = f.W();
                    var Y = f.Y();
                    return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
                },
                // 4 位数字完整表示的年份
                Y: function () {
                    // Full year; e.g. 1980...2010
                    return jsdate.getFullYear();
                },
                // 2 位数字表示的年份
                y: function () {
                    // Last two digits of year; 00...99
                    return f.Y()
                        .toString()
                        .slice(-2);
                },
                // 小写的上午和下午值
                a: function () {
                    // am or pm
                    return jsdate.getHours() > 11 ? 'pm' : 'am';
                },
                // 大写的上午和下午值
                A: function () {
                    // AM or PM
                    return f.a()
                        .toUpperCase();
                },
                // Swatch Internet 标准时
                B: function () {
                    // Swatch Internet time; 000..999
                    var H = jsdate.getUTCHours() * 36e2;
                    // Hours
                    var i = jsdate.getUTCMinutes() * 60;
                    // Minutes
                    // Seconds
                    var s = jsdate.getUTCSeconds();
                    return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
                },
                // 小时，12 小时格式，没有前导零
                g: function () {
                    // 12-Hours; 1..12
                    return f.G() % 12 || 12;
                },
                // 小时，24 小时格式，没有前导零
                G: function () {
                    // 24-Hours; 0..23
                    return jsdate.getHours();
                },
                // 小时，12 小时格式，有前导零
                h: function () {
                    // 12-Hours w/leading 0; 01..12
                    return _pad(f.g(), 2);
                },
                // 小时，24 小时格式，有前导零
                H: function () {
                    // 24-Hours w/leading 0; 00..23
                    return _pad(f.G(), 2);
                },
                // 有前导零的分钟数
                i: function () {
                    // Minutes w/leading 0; 00..59
                    return _pad(jsdate.getMinutes(), 2);
                },
                // 秒数，有前导零
                s: function () {
                    // Seconds w/leading 0; 00..59
                    return _pad(jsdate.getSeconds(), 2);
                },
                // 毫秒
                u: function () {
                    // Microseconds; 000000-999000
                    return _pad(jsdate.getMilliseconds() * 1000, 6);
                },
                // 时区标识
                e: function () {
                    // Timezone identifier; e.g. Atlantic/Azores, ...
                    // The following works, but requires inclusion of the very large
                    // timezone_abbreviations_list() function.
                    /*              return that.date_default_timezone_get();
                     */
                    var msg = 'Not supported (see source code of date() for timezone on how to add support)';
                    throw new Error(msg);
                },
                // 是否为夏令时
                I: function () {
                    // DST observed?; 0 or 1
                    // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                    // If they are not equal, then DST is observed.
                    var a = new Date(f.Y(), 0);
                    // Jan 1
                    var c = Date.UTC(f.Y(), 0);
                    // Jan 1 UTC
                    var b = new Date(f.Y(), 6);
                    // Jul 1
                    // Jul 1 UTC
                    var d = Date.UTC(f.Y(), 6);
                    return ((a - c) !== (b - d)) ? 1 : 0;
                },
                // 与格林威治时间相差的小时数
                O: function () {
                    // Difference to GMT in hour format; e.g. +0200
                    var tzo = jsdate.getTimezoneOffset();
                    var a = Math.abs(tzo);
                    return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
                },
                // 与格林威治时间（GMT）的差别，小时和分钟之间有冒号分隔
                P: function () {
                    // Difference to GMT w/colon; e.g. +02:00
                    var O = f.O();
                    return (O.substr(0, 3) + ':' + O.substr(3, 2));
                },
                // 本机所在的时区
                T: function () {
                    return 'UTC';
                },
                // 时差偏移量的秒数。
                Z: function () {
                    // Timezone offset in seconds (-43200...50400)
                    return -jsdate.getTimezoneOffset() * 60;
                },
                // ISO 8601 格式的日期
                c: function () {
                    // ISO-8601 date.
                    return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
                },
                // RFC 822 格式的日期
                r: function () {
                    // RFC 2822
                    return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
                },
                // 从 Unix 纪元（January 1 1970 00:00:00 GMT）开始至今的秒数
                U: function () {
                    // Seconds since UNIX epoch
                    return Math.floor(jsdate / 1000);
                }
            };
            var _date = function (_format, _timestamp) {
                jsdate = (_timestamp === undefined ? new Date() // Not provided
                    : (_timestamp instanceof Date) ? new Date(_timestamp + '') // JS Date()
                        : new Date(_timestamp * 1000 + '') // UNIX timestamp (auto-convert to int)
                );
                return _format.replace(formatChr, formatChrCb);
            };
            return _date(format, timestamp);
        }
        zanejs.date = date;
        /**
         * 取得日期／时间信息
         *
         * example 1: getdate(1055901520)
         * returns 1: {'seconds': 40, 'minutes': 58, 'hours': 1, 'mday': 18, 'wday': 3,
         * 'mon': 6, 'year': 2003, 'yday': 168, 'weekday': 'Wednesday', 'month': 'June', '0': 1055901520}
         * @param timestamp
         * @returns {{}}
         */
        function getdate(timestamp) {
            if (timestamp === void 0) { timestamp = undefined; }
            var _w = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
            var _m = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            var d = ((typeof timestamp === 'undefined') ? new Date()
                : (timestamp instanceof Date) ? new Date(timestamp + '') // Not provided
                    : new Date(timestamp * 1000 + '') // Javascript Date() // UNIX timestamp (auto-convert to int)
            );
            var w = d.getDay();
            var m = d.getMonth();
            var y = d.getFullYear();
            var d1 = new Date(y, 0, 1);
            var r = {};
            r.seconds = d.getSeconds();
            r.minutes = d.getMinutes();
            r.hours = d.getHours();
            r.mday = d.getDate();
            r.wday = w;
            r.mon = m + 1;
            r.year = y;
            r.yday = Math.floor((d - d1) / 86400000);
            r.weekday = _w[w] + 'day';
            r.month = _m[m];
            r['0'] = parseInt((d.getTime() / 1000) + '', 10);
            return r;
        }
        zanejs.getdate = getdate;
        /**
         * 取得当前时间
         *
         * example 1: var $obj = gettimeofday()
         * example 1: var $result = ('sec' in $obj && 'usec' in $obj && 'minuteswest' in $obj &&80, 'dsttime' in $obj)
         * returns 1: true
         *
         * example 2: var $timeStamp = gettimeofday(true)
         * example 2: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
         * returns 2: true
         *
         * @param returnFloat 当其设为 TRUE 时，会返回一个浮点数而不是一个数组。
         * @returns {*}
         */
        function gettimeofday(returnFloat) {
            if (returnFloat === void 0) { returnFloat = false; }
            var t = new Date();
            if (returnFloat) {
                return t.getTime() / 1000;
            }
            // Store current year.
            var y = t.getFullYear();
            var d1 = new Date(y, 0);
            var d2 = Date.UTC(y, 0);
            var d3 = new Date(y, 6);
            var d4 = Date.UTC(y, 6);
            return {
                sec: t.getUTCSeconds(),
                usec: t.getUTCMilliseconds() * 1000,
                minuteswest: t.getTimezoneOffset(),
                // Compare Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC to see if DST is observed.
                dsttime: d1 - d2 !== d3 - d4
            };
        }
        zanejs.gettimeofday = gettimeofday;
        /**
         * 格式化一个 GMT/UTC 日期／时间
         * 同 date() 函数完全一样，只除了返回的时间是格林威治标准时（GMT）。
         * 例如当在中国（GMT +0800）运行以下程序时，第一行显示“Jan 01 2000 00:00:00”而第二行显示“Dec 31 1999 16:00:00”。
         *
         * example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
         * returns 1: '07:09:40 m is month'
         *
         * @param format
         * @param timestamp
         * @returns {string}
         */
        function gmdate(format, timestamp) {
            var dt = typeof timestamp === 'undefined' ? new Date() // Not provided
                : timestamp instanceof Date ? new Date(timestamp + '') // Javascript Date()
                    : new Date(timestamp * 1000 + ''); // UNIX timestamp (auto-convert to int)
            timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000;
            return date(format, timestamp);
        }
        zanejs.gmdate = gmdate;
        /**
         * 取得 GMT 日期的 UNIX 时间戳
         * 和 mktime() 完全一样，只除了返回值是格林威治标准时的时间戳。
         *
         * example 1: gmmktime(14, 10, 2, 2, 1, 2008)
         * returns 1: 1201875002
         *
         * example 2: gmmktime(0, 0, -1, 1, 1, 1970)
         * returns 2: -1
         *
         * @returns {*}
         */
        function gmmktime() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var d = new Date();
            var e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];
            for (var i = 0; i < e.length; i++) {
                if (typeof args[i] === 'undefined') {
                    args[i] = d['getUTC' + e[i]]();
                    // +1 to fix JS months.
                    args[i] += (i === 3);
                }
                else {
                    args[i] = parseInt(args[i], 10);
                    if (isNaN(args[i])) {
                        return false;
                    }
                }
            }
            // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
            args[5] += (args[5] >= 0 ? (args[5] <= 69 ? 2e3 : (args[5] <= 100 ? 1900 : 0)) : 0);
            // Set year, month (-1 to fix JS months), and date.
            // !This must come before the call to setHours!
            d.setUTCFullYear(args[5], args[3] - 1, args[4]);
            // Set hours, minutes, and seconds.
            d.setUTCHours(args[0], args[1], args[2]);
            var _time = d.getTime();
            // Divide milliseconds by 1000 to return seconds and drop decimal.
            // Add 1 second if negative or it'll be off from PHP by 1 second.
            return Math.floor(_time / 1e3) - (_time < 0 ? 1 : 0);
        }
        zanejs.gmmktime = gmmktime;
        /**
         * 取得一个日期的 Unix 时间戳
         * 根据给出的参数返回 Unix 时间戳。时间戳是一个长整数，包含了从 Unix 纪元（January 1 1970 00:00:00 GMT）到给定时间的秒数。
         * 参数可以从右向左省略，任何省略的参数会被设置成本地日期和时间的当前值。
         *
         * example 1: mktime(14, 10, 2, 2, 1, 2008)
         * returns 1: 1201875002
         *
         * example 2: mktime(0, 0, 0, 0, 1, 2008)
         * returns 2: 1196467200
         *
         * example 3: var $make = mktime()
         * example 3: var $td = new Date()
         * example 3: var $real = Math.floor($td.getTime() / 1000)
         * example 3: var $diff = ($real - $make)
         * example 3: $diff < 5
         * returns 3: true
         *
         * example 4: mktime(0, 0, 0, 13, 1, 1997)
         * returns 4: 883612800
         *
         * example 5: mktime(0, 0, 0, 1, 1, 1998)
         * returns 5: 883612800
         *
         * example 6: mktime(0, 0, 0, 1, 1, 98)
         * returns 6: 883612800
         *
         * example 7: mktime(23, 59, 59, 13, 0, 2010)
         * returns 7: 1293839999
         *
         * example 8: mktime(0, 0, -1, 1, 1, 1970)
         * returns 8: -1
         *
         * @returns {*}
         */
        function mktime() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var d = new Date();
            var r = arguments;
            var e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear'];
            for (var i = 0; i < e.length; i++) {
                if (typeof r[i] === 'undefined') {
                    r[i] = d['get' + e[i]]();
                    // +1 to fix JS months.
                    r[i] += (i === 3);
                }
                else {
                    r[i] = parseInt(r[i], 10);
                    if (isNaN(r[i])) {
                        return false;
                    }
                }
            }
            // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
            r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0);
            // Set year, month (-1 to fix JS months), and date.
            // !This must come before the call to setHours!
            d.setFullYear(r[5], r[3] - 1, r[4]);
            // Set hours, minutes, and seconds.
            d.setHours(r[0], r[1], r[2]);
            var _time = d.getTime();
            // Divide milliseconds by 1000 to return seconds and drop decimal.
            // Add 1 second if negative or it'll be off from PHP by 1 second.
            return Math.floor(_time / 1e3) - (_time < 0 ? 1 : 0);
        }
        zanejs.mktime = mktime;
        /**
         * 将本地时间日期格式化为整数
         * 根据给定的格式字符对 timestamp 格式化并返回数字结果。timestamp 为可选项，默认值为本地当前时间，即 time() 的值。
         * 和 date() 不同，idate() 只接受一个字符作为 format 参数。
         *
         * example 1: idate('y', 1255633200)
         * returns 1: 9
         *
         * @param format
         * @param timestamp
         * @returns {*}
         */
        function idate(format, timestamp) {
            if (format === undefined) {
                throw new Error('idate() expects at least 1 parameter, 0 given');
            }
            if (!format.length || format.length > 1) {
                throw new Error('idate format is one char');
            }
            var _date = (typeof timestamp === 'undefined')
                ? new Date()
                : (timestamp instanceof Date)
                    ? new Date(timestamp + '')
                    : new Date(timestamp * 1000 + '');
            var a, d;
            switch (format) {
                case 'B':
                    return Math.floor(((_date.getUTCHours() * 36e2) +
                        (_date.getUTCMinutes() * 60) +
                        _date.getUTCSeconds() + 36e2) / 86.4) % 1e3;
                case 'd':
                    return _date.getDate();
                case 'h':
                    return _date.getHours() % 12 || 12;
                case 'H':
                    return _date.getHours();
                case 'i':
                    return _date.getMinutes();
                case 'I':
                    // capital 'i'
                    // Logic original by getimeofday().
                    // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
                    // If they are not equal, then DST is observed.
                    a = _date.getFullYear();
                    var d01 = new Date(a, 0);
                    var d02 = Date.UTC(a, 0);
                    var d61 = new Date(a, 6);
                    var d62 = Date.UTC(a, 6);
                    return d01 - d02 !== d61 - d62;
                case 'L':
                    a = _date.getFullYear();
                    return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0;
                case 'm':
                    return _date.getMonth() + 1;
                case 's':
                    return _date.getSeconds();
                case 't':
                    return (new Date(_date.getFullYear(), _date.getMonth() + 1, 0))
                        .getDate();
                case 'U':
                    return Math.round(_date.getTime() / 1000);
                case 'w':
                    return _date.getDay();
                case 'W':
                    a = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate() - (_date.getDay() || 7) + 3);
                    d = new Date(a.getFullYear(), 0, 4);
                    return 1 + Math.round((a - d) / 864e5 / 7);
                case 'y':
                    return parseInt((_date.getFullYear() + '').slice(2), 10); // This function returns an integer, unlike _date()
                case 'Y':
                    return _date.getFullYear();
                case 'z':
                    d = new Date(_date.getFullYear(), 0, 1);
                    return Math.floor((_date - d) / 864e5);
                case 'Z':
                    return -_date.getTimezoneOffset() * 60;
                default:
                    throw new Error('Unrecognized _date format token');
            }
        }
        zanejs.idate = idate;
        /**
         * 返回当前 Unix 时间戳和微秒数
         *
         * example 1: var $timeStamp = microtime(true)
         * example 1: $timeStamp > 1000000000 && $timeStamp < 2000000000
         * returns 1: true
         *
         * example 2: /^0\.[0-9]{1,6} [0-9]{10,10}$/.test(microtime())
         * returns 2: true
         *
         * @param getAsFloat
         * @returns {*}
         */
        function microtime(getAsFloat) {
            var s;
            var now;
            if (typeof performance !== 'undefined' && performance.now) {
                now = (performance.now() + performance.timing.navigationStart) / 1e3;
                if (getAsFloat) {
                    return now;
                }
                // Math.round(now)
                s = now | 0;
                return (Math.round((now - s) * 1e6) / 1e6) + ' ' + s;
            }
            else {
                now = (Date.now ? Date.now() : new Date().getTime()) / 1e3;
                if (getAsFloat) {
                    return now;
                }
                // Math.round(now)
                s = now | 0;
                return (Math.round((now - s) * 1e3) / 1e3) + ' ' + s;
            }
        }
        zanejs.microtime = microtime;
        /**
         * 将任何英文文本的日期时间描述解析为 Unix 时间戳
         *
         * example 1: strtotime('+1 day', 1129633200)
         * returns 1: 1129719600
         *
         * example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
         * returns 2: 1130425202
         *
         * example 3: strtotime('last month', 1129633200)
         * returns 3: 1127041200
         *
         * example 4: strtotime('2009-05-04 08:30:00 GMT')
         * returns 4: 1241425800
         *
         * example 5: strtotime('2009-05-04 08:30:00+00')
         * returns 5: 1241425800
         *
         * example 6: strtotime('2009-05-04 08:30:00+02:00')
         * returns 6: 1241418600
         *
         * example 7: strtotime('2009-05-04T08:30:00Z')
         * returns 7: 1241425800
         *
         * @param text
         * @param now
         * @returns {*}
         */
        function strtotime(text, now) {
            var parsed, match, today;
            var year, $date, days, ranges, len, times, regex, d;
            var i;
            var fail = false;
            if (!text) {
                return fail;
            }
            text = text.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ').replace(/[\t\r\n]/g, '').toLowerCase();
            // in contrast to php, js Date.parse function interprets:
            // dates given as yyyy-mm-dd as in timezone: UTC,
            // dates with "." or "-" as MDY instead of DMY
            // dates with two-digit years differently
            // etc...etc...
            // ...therefore we manually parse lots of common date formats
            var pattern = new RegExp([
                '^(\\d{1,4})',
                '([\\-\\.\\/:])',
                '(\\d{1,2})',
                '([\\-\\.\\/:])',
                '(\\d{1,4})',
                '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
                '(?:\\s([A-Z]+)?)?$'
            ].join(''));
            match = text.match(pattern);
            if (match && match[2] === match[4]) {
                if (match[1] > 1901) {
                    switch (match[2]) {
                        case '-':
                            // YYYY-M-D
                            if (match[3] > 12 || match[5] > 31) {
                                return fail;
                            }
                            d = new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        case '.':
                            // YYYY.M.D is not parsed by strtotime()
                            return fail;
                        case '/':
                            // YYYY/M/D
                            if (match[3] > 12 || match[5] > 31) {
                                return fail;
                            }
                            d = new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        default:
                            return fail;
                    }
                }
                else if (match[5] > 1901) {
                    switch (match[2]) {
                        case '-':
                            // D-M-YYYY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }
                            d = new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        case '.':
                            // D.M.YYYY
                            if (match[3] > 12 || match[1] > 31) {
                                return fail;
                            }
                            d = new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        case '/':
                            // M/D/YYYY
                            if (match[1] > 12 || match[3] > 31) {
                                return fail;
                            }
                            d = new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        default:
                            return fail;
                    }
                }
                else {
                    switch (match[2]) {
                        case '-':
                            // YY-M-D
                            if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                                return fail;
                            }
                            year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                            d = new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        case '.':
                            // D.M.YY or H.MM.SS
                            if (match[5] >= 70) {
                                // D.M.YY
                                if (match[3] > 12 || match[1] > 31) {
                                    return fail;
                                }
                                d = new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                                return d / 1000;
                            }
                            if (match[5] < 60 && !match[6]) {
                                // H.MM.SS
                                if (match[1] > 23 || match[3] > 59) {
                                    return fail;
                                }
                                today = new Date();
                                d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0);
                                return d / 1000;
                            }
                            // invalid format, cannot be parsed
                            return fail;
                        case '/':
                            // M/D/YY
                            if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                                return fail;
                            }
                            year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                            d = new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0);
                            return d / 1000;
                        case ':':
                            // HH:MM:SS
                            if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                                return fail;
                            }
                            today = new Date();
                            d = new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0);
                            return d / 1000;
                        default:
                            return fail;
                    }
                }
            }
            // other formats and "now" should be parsed by Date.parse()
            if (text === 'now') {
                return now === null || isNaN(now)
                    ? new Date().getTime() / 1000 | 0
                    : now | 0;
            }
            if (!isNaN(parsed = Date.parse(text))) {
                return parsed / 1000 | 0;
            }
            // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
            // not accept lower case characters, space, or shortened time zones.
            // Therefore, fix these problems and try again.
            // Examples:
            //   2015-04-15 20:33:59+02
            //   2015-04-15 20:33:59z
            //   2015-04-15t20:33:59+02:00
            pattern = new RegExp([
                '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
                '[ t]',
                '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
                '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
            ].join(''));
            match = text.match(pattern);
            if (match) {
                if (match[4] === 'z') {
                    match[4] = 'Z';
                }
                else if (match[4].match(/^([\+-][0-9]{2})$/)) {
                    match[4] = match[4] + ':00';
                }
                if (!isNaN(parsed = $date.parse(match[1] + 'T' + match[2] + match[4]))) {
                    return parsed / 1000 | 0;
                }
            }
            $date = now ? new Date(now * 1000) : new Date();
            days = {
                'sun': 0,
                'mon': 1,
                'tue': 2,
                'wed': 3,
                'thu': 4,
                'fri': 5,
                'sat': 6
            };
            ranges = {
                'yea': 'FullYear',
                'mon': 'Month',
                'day': 'Date',
                'hou': 'Hours',
                'min': 'Minutes',
                'sec': 'Seconds'
            };
            function lastNext(type, range, modifier) {
                var diff;
                var day = days[range];
                if (typeof day !== 'undefined') {
                    diff = day - $date.getDay();
                    if (diff === 0) {
                        diff = 7 * modifier;
                    }
                    else if (diff > 0 && type === 'last') {
                        diff -= 7;
                    }
                    else if (diff < 0 && type === 'next') {
                        diff += 7;
                    }
                    $date.setDate($date.getDate() + diff);
                }
            }
            function process(val) {
                var splt = val.split(' ');
                var type = splt[0];
                var range = splt[1].substring(0, 3);
                var typeIsNumber = /\d+/.test(type);
                var ago = splt[2] === 'ago';
                var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);
                if (typeIsNumber) {
                    num *= parseInt(type, 10);
                }
                if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
                    return $date['set' + ranges[range]]($date['get' + ranges[range]]() + num);
                }
                if (range === 'wee') {
                    return $date.setDate($date.getDate() + (num * 7));
                }
                if (type === 'next' || type === 'last') {
                    lastNext(type, range, num);
                }
                else if (!typeIsNumber) {
                    return false;
                }
                return true;
            }
            times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
                '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
                '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
            regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';
            match = text.match(new RegExp(regex, 'gi'));
            if (!match) {
                return fail;
            }
            for (i = 0, len = match.length; i < len; i++) {
                if (!process(match[i])) {
                    return fail;
                }
            }
            return ($date.getTime() / 1000);
        }
        zanejs.strtotime = strtotime;
        /**
         * 返回当前的 Unix 时间戳
         *
         * example 1: var $timeStamp = time()
         * example 1: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
         * returns 1: true
         *
         * @returns {number}
         */
        function time() {
            return Math.floor(new Date().getTime() / 1000);
        }
        zanejs.time = time;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * @class zane.DebugOutput
         */
        var DebugOutput = (function () {
            /**
             * 构造函数
             */
            function DebugOutput(id, enableFPS) {
                if (enableFPS === void 0) { enableFPS = false; }
                var e = document.getElementById(id);
                if (e == null) {
                    zanejs.debugInfoEnabled = false;
                    return;
                }
                this.debugRoot = e.parentNode;
                if (this.debugRoot) {
                    this.loadingRoot = document.createElement('div');
                    this.debugRoot.appendChild(this.loadingRoot);
                    var b = document.createTextNode('Loading...');
                    this.loadingRootText = b;
                    this.loadingRoot.appendChild(b);
                }
                if (enableFPS) {
                    this.enableFPSCounter();
                }
            }
            DebugOutput.prototype.enableFPSCounter = function () {
                if (this.fpsRoot != null) {
                    return;
                }
                this.fpsRoot = document.createElement('div');
                this.debugRoot.appendChild(this.fpsRoot);
                var a = document.createTextNode('FPS: 0');
                this.fpsRootText = a;
                this.fpsRoot.appendChild(a);
                this.frames = 0;
                this.lastTime = new Date().getTime();
            };
            DebugOutput.prototype.updatefps = function (suffix) {
                if (suffix === void 0) { suffix = null; }
                if (this.fpsRootText == null) {
                    return;
                }
                this.frames += 1;
                var b = new Date().getTime();
                if (b - this.lastTime > 1000) {
                    var fps = this.frames / (b - this.lastTime) * 1000;
                    var str = 'FPS: ' + fps.toFixed(2);
                    if (suffix != null) {
                        str += suffix;
                    }
                    this.fpsRootText.nodeValue = str;
                    this.lastTime = b;
                    this.frames = 0;
                }
            };
            DebugOutput.prototype.print = function (msg) {
                if (zanejs.debugInfoEnabled === false) {
                    return;
                }
                this.printInternal(msg, false);
            };
            DebugOutput.prototype.printError = function (msg, isHtml) {
                if (isHtml === void 0) { isHtml = false; }
                this.printInternal(msg, true, isHtml);
            };
            DebugOutput.prototype.printInternal = function (msg, debug, isHtml) {
                if (isHtml === void 0) { isHtml = false; }
                if (zanejs.debugInfoEnabled === false && debug !== true) {
                    return;
                }
                if (this.textRoot == null) {
                    this.textRoot = document.createElement('div');
                    this.textRoot.className = 'debug';
                    this.debugRoot.appendChild(this.textRoot);
                }
                if (isHtml) {
                    this.textRoot.appendChild(document.createElement('br'));
                    var a = document.createElement('div');
                    this.textRoot.appendChild(a);
                    a.innerHTML = msg;
                }
                else {
                    this.textRoot.appendChild(document.createElement('br'));
                    var c = document.createTextNode(msg);
                    this.textRoot.appendChild(c);
                }
            };
            return DebugOutput;
        }());
        zanejs.DebugOutput = DebugOutput;
        /**
         *
         * @type {boolean}
         */
        zanejs.debugInfoEnabled = true;
        /**
         *
         * @type {DebugOutput}
         */
        zanejs.debugOutput = null;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 空图片的base64数据
         * @type {string}
         */
        zanejs.emptyImageData = '' +
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2l' +
            'DQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjo' +
            'CMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+P' +
            'DwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBbl' +
            'CEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqA' +
            'AB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAA' +
            'OF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyX' +
            'YFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQW' +
            'HTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAH' +
            'HJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxU' +
            'opUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAux' +
            'sNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hIL' +
            'CPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqS' +
            'hnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx' +
            '4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVq' +
            'p1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZ' +
            'j8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNP' +
            'Tr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o' +
            '9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuh' +
            'Vo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyF' +
            'DpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7' +
            'ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F3' +
            '0N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ' +
            '4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F' +
            '5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMD' +
            'UzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7' +
            'cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1' +
            '+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g' +
            '7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA' +
            '/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0' +
            'dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qd' +
            'Oo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3' +
            'Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6' +
            'xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAA' +
            'HUwAADqYAAAOpgAABdvkl/FRgAAAKtJREFUeNrs2ksKgDAMBcBUekePo8fRU9YbpAspfjrZSjYDj5SHZTtai2T2NUr6/Yyh+xH5fsS9/SUmH' +
            'wAAAAAAMPOUlj8DPn/ne/siAAAAAAAAJp46+s7rA0QAAAAAAADoA/QBIgAAAAAAAN73Duj9H/D0ndYHiAAAAAAAABg29e93Xh8gAgAAAAAAI' +
            'H0H6ANEAAAAAAAA6AP0ASIAAAAAAADmmgsAAP//AwCuazpEOXa+fwAAAABJRU5ErkJggg==';
        /**
         * @type {HTMLElementTagNameMap[string]}
         */
        zanejs.emptyImageElement = document.createElement('img');
        zanejs.emptyImageElement.setAttribute('src', zanejs.emptyImageData);
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 空视频数据
         * @type {string}
         */
        zanejs.emptyVideoData = '' +
            'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpveb' +
            'ZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIw' +
            'MDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xO' +
            'jA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3Jhbm' +
            'dlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3F' +
            'wX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVy' +
            'bGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfY' +
            'mlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdX' +
            'Q9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0' +
            'wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9u' +
            'ZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zp' +
            'J6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHA' +
            'AAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAk' +
            'BnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkh' +
            'AANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcA' +
            'AAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plg' +
            'AMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGg' +
            'cAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn' +
            '/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoH' +
            'CEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAA' +
            'kBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPk' +
            'hAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgc' +
            'AAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6pl' +
            'gAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQG' +
            'gcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAA' +
            'ACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wAL' +
            'KCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA' +
            '0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQh' +
            'P/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAA' +
            'A1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAA' +
            'AAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAA' +
            'AAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3' +
            'QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdml' +
            'kZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAAB' +
            'AAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIA' +
            'AAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEA' +
            'Ar8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAE' +
            'AABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAA' +
            'AQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAA' +
            'AABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mA' +
            'AAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAA' +
            'AAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAA' +
            'OpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABA' +
            'AAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA' +
            '8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAA' +
            'ADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEA' +
            'AAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZ' +
            'AAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAA' +
            'UrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gA' +
            'ABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMs' +
            'dHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAA' +
            'AAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAA' +
            'AAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQA' +
            'AAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIA' +
            'BICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAA' +
            'QAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAA' +
            'QLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAA' +
            'ABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+' +
            'AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB' +
            '8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAA' +
            'AAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2l' +
            'sc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA=';
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         *
         * @param blob
         * @returns {Blob}
         */
        function auto_bom(blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
            }
            return blob;
        }
        zanejs.auto_bom = auto_bom;
        /**
         * 获取文件的后缀名
         * @param {string} filePath
         */
        function getExtension(filePath) {
            return filePath.split('.').pop();
        }
        zanejs.getExtension = getExtension;
        /**
         *
         * @param url
         * @returns {string}
         */
        function getFileNameFromUrl(url) {
            if (url) {
                return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
            }
            return '';
        }
        zanejs.getFileNameFromUrl = getFileNameFromUrl;
        /**
         * 给出一个包含有指向一个文件的全路径的字符串，本函数返回基本的文件名。
         * @param path - 一个路径。在 Windows 中，斜线（/）和反斜线（\）都可以用作目录分隔符。在其它环境下是斜线（/）。
         * @param suffix - 如果文件名是以 suffix 结束的，那这一部分也会被去掉。
         * example 1: basename('/www/site/home.htm', '.htm')
         * returns 1: 'home'
         *
         * example 2: basename('ecra.php?p=1')
         * returns 2: 'ecra.php?p=1'
         *
         * example 3: basename('/some/path/')
         * returns 3: 'path'
         *
         * example 4: basename('/some/path_ext.ext/','.ext')
         * returns 4: 'path_ext'
         *
         * @returns {string}
         */
        function basename(path, suffix) {
            if (suffix === void 0) { suffix = null; }
            var b = path;
            var lastChar = b.charAt(b.length - 1);
            if (lastChar === '/' || lastChar === '\\') {
                b = b.slice(0, -1);
            }
            b = b.replace(/^.*[\/\\]/g, '');
            if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
                b = b.substr(0, b.length - suffix.length);
            }
            return b;
        }
        zanejs.basename = basename;
        /**
         * 给出一个包含有指向一个文件的全路径的字符串，本函数返回去掉文件名后的目录名。
         * @param path - 一个路径。在 Windows 中，斜线（/）和反斜线（\）都可以用作目录分隔符。在其它环境下是斜线（/）。
         * example 1: dirname('/etc/passwd')
         * returns 1: '/etc'
         * example 2: dirname('c:/Temp/x')
         * returns 2: 'c:/Temp'
         * example 3: dirname('/dir/test/')
         * returns 3: '/dir'
         * @returns {string}
         */
        function dirname(path) {
            return path.replace(/\\/g, '/')
                .replace(/\/[^\/]*\/?$/, '');
        }
        zanejs.dirname = dirname;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 调用回调函数，并把一个数组参数作为回调函数的参数
         * 把第一个参数作为回调函数（callback）调用，把参数数组作（param_arr）为回调函数的的参数传入。
         *
         * example 1: call_user_func_array('isNaN', ['a'])
         * returns 1: true
         *
         * example 2: call_user_func_array('isNaN', [1])
         * returns 2: false
         *
         * @param cb - 被调用的回调函数。
         * @param parameters - 要被传入回调函数的数组，这个数组得是索引数组。
         * @returns {*} 返回回调函数的结果。如果出错的话就返回FALSE
         */
        function call_user_func_array(cb, parameters) {
            var func;
            var scope = null;
            var validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
            if (typeof cb === 'string') {
                if (typeof window[cb] === 'function') {
                    func = window[cb];
                }
                else if (cb.match(validJSFunctionNamePattern)) {
                    func = (new Function(null, 'return ' + cb)());
                }
            }
            else if (Object.prototype.toString.call(cb) === '[object Array]') {
                if (typeof cb[0] === 'string') {
                    if (cb[0].match(validJSFunctionNamePattern)) {
                        func = eval(cb[0] + '[\'' + cb[1] + '\']'); // eslint-disable-line no-eval
                    }
                }
                else {
                    func = cb[0][cb[1]];
                }
                if (typeof cb[0] === 'string') {
                    if (typeof window[cb[0]] === 'function') {
                        scope = window[cb[0]];
                    }
                    else if (cb[0].match(validJSFunctionNamePattern)) {
                        scope = eval(cb[0]); // eslint-disable-line no-eval
                    }
                }
                else if (typeof cb[0] === 'object') {
                    scope = cb[0];
                }
            }
            else if (typeof cb === 'function') {
                func = cb;
            }
            if (typeof func !== 'function') {
                throw new Error(func + ' is not a valid function');
            }
            return func.apply(scope, parameters);
        }
        zanejs.call_user_func_array = call_user_func_array;
        /**
         * 把第一个参数作为回调函数调用
         * 第一个参数 callback 是被调用的回调函数，其余参数是回调函数的参数。
         *
         * example 1: call_user_func('isNaN', 'a')
         * returns 1: true
         *
         * @param cb
         * @param parameters
         * @returns {*}
         */
        function call_user_func(cb, parameters) {
            parameters = Array.prototype.slice.call(arguments, 1);
            return call_user_func_array(cb, parameters);
        }
        zanejs.call_user_func = call_user_func;
        /**
         * 如果给定的函数已经被定义就返回 TRUE
         * 在已经定义的函数列表（包括系统自带的函数和用户自定义的函数）中查找 funcName。
         *
         * example 1: function_exists('isFinite')
         * returns 1: true
         *
         * @param funcName
         * @returns {boolean}
         */
        function function_exists(funcName) {
            if (typeof funcName === 'string') {
                funcName = window[funcName];
            }
            return typeof funcName === 'function';
        }
        zanejs.function_exists = function_exists;
        /**
         *
         * example 1: var $f = create_function('a, b', 'return (a + b)')
         * example 1: $f(1, 2)
         * returns 1: 3
         *
         * @param args
         * @param code
         * @returns {*}
         */
        function create_function(args, code) {
            try {
                return Function.apply(null, args.split(',').concat(code));
            }
            catch (e) {
                return false;
            }
        }
        zanejs.create_function = create_function;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 添加样式
         * @param {string|Element} el
         * @param {string} className
         */
        function html_addClass(el, className) {
            if (typeof el === 'string') {
                el = document.querySelectorAll(el);
            }
            var els = (el instanceof NodeList) ? [].slice.call(el) : [el];
            els.forEach(function (e) {
                if (html_hasClass(e, className)) {
                    return;
                }
                if (e.classList) {
                    e.classList.add(className);
                }
                else {
                    e.className += ' ' + className;
                }
            });
        }
        zanejs.html_addClass = html_addClass;
        /**
         * 移除样式
         * @param {string|Element|NodeList|Selection} el
         * @param {string} className
         */
        function html_removeClass(el, className) {
            if (typeof el === 'string') {
                el = document.querySelectorAll(el);
            }
            var els = (el instanceof NodeList) ? [].slice.call(el) : [el];
            els.forEach(function (e) {
                if (html_hasClass(e, className)) {
                    if (e.classList) {
                        e.classList.remove(className);
                    }
                    else {
                        e.className = e.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                    }
                }
            });
        }
        zanejs.html_removeClass = html_removeClass;
        /**
         * 是否存在样式
         * @param {*} el
         * @param {string} className
         * @returns {boolean}
         */
        function html_hasClass(el, className) {
            if (typeof el === 'string') {
                el = document.querySelector(el);
            }
            if (el.classList) {
                return el.classList.contains(className);
            }
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        zanejs.html_hasClass = html_hasClass;
        /**
         *
         * @param {*} el
         * @param {string} className
         */
        function html_toggleClass(el, className) {
            if (typeof el === 'string') {
                el = document.querySelector(el);
            }
            var flag = html_hasClass(el, className);
            if (flag) {
                html_removeClass(el, className);
            }
            else {
                html_addClass(el, className);
            }
            return flag;
        }
        zanejs.html_toggleClass = html_toggleClass;
        /**
         *
         * @param {Element} newEl
         * @param {Element} targetEl
         */
        function html_insertAfter(newEl, targetEl) {
            var parent = targetEl.parentNode;
            if (parent.lastChild === targetEl) {
                parent.appendChild(newEl);
            }
            else {
                parent.insertBefore(newEl, targetEl.nextSibling);
            }
        }
        zanejs.html_insertAfter = html_insertAfter;
        /**
         *
         * @param {*} el
         */
        function html_remove(el) {
            if (typeof el === 'string') {
                [].forEach.call(document.querySelectorAll(el), function (node) {
                    node.parentNode.removeChild(node);
                });
            }
            else if (el.parentNode) {
                // it's an Element
                el.parentNode.removeChild(el);
            }
            else if (el instanceof NodeList) {
                // it's an array of elements
                [].forEach.call(el, function (node) {
                    node.parentNode.removeChild(node);
                });
            }
            else {
                throw new Error('you can only pass Element, array of Elements or query string as argument');
            }
        }
        zanejs.html_remove = html_remove;
        /**
         *
         * @returns {HTMLElement|number}
         */
        function getDocumentScrollTop() {
            return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        }
        zanejs.getDocumentScrollTop = getDocumentScrollTop;
        /**
         *
         * @param {number} value
         * @returns {number}
         */
        function setDocumentScrollTop(value) {
            window.scrollTo(0, value);
            return value;
        }
        zanejs.setDocumentScrollTop = setDocumentScrollTop;
        /**
         *
         * @param {HTMLElement} el
         * @returns {number}
         */
        function outerHeight(el) {
            return el.offsetHeight;
        }
        zanejs.outerHeight = outerHeight;
        /**
         *
         * @param {HTMLElement} el
         * @returns {number}
         */
        function outerHeightWithMargin(el) {
            var height = el.offsetHeight;
            var style = getComputedStyle(el);
            height += (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
            return height;
        }
        zanejs.outerHeightWithMargin = outerHeightWithMargin;
        /**
         *
         * @param {HTMLElement} el
         * @returns {number}
         */
        function outerWidth(el) {
            return el.offsetWidth;
        }
        zanejs.outerWidth = outerWidth;
        /**
         *
         * @param {HTMLElement} el
         * @returns {number}
         */
        function outerWidthWithMargin(el) {
            var width = el.offsetWidth;
            var style = getComputedStyle(el);
            width += (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
            return width;
        }
        zanejs.outerWidthWithMargin = outerWidthWithMargin;
        /**
         *
         * @param {HTMLElement} el
         * @returns {CSSStyleDeclaration}
         */
        function getComputedStyles(el) {
            return el.ownerDocument.defaultView.getComputedStyle(el, null);
        }
        zanejs.getComputedStyles = getComputedStyles;
        /**
         *
         * @param {HTMLElement} el
         * @param {string} att
         * @returns {string|CSSStyleDeclaration}
         */
        function getComputedStyle(el, att) {
            if (att === void 0) { att = null; }
            var win = el.ownerDocument.defaultView;
            var computed = win.getComputedStyle(el, null);
            return att ? computed[att] : computed;
        }
        zanejs.getComputedStyle = getComputedStyle;
        /**
         *
         * @param {HTMLElement} el
         * @returns {{x:number,y:number}}
         */
        function getElementOffset(el) {
            var node = el, left = node.offsetLeft, top = node.offsetTop;
            node = node.parentElement;
            do {
                var styles = getComputedStyle(node);
                if (styles) {
                    var position = styles.getPropertyValue('position');
                    left -= node.scrollLeft;
                    top -= node.scrollTop;
                    if (/relative|absolute|fixed/.test(position)) {
                        left += parseInt(styles.getPropertyValue('border-left-width'), 10);
                        top += parseInt(styles.getPropertyValue('border-top-width'), 10);
                        left += node.offsetLeft;
                        top += node.offsetTop;
                    }
                    node = position === 'fixed' ? null : node.parentElement;
                }
                else {
                    node = node.parentElement;
                }
            } while (node);
            return { x: left, y: top };
        }
        zanejs.getElementOffset = getElementOffset;
        /**
         *
         * @param el
         * @returns {{x:number,y:number}}
         */
        function getElementPosition(el) {
            var p = { x: 0, y: 0 };
            if (el) {
                p.x = el.offsetLeft;
                p.y = el.offsetTop;
            }
            return p;
        }
        zanejs.getElementPosition = getElementPosition;
        var reUnit = /width|height|top|left|right|bottom|margin|padding/i;
        /**
         *
         * @param node
         * @param att
         * @param val
         * @param style
         */
        function setStyle(node, att, val, style) {
            style = style || node.style;
            if (style) {
                if (val === null || val === '') {
                    val = '';
                }
                else if (!isNaN(Number(val)) && reUnit.test(att)) {
                    val += 'px';
                }
                if (att === '') {
                    att = 'cssText';
                    val = '';
                }
                style[att] = val;
            }
        }
        zanejs.setStyle = setStyle;
        /**
         *
         * @param {HTMLElement} el
         * @param {Object} hash
         */
        function setStyles(el, hash) {
            var _this = this;
            var HAS_CSS_TEXT_FEATURE = (typeof (el.style.cssText) !== 'undefined');
            function trim(str) {
                return str.replace(/^\s+|\s+$/g, '');
            }
            var originStyleText;
            var originStyleObj = {};
            if (HAS_CSS_TEXT_FEATURE) {
                originStyleText = el.style.cssText;
            }
            else {
                originStyleText = el.getAttribute('style');
            }
            originStyleText.split(';').forEach(function (item) {
                if (item.indexOf(':') !== -1) {
                    var obj = item.split(':');
                    originStyleObj[trim(obj[0])] = trim(obj[1]);
                }
            });
            var styleObj = {};
            Object.keys(hash).forEach(function (item) {
                _this.setStyle(el, item, hash[item], styleObj);
            });
            var mergedStyleObj = zanejs.assign(originStyleObj, styleObj);
            var styleText = Object.keys(mergedStyleObj)
                .map(function (item) { return item + ': ' + mergedStyleObj[item] + ';'; })
                .join(' ');
            if (HAS_CSS_TEXT_FEATURE) {
                el.style.cssText = styleText;
            }
            else {
                el.setAttribute('style', styleText);
            }
        }
        zanejs.setStyles = setStyles;
        /**
         *
         * @param el
         * @param att
         * @param style
         * @returns {string}
         */
        function getStyle(el, att, style) {
            if (style === void 0) { style = null; }
            style = style || el.style;
            var val = '';
            if (style) {
                val = style[att];
                if (val === '') {
                    val = this.getComputedStyle(el, att);
                }
            }
            return val;
        }
        zanejs.getStyle = getStyle;
        /**
         *
         * @param {string} selector
         * @returns {Element|{}}
         */
        function getElement(selector) {
            return document.querySelector(selector) || {};
        }
        zanejs.getElement = getElement;
        /**
         *
         * @param {string} selector
         * @returns {NodeListOf<Element>|{}}
         */
        function getAllElement(selector) {
            return document.querySelectorAll(selector) || {};
        }
        zanejs.getAllElement = getAllElement;
        var simpleSelectorRE = /^[\w-]*$/;
        /**
         *
         * @param el
         * @param selector
         * @returns {Array}
         */
        function findElement(el, selector) {
            var found, maybeID = selector[0] === '#', maybeClass = !maybeID && selector[0] === '.', nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = simpleSelectorRE.test(nameOnly);
            if (zanejs.isDocument(el) && isSimple && maybeID) {
                if (found = el.getElementById(nameOnly)) {
                    return [found];
                }
                else {
                    return [];
                }
            }
            else if (el.nodeType !== 1 && el.nodeType !== 9) {
                return [];
            }
            else {
                var result = void 0;
                if (isSimple && !maybeID) {
                    if (maybeClass) {
                        result = el.getElementsByClassName(nameOnly);
                    }
                    else {
                        result = el.getElementsByTagName(selector);
                    }
                }
                else {
                    result = el.querySelectorAll(selector);
                }
                return [].slice.call(result);
            }
        }
        zanejs.findElement = findElement;
        /**
         *
         * @param {*} el
         * @param {boolean} show
         * @private
         */
        function _showHide(el, show) {
            if (typeof el === 'string') {
                el = document.querySelectorAll(el);
            }
            var els = (el instanceof NodeList) ? [].slice.call(el) : [el];
            var display;
            var values = [];
            if (els.length === 0) {
                return;
            }
            els.forEach(function (e, index) {
                if (e.style) {
                    display = e.style.display;
                    if (show) {
                        if (display === 'none') {
                            values[index] = 'block';
                        }
                    }
                    else {
                        if (display !== 'none') {
                            values[index] = 'none';
                        }
                    }
                }
            });
            els.forEach(function (e, index) {
                if (values[index] !== null) {
                    els[index].style.display = values[index];
                }
            });
        }
        /**
         *
         * @param {string|HTMLElement|NodeList} elements
         */
        function html_show(elements) {
            _showHide(elements, true);
        }
        zanejs.html_show = html_show;
        /**
         *
         * @param {string|HTMLElement|NodeList} elements
         */
        function html_hide(elements) {
            _showHide(elements, false);
        }
        zanejs.html_hide = html_hide;
        /**
         *
         * @param element
         */
        function html_toggle(element) {
            if (element.style.display === 'none') {
                html_show(element);
            }
            else {
                html_hide(element);
            }
        }
        zanejs.html_toggle = html_toggle;
        /**
         *
         * @param {HTMLElement} el
         * @returns {number}
         */
        function element_width(el) {
            var styles = getComputedStyles(el);
            var width = parseFloat(styles.width.indexOf('px') !== -1 ? styles.width : '0');
            var boxSizing = styles.boxSizing || 'content-box';
            if (boxSizing === 'border-box') {
                return width;
            }
            var borderLeftWidth = parseFloat(styles.borderLeftWidth);
            var borderRightWidth = parseFloat(styles.borderRightWidth);
            var paddingLeft = parseFloat(styles.paddingLeft);
            var paddingRight = parseFloat(styles.paddingRight);
            return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
        }
        zanejs.element_width = element_width;
        /**
         *
         * @param el
         * @returns {number}
         */
        function element_height(el) {
            var styles = getComputedStyles(el);
            var height = parseFloat(styles.height.indexOf('px') !== -1 ? styles.height : '0');
            var boxSizing = styles.boxSizing || 'content-box';
            if (boxSizing === 'border-box') {
                return height;
            }
            var borderTopWidth = parseFloat(styles.borderTopWidth);
            var borderBottomWidth = parseFloat(styles.borderBottomWidth);
            var paddingTop = parseFloat(styles.paddingTop);
            var paddingBottom = parseFloat(styles.paddingBottom);
            return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
        }
        zanejs.element_height = element_height;
        /**
         *
         * @param listNode
         * @returns {Array}
         */
        function listToArray(listNode) {
            try {
                return Array.prototype.slice.call(listNode);
            }
            catch (e) {
                var array = [], i = 0, length_1 = listNode.length;
                for (; i < length_1; i++) {
                    array[i] = listNode[i];
                }
                return array;
            }
        }
        zanejs.listToArray = listToArray;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var lastErrorJson = 0;
        /**
         * 对 JSON 格式的字符串进行解码
         * @param jsonStr - 待解码的 json string 格式的字符串。
         * @returns {*}
         */
        function json_decode(jsonStr) {
            if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
                try {
                    return JSON.parse(jsonStr);
                }
                catch (err) {
                    if (!(err instanceof SyntaxError)) {
                        throw new Error('Unexpected error type in json_decode()');
                    }
                    lastErrorJson = 4;
                    return null;
                }
            }
            var chars = [
                '\u0000',
                '\u00ad',
                '\u0600-\u0604',
                '\u070f',
                '\u17b4',
                '\u17b5',
                '\u200c-\u200f',
                '\u2028-\u202f',
                '\u2060-\u206f',
                '\ufeff',
                '\ufff0-\uffff'
            ].join('');
            var cx = new RegExp('[' + chars + ']', 'g');
            var j;
            var text = jsonStr;
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            var m = (/^[\],:{}\s]*$/)
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
            if (m) {
                j = eval('(' + text + ')');
                return j;
            }
            lastErrorJson = 4;
            return null;
        }
        zanejs.json_decode = json_decode;
        /**
         * 对变量进行 JSON 编码
         *
         * example 1: json_encode('Kevin')
         * returns 1: '"Kevin"'
         *
         * @param mixedVal
         * @returns {*}
         */
        function json_encode(mixedVal) {
            var retVal;
            try {
                if (typeof JSON === 'object' && typeof JSON.stringify === 'function') {
                    // Errors will not be caught here if our own equivalent to resource
                    retVal = JSON.stringify(mixedVal);
                    if (retVal === undefined) {
                        throw new SyntaxError('json_encode');
                    }
                    return retVal;
                }
                var value = mixedVal;
                var quote_1 = function (str) {
                    var escapeChars = [
                        '\u0000-\u001f',
                        '\u007f-\u009f',
                        '\u00ad',
                        '\u0600-\u0604',
                        '\u070f',
                        '\u17b4',
                        '\u17b5',
                        '\u200c-\u200f',
                        '\u2028-\u202f',
                        '\u2060-\u206f',
                        '\ufeff',
                        '\ufff0-\uffff'
                    ].join('');
                    var escapable = new RegExp('[\\"' + escapeChars + ']', 'g');
                    var meta = {
                        // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"': '\\"',
                        '\\': '\\\\'
                    };
                    escapable.lastIndex = 0;
                    return escapable.test(str) ? '"' + str.replace(escapable, function (a) {
                        var c = meta[a];
                        return typeof c === 'string' ? c : '\\u' + ('0000' +
                            a
                                .charCodeAt(0)
                                .toString(16))
                            .slice(-4);
                    }) + '"' : '"' + str + '"';
                };
                var _str_1 = function (key, holder) {
                    var gap = '';
                    var indent = '    ';
                    // The loop counter.
                    var i = 0;
                    // The member key.
                    var k = '';
                    // The member value.
                    var v = '';
                    var length = 0;
                    var mind = gap;
                    var partial = [];
                    var $value = holder[key];
                    // If the value has a toJSON method, call it to obtain a replacement value.
                    if ($value && typeof $value === 'object' && typeof $value.toJSON === 'function') {
                        $value = $value.toJSON(key);
                    }
                    // What happens next depends on the value's type.
                    var _type = typeof $value;
                    switch (_type) {
                        case 'string':
                            return quote_1($value);
                        case 'number':
                            // JSON numbers must be finite. Encode non-finite numbers as null.
                            return isFinite($value) ? String($value) : 'null';
                        case 'boolean':
                        case 'null':
                            // If the value is a boolean or null, convert it to a string. Note:
                            // typeof null does not produce 'null'. The case is included here in
                            // the remote chance that this gets fixed someday.
                            return String($value);
                        case 'object':
                            // If the type is 'object', we might be dealing with an object or an array or
                            // null.
                            // Due to a specification blunder in ECMAScript, typeof null is 'object',
                            // so watch out for that case.
                            if (!$value) {
                                return 'null';
                            }
                            // Make an array to hold the partial results of stringifying this object value.
                            gap += indent;
                            partial = [];
                            // Is the value an array?
                            if (Object.prototype.toString.apply($value) === '[object Array]') {
                                // The value is an array. Stringify every element. Use null as a placeholder
                                // for non-JSON values.
                                length = $value.length;
                                for (i = 0; i < length; i += 1) {
                                    partial[i] = _str_1(i, $value) || 'null';
                                }
                                // Join all of the elements together, separated with commas, and wrap them in
                                // brackets.
                                v = partial.length === 0 ? '[]' : gap
                                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                                    : '[' + partial.join(',') + ']';
                                gap = mind;
                                return v;
                            }
                            // Iterate through all of the keys in the object.
                            for (k in $value) {
                                if (Object.hasOwnProperty.call($value, k)) {
                                    v = _str_1(k, $value);
                                    if (v) {
                                        partial.push(quote_1(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                            // Join all of the member texts together, separated with commas,
                            // and wrap them in braces.
                            v = partial.length === 0 ? '{}' : gap
                                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                                : '{' + partial.join(',') + '}';
                            gap = mind;
                            return v;
                        case 'undefined':
                        case 'function':
                        default:
                            throw new SyntaxError('json_encode');
                    }
                };
                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.
                return _str_1('', {
                    '': value
                });
            }
            catch (err) {
                if (!(err instanceof SyntaxError)) {
                    throw new Error('Unexpected error type in json_encode()');
                }
                // usable by json_last_error()
                lastErrorJson = 4;
                return null;
            }
        }
        zanejs.json_encode = json_encode;
        /**
         * 返回最后发生的错误
         * 如果有，返回 JSON 编码解码时最后发生的错误。
         * @returns {number}
         */
        function json_last_error() {
            return lastErrorJson;
        }
        zanejs.json_last_error = json_last_error;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         *
         * example 1: inet_ntop('\x7F\x00\x00\x01')
         * returns 1: '127.0.0.1'
         *
         * example 2: inet_ntop('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\1')
         * returns 2: '::1'
         *
         * @param a
         * @returns {*}
         */
        function inet_ntop(a) {
            var i = 0;
            var m = '';
            var c = [];
            a += '';
            if (a.length === 4) {
                // IPv4
                return [
                    a.charCodeAt(0),
                    a.charCodeAt(1),
                    a.charCodeAt(2),
                    a.charCodeAt(3)
                ].join('.');
            }
            else if (a.length === 16) {
                // IPv6
                for (i = 0; i < 16; i++) {
                    c.push(((a.charCodeAt(i++) << 8) + a.charCodeAt(i)).toString(16));
                }
                return c.join(':')
                    .replace(/((^|:)0(?=:|$))+:?/g, function (t) {
                    m = (t.length > m.length) ? t : m;
                    return t;
                })
                    .replace(m || ' ', '::');
            }
            else {
                return false;
            }
        }
        zanejs.inet_ntop = inet_ntop;
        /**
         *
         * example 1: inet_pton('::')
         * returns 1: '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
         *
         * example 2: inet_pton('127.0.0.1')
         * returns 2: '\x7F\x00\x00\x01'
         *
         * @param a
         * @returns {*}
         */
        function inet_pton(a) {
            var r, m, x, i, j;
            var f = String.fromCharCode;
            // IPv4
            m = a.match(/^(?:\d{1,3}(?:\.|$)){4}/);
            if (m) {
                m = m[0].split('.');
                m = f(m[0]) + f(m[1]) + f(m[2]) + f(m[3]);
                // Return if 4 bytes, otherwise false.
                return m.length === 4 ? m : false;
            }
            r = /^((?:[\da-f]{1,4}(?::|)){0,8})(::)?((?:[\da-f]{1,4}(?::|)){0,8})$/;
            // IPv6
            m = a.match(r);
            if (m) {
                // Translate each hexadecimal value.
                for (j = 1; j < 4; j++) {
                    // Indice 2 is :: and if no length, continue.
                    if (j === 2 || m[j].length === 0) {
                        continue;
                    }
                    m[j] = m[j].split(':');
                    for (i = 0; i < m[j].length; i++) {
                        m[j][i] = parseInt(m[j][i], 16);
                        // Would be NaN if it was blank, return false.
                        if (isNaN(m[j][i])) {
                            // Invalid IP.
                            return false;
                        }
                        m[j][i] = f(m[j][i] >> 8) + f(m[j][i] & 0xFF);
                    }
                    m[j] = m[j].join('');
                }
                x = m[1].length + m[3].length;
                if (x === 16) {
                    return m[1] + m[3];
                }
                else if (x < 16 && m[2].length > 0) {
                    return m[1] + (new Array(16 - x + 1))
                        .join('\x00') + m[3];
                }
            }
            return false;
        }
        zanejs.inet_pton = inet_pton;
        /**
         * 将一个IPV4的字符串互联网协议转换成数字格式
         *
         * example 1: ip2long('192.0.34.166')
         * returns 1: 3221234342
         *
         * example 2: ip2long('0.0xABCDEF')
         * returns 2: 11259375
         *
         * example 3: ip2long('255.255.255.256')
         * returns 3: false
         *
         * @param argIP
         * @returns {*}
         */
        function ip2long(argIP) {
            var i = 0;
            var pattern = new RegExp([
                '^([1-9]\\d*|0[0-7]*|0x[\\da-f]+)',
                '(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?',
                '(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?',
                '(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?$'
            ].join(''), 'i');
            var result = argIP.match(pattern); // Verify argIP format.
            if (!result) {
                // Invalid format.
                return false;
            }
            // Reuse argIP variable for component counter.
            result[0] = 0;
            for (i = 1; i < 5; i += 1) {
                result[0] += !!((result[i] || '').length);
                result[i] = parseInt(result[i], 10) || 0;
            }
            // Continue to use argIP for overflow values.
            // PHP does not allow any component to overflow.
            result.push(256, 256, 256, 256);
            // Recalculate overflow of last component supplied to make up for missing components.
            result[4 + result[0]] *= Math.pow(256, 4 - result[0]);
            if (result[1] >= result[5] ||
                result[2] >= result[6] ||
                result[3] >= result[7] ||
                result[4] >= result[8]) {
                return false;
            }
            return result[1] * (result[0] === 1 ? 1 : 16777216) +
                result[2] * (result[0] <= 2 ? 1 : 65536) +
                result[3] * (result[0] <= 3 ? 1 : 256) +
                result[4] * 1;
        }
        zanejs.ip2long = ip2long;
        /**
         * 将一个数字转换成IPV4的字符串互联网协议格式
         *
         * example 1: long2ip( 3221234342 )
         * returns 1: '192.0.34.166'
         *
         * @param ip
         * @returns {*}
         */
        function long2ip(ip) {
            if (!isFinite(ip)) {
                return false;
            }
            return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
        }
        zanejs.long2ip = long2ip;
        /**
         * 是否加密协议
         * @returns {boolean}
         */
        function isSecure() {
            return location.protocol === 'https:';
        }
        zanejs.isSecure = isSecure;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        var NoSleep = (function () {
            function NoSleep() {
                var _this = this;
                if (!zanejs.isOldIOS) {
                    this.video = document.createElement('video');
                    this.video.setAttribute('playsinline', 'true');
                    this.video.setAttribute('type', 'video/mp4');
                    this.video.setAttribute('x5-video-player-type', 'h5');
                    this.video.setAttribute('src', zanejs.emptyVideoData);
                    this.video.addEventListener('timeupdate', function () {
                        if (_this.video.currentTime > 0.5) {
                            _this.video.currentTime = Math.random();
                        }
                    });
                }
            }
            NoSleep.prototype.enable = function () {
                if (zanejs.isOldIOS) {
                    this.disable();
                    this.timer = window.setInterval(function () {
                        window.location.href = '/';
                        window.setTimeout(window.stop, 0);
                    }, 15000);
                }
                else {
                    this.video.play();
                }
            };
            NoSleep.prototype.disable = function () {
                if (zanejs.isOldIOS) {
                    if (this.timer) {
                        window.clearInterval(this.timer);
                        this.timer = null;
                    }
                }
                else {
                    this.video.pause();
                }
            };
            return NoSleep;
        }());
        zanejs.NoSleep = NoSleep;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 格式化需要在前面补零的数值。
         * addLeadingZeroes(4); // "04"
         * addLeadingZeroes(5, 3); // "0005"
         * addLeadingZeroes(10, 1); // "10"
         * addLeadingZeroes(10, 2); // "010"
         * @param n
         * @param zeroes
         * @returns {string}
         */
        function addLeadingZeroes(n, zeroes) {
            if (zeroes === void 0) { zeroes = 1; }
            var out = n + '';
            if (n < 0 || zeroes < 1) {
                return out;
            }
            while (out.length < zeroes + 1) {
                out = '0' + out;
            }
            return out;
        }
        zanejs.addLeadingZeroes = addLeadingZeroes;
        /**
         * 约束一个值在 min 和 max 的数字界限内。
         * clamp(3, 2, 5);   // 返回 3，因为它在 2 到 5 的范围之内
         * clamp(20, 2, 5);  // 返回 5，因为它超出了上限 5
         * clamp(-5, 2, 5);  // 返回 2，因为它超出了下线 2
         * @param val
         * @param min
         * @param max
         * @returns {number}
         */
        function clamp(val, min, max) {
            return Math.max(Math.min(val, max), min);
        }
        zanejs.clamp = clamp;
        /**
         * 从 begin 和 end 两个数字之间创建均匀分布的数字递增。
         * createStepsBetween(0, 5, 4); // Traces 1,2,3,4
         * createStepsBetween(1, 3, 3); // Traces 1.5,2,2.5
         * @param begin
         * @param end
         * @param steps
         * @returns {number[]}
         */
        function createStepsBetween(begin, end, steps) {
            steps++;
            var i = 0;
            var stepsBetween = [];
            var increment = (end - begin) / steps;
            while (++i < steps) {
                stepsBetween.push((i * increment) + begin);
            }
            return stepsBetween;
        }
        zanejs.createStepsBetween = createStepsBetween;
        /**
         * 确定数值 value 包括在 firstValue 和 secondValue 的范围内。
         *  isBetween(3, 0, 5); // Traces true
         *  isBetween(7, 0, 5); // Traces false
         * @param value
         * @param firstValue
         * @param secondValue
         * @returns {boolean}
         */
        function isBetween(value, firstValue, secondValue) {
            return !(value < Math.min(firstValue, secondValue) || value > Math.max(firstValue, secondValue));
        }
        zanejs.isBetween = isBetween;
        /**
         * 是否等于0
         * @param value
         * @returns {boolean}
         */
        function isZero(value) {
            return (value < zanejs.TOLERANCE) && (value > -zanejs.TOLERANCE);
        }
        zanejs.isZero = isZero;
        /**
         * 是否等于1
         * @param value
         * @returns {boolean}
         */
        function isOne(value) {
            return (value + zanejs.TOLERANCE >= 1) && (value - zanejs.TOLERANCE <= 1);
        }
        zanejs.isOne = isOne;
        /**
         * 根据指定的精确度，确定两个数值是相等的。
         * isEqual(3.042, 3, 0); // Traces false
         * isEqual(3.042, 3, 0.5); // Traces true
         * @param val1
         * @param val2
         * @param precision
         * @returns {boolean}
         */
        function isEqual(val1, val2, precision) {
            if (precision === void 0) { precision = 0; }
            return Math.abs(val1 - val2) <= Math.abs(precision);
        }
        zanejs.isEqual = isEqual;
        /**
         * 是否偶数
         * @param value
         * @returns {boolean}
         */
        function isEven(value) {
            return (value & 1) === 0;
        }
        zanejs.isEven = isEven;
        /**
         * 是否整数
         * @param value
         * @returns {boolean}
         */
        function isInteger(value) {
            return (value % 1) === 0;
        }
        zanejs.isInteger = isInteger;
        /**
         * 是否负数
         * @param value
         * @returns {boolean}
         */
        function isNegative(value) {
            return !isPositive(value);
        }
        zanejs.isNegative = isNegative;
        /**
         * 是否奇数
         * @param value
         * @returns {boolean}
         */
        function isOdd(value) {
            return !isEven(value);
        }
        zanejs.isOdd = isOdd;
        /**
         * 是否正数
         * @param value
         * @returns {boolean}
         */
        function isPositive(value) {
            return value >= 0;
        }
        zanejs.isPositive = isPositive;
        /**
         *
         * @param args
         */
        function isPowerOf2() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = true;
            for (var i = 0, l = args.length; i < l; ++i) {
                var num = args[i];
                if (num <= 0 || (num & (num - 1)) !== 0) {
                    result = false;
                    break;
                }
            }
            return result;
        }
        zanejs.isPowerOf2 = isPowerOf2;
        /**
         * 是否素数。
         * @param value
         * @returns {boolean}
         */
        function isPrime(value) {
            if (value === 1 || value === 2) {
                return true;
            }
            if (isEven(value)) {
                return false;
            }
            var s = Math.sqrt(value);
            for (var i = 3; i <= s; i++) {
                if (value % i === 0) {
                    return false;
                }
            }
            return true;
        }
        zanejs.isPrime = isPrime;
        /**
         * 随机地生成在最小和最大（含）之间的范围内的整数。
         * 如果 min 比 max 数值要大的话，会自动交换 min 和 max 的数值。
         * @param min 最小的随机数
         * @param max 最大的随机数
         * @returns {number} 返回一个在 min 与 max 之间的整数值。
         */
        function randomIntegerWithinRange(min, max) {
            return Math.round(randomWithinRange(min, max));
        }
        zanejs.randomIntegerWithinRange = randomIntegerWithinRange;
        /**
         * 随机地生成在最小和最大（含）之间的范围内的数。
         * 如果 min 比 max 数值要大的话，会自动交换 min 和 max 的数值。
         * @param min 最小的随机数
         * @param max 最大的随机数
         * @returns {number} 返回一个在 min 与 max 之间的数值。
         */
        function randomWithinRange(min, max) {
            if (min > max) {
                var temp = max;
                max = min;
                min = temp;
            }
            return min + (Math.random() * (max - min));
        }
        zanejs.randomWithinRange = randomWithinRange;
        /**
         * 随机正负符号
         * @param chance 几率分界值。
         * @returns {number} 返回 1 或 -1
         */
        function randomSign(chance) {
            if (chance === void 0) { chance = 0.5; }
            return (Math.random() < chance) ? 1 : -1;
        }
        zanejs.randomSign = randomSign;
        /**
         * 将参数 value 的值向上或向下舍入为最接近的整数并返回该值。
         * @param value 要舍入的数字。
         * @param digits 保留小数点的位数。
         * @returns {number}
         */
        function round(value, digits) {
            digits = Math.pow(10, digits);
            return Math.round(value * digits) / digits;
        }
        zanejs.round = round;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 把 params 对象的属性值指派给 obj 对象
         * @param obj
         * @param params
         */
        function assign(obj, params) {
            Object.keys(params).map(function (name) {
                obj[name] = params[name];
            });
            return obj;
        }
        zanejs.assign = assign;
        /**
         * 联合两个对象的属性值, 如果第二个参数和第一个参数存在相同的属性，那么第二个参数的属性值将覆盖第一个属性的值。
         * @param defaultVars
         * @param additionalVars
         */
        function combine(defaultVars, additionalVars) {
            var combinedObject = {};
            Object.keys(defaultVars).map(function (key) {
                combinedObject[key] = defaultVars[key];
            });
            Object.keys(additionalVars).map(function (key) {
                combinedObject[key] = additionalVars[key];
            });
            return combinedObject;
        }
        zanejs.combine = combine;
        /**
         * 是否 undefined
         * @param obj
         * @returns {boolean}
         */
        function isUndefined(obj) {
            return obj === void 0;
        }
        zanejs.isUndefined = isUndefined;
        /**
         * 是否空值
         * @param obj
         * @returns {boolean}
         */
        function isSpecial(obj) {
            var undef;
            return obj === undef || obj === null;
        }
        zanejs.isSpecial = isSpecial;
        /**
         * 是否bool值
         * @param obj
         * @returns {boolean}
         */
        function isBool(obj) {
            return obj === true || obj === false;
        }
        zanejs.isBool = isBool;
        /**
         * 是否字符串
         * @param obj
         * @returns {boolean}
         */
        function isString(obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        }
        zanejs.isString = isString;
        /**
         * 是否数组
         * @param obj
         * @returns {boolean}
         */
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        zanejs.isArray = isArray;
        /**
         * 是否对象
         * @param obj
         * @returns {boolean}
         */
        function isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        }
        zanejs.isObject = isObject;
        /**
         *
         * @param obj
         * @returns {number|boolean}
         */
        function isElement(obj) {
            return obj.nodeType && (obj.nodeType === 1 || obj.nodeType === 9);
        }
        zanejs.isElement = isElement;
        /**
         *
         * @param obj
         * @returns {boolean}
         */
        function isDocument(obj) {
            return obj != null && obj.nodeType === obj.DOCUMENT_NODE;
        }
        zanejs.isDocument = isDocument;
        /**
         * 是否函数
         * @param obj
         * @returns {boolean}
         */
        function isFunction(obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        }
        zanejs.isFunction = isFunction;
        /**
         * 返回字符串键名全为小写或大写的数组
         * example 1: array_change_key_case(42)
         * returns 1: false
         *
         * example 2: array_change_key_case([ 3, 5 ])
         * returns 2: [3, 5]
         *
         * example 3: array_change_key_case({ FuBaR: 42 })
         * returns 3: {"fubar": 42}
         *
         * example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER')
         * returns 4: {"fubar": 42}
         *
         * example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER')
         * returns 5: {"FUBAR": 42}
         *
         * example 6: array_change_key_case({ FuBaR: 42 }, 2)
         * returns 6: {"FUBAR": 42}
         *
         * @param obj
         * @param cs
         * @returns {*}
         */
        function object_change_key_case(obj, cs) {
            if (cs === void 0) { cs = 'CASE_LOWER'; }
            var tmpArr = {};
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                return obj;
            }
            if (obj && typeof obj === 'object') {
                Object.keys(obj).map(function (key) {
                    var _key = (!cs || cs === 'CASE_LOWER') ? key.toLowerCase() : key.toUpperCase();
                    tmpArr[_key] = obj[key];
                });
                return tmpArr;
            }
            return false;
        }
        zanejs.object_change_key_case = object_change_key_case;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 随机布尔值
         * @returns {boolean}
         */
        function randomBoolean() {
            return randomChance(0.5);
        }
        zanejs.randomBoolean = randomBoolean;
        /**
         * 通过指定一个阀值，随机布尔值
         * @returns {boolean}
         */
        function randomChance(percent) {
            return Math.random() < percent;
        }
        zanejs.randomChance = randomChance;
        /**
         * 从指定字符中随机指定长度的字符串。
         * @param amount
         * @param charSet
         * @returns {string}
         */
        function randomCharacters(amount, charSet) {
            if (charSet === void 0) { charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; }
            var alphabet = charSet.split('');
            var alphabetLength = alphabet.length;
            var randomLetters = '';
            for (var j = 0; j < amount; j++) {
                var r = Math.random() * alphabetLength;
                var s = Math.floor(r);
                randomLetters += alphabet[s];
            }
            return randomLetters;
        }
        zanejs.randomCharacters = randomCharacters;
        /**
         * 生成一组随机小写字符。
         * @param amount
         * @returns {string}
         */
        function randomLowercaseCharacters(amount) {
            var str = '';
            for (var i = 0; i < amount; i++) {
                str += String.fromCharCode(Math.round(Math.random() * (122 - 97)) + 97);
            }
            return str;
        }
        zanejs.randomLowercaseCharacters = randomLowercaseCharacters;
        /**
         * 生成一组随机字符。
         * @returns {string}
         */
        function randomToken() {
            return Math.random().toString(36).substr(2);
        }
        zanejs.randomToken = randomToken;
        /**
         * 生成一组随机数字字符。
         * @param amount
         * @returns {string}
         */
        function randomNumberString(amount) {
            var str = '';
            for (var i = 0; i < amount; i++) {
                str += String.fromCharCode(Math.round(Math.random() * (57 - 48)) + 48);
            }
            return str;
        }
        zanejs.randomNumberString = randomNumberString;
        /**
         * 生成一组随机特殊字符数。
         * @param amount
         * @returns {string}
         */
        function randomSpecialCharacters(amount) {
            var str = '';
            for (var i = 0; i < amount; i++) {
                str += String.fromCharCode(Math.round(Math.random() * (64 - 33)) + 33);
            }
            return str;
        }
        zanejs.randomSpecialCharacters = randomSpecialCharacters;
        /**
         * 生成更好的随机数
         * example 1: mt_rand(1, 1)
         * returns 1: 1
         *
         * @param min
         * @param max
         * @returns {number}
         */
        function mt_rand(min, max) {
            var argc = arguments.length;
            if (argc === 0) {
                min = 0;
                max = 2147483647;
            }
            else if (argc === 1) {
                throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
            }
            else {
                min = parseInt(String(min), 10);
                max = parseInt(String(max), 10);
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        zanejs.mt_rand = mt_rand;
        /**
         * @class zane.Random
         */
        var Random = (function () {
            // +----------------------------------------------------------------------
            // | constructor
            // +----------------------------------------------------------------------
            function Random(seed) {
                this.seed = seed;
            }
            // +----------------------------------------------------------------------
            // | public static method
            // +----------------------------------------------------------------------
            /**
             * 获取一个该类的实例对象。
             * @param seed
             * @returns {zane.Random}
             */
            Random.getInstance = function (seed) {
                return new Random(seed);
            };
            // +----------------------------------------------------------------------
            // | public method
            // +----------------------------------------------------------------------
            /**
             * 下一个随机数
             * @returns {number}
             */
            Random.prototype.next = function () {
                return this.nextUInt() * Random.MAX_RATIO;
            };
            /**
             * 下一个随机整数
             * @returns {number}
             */
            Random.prototype.nextUInt = function () {
                this.seed ^= (this.seed << 21);
                this.seed ^= (this.seed >> 35);
                this.seed ^= (this.seed << 4);
                return this.seed;
            };
            // +----------------------------------------------------------------------
            // | private static property
            // +----------------------------------------------------------------------
            Random.MAX_NUMBER = 0xFFFFFFFF;
            Random.MAX_RATIO = 1.0 / Random.MAX_NUMBER;
            return Random;
        }());
        zanejs.Random = Random;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        function requestAnimationFrame() {
            var w = window;
            return w.requestAnimationFrame ||
                w.webkitAnimationFrame ||
                w.webkitRequestAnimationFrame ||
                w.mozRequestAnimationFrame ||
                w.oRequestAnimationFrame ||
                w.msRequestAnimationFrame ||
                function (callback, element) {
                    return window.setTimeout(callback, 1000 / 60);
                };
        }
        zanejs.requestAnimationFrame = requestAnimationFrame;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 *  @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 状态工具
         * @class zane.State
         */
        var State = (function () {
            /**
             * 构造函数
             */
            function State(state) {
                this.state = state;
                this.last = '';
                this.count = -1;
                this.locked = false;
            }
            /**
             * 设置状态
             * @param state
             */
            State.prototype.setTo = function (state) {
                if (this.locked) {
                    return;
                }
                this.last = this.state;
                this.state = state;
                this.count = -1;
            };
            /**
             * 获取当前状态
             * @returns {string}
             */
            State.prototype.value = function () { return this.state; };
            /**
             * 计数
             */
            State.prototype.tick = function () {
                this.count++;
            };
            /**
             * 是否该状态的第一次计数
             * @returns {boolean}
             */
            State.prototype.first = function () {
                return this.count === 0;
            };
            /**
             * 是否跟指定的状态相同
             * @param state
             * @returns {boolean}
             */
            State.prototype.equal = function (state) {
                return state === this.state;
            };
            /**
             * 当前状态是否在指定的状态列表中
             * @returns {boolean}
             */
            State.prototype.isIn = function () {
                var state = this.state, args = Array.prototype.slice.call(arguments);
                return args.some(function (s) {
                    return s === state;
                });
            };
            /**
             * 当前状态是否不在指定的状态列表中
             * @returns {boolean}
             */
            State.prototype.isNotIn = function () {
                return !(this.isIn.apply(this, arguments));
            };
            return State;
        }());
        zanejs.State = State;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         *
         * @param url
         * @returns {string}
         */
        function cleanURL(url) {
            return url.replace(/.*?:\/\//, '');
        }
        zanejs.cleanURL = cleanURL;
        /**
         * 判断指定字符串是否以 suffix 后缀结尾。
         * @returns {boolean}
         */
        function endsWith(input, suffix) {
            return (suffix === input.substring(input.length - suffix.length));
        }
        zanejs.endsWith = endsWith;
        /**
         * 字符首字大写
         * @param str
         * @returns {string}
         */
        function firstToUpper(str) {
            return str.charAt(0).toUpperCase() + str.substr(1);
        }
        zanejs.firstToUpper = firstToUpper;
        /**
         * 从指定字符串前删除空格。
         * @param value
         * @returns {string}
         */
        function ltrim(value) {
            var out = '';
            if (value) {
                out = value.replace(/^\s+/, '');
            }
            return out;
        }
        zanejs.ltrim = ltrim;
        /**
         * 删除字符串末端的空白字符（或者其他字符）
         *
         * 不使用第二个参数，rtrim() 仅删除以下字符：
         * " " (ASCII 32 (0x20))，普通空白符。
         * "\t" (ASCII 9 (0x09))，制表符。
         * "\n" (ASCII 10 (0x0A))，换行符。
         * "\r" (ASCII 13 (0x0D))，回车符。
         * "\0" (ASCII 0 (0x00))，NUL 空字节符。
         * "\x0B" (ASCII 11 (0x0B))，垂直制表符。
         *
         * example 1: rtrim('    Kevin van Zonneveld    ')
         * returns 1: '    Kevin van Zonneveld'
         *
         * @param str - 输入字符串。
         * @param charlist - 通过指定 character_mask，可以指定想要删除的字符列表。简单地列出你想要删除的全部字符。使用 .. 格式，可以指定一个范围。
         * @returns {string} - 返回改变后的字符串。
         */
        function rtrim(str, charlist) {
            if (charlist === void 0) { charlist = null; }
            charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
                .replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^:])/g, '\\$1');
            var re = new RegExp('[' + charlist + ']+$', 'g');
            return (str + '').replace(re, '');
        }
        zanejs.rtrim = rtrim;
        /**
         * rtrim 的别名
         * @param str
         * @param charlist
         * @returns {string}
         */
        function chop(str, charlist) {
            if (charlist === void 0) { charlist = null; }
            return rtrim(str, charlist);
        }
        zanejs.chop = chop;
        /**
         * 删除字符串空格。
         * @param value
         * @returns {string}
         */
        function trim(value) {
            var out = '';
            if (value) {
                out = value.replace(/^\s+|\s+$/g, '');
            }
            return out;
        }
        zanejs.trim = trim;
        /**
         * 从字符串中去掉空格，换行，回车符，
         * @param str
         * @returns {string}
         */
        function xtrim(str) {
            if (str === void 0) { str = null; }
            str = (!str) ? '' : str;
            var o = '';
            var TAB = 9;
            var LINEFEED = 10;
            var CARRIAGE = 13;
            var SPACE = 32;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) !== SPACE &&
                    str.charCodeAt(i) !== CARRIAGE &&
                    str.charCodeAt(i) !== LINEFEED &&
                    str.charCodeAt(i) !== TAB) {
                    o += str.charAt(i);
                }
            }
            return o;
        }
        zanejs.xtrim = xtrim;
        /**
         * 字符左侧补全。
         * @param value
         * @param padChar
         * @param length
         * @returns {string}
         */
        function padLeft(value, padChar, length) {
            var s = value;
            while (s.length < length) {
                s = padChar + s;
            }
            return s;
        }
        zanejs.padLeft = padLeft;
        /**
         * 字符右侧补全。
         * @param value
         * @param padChar
         * @param length
         * @returns {string}
         */
        function padRight(value, padChar, length) {
            var s = value;
            while (s.length < length) {
                s += padChar;
            }
            return s;
        }
        zanejs.padRight = padRight;
        /**
         * 判断字符 s1 是否与 s2 相同。
         * @param s1 第一个比较字符
         * @param s2 第二个比较字符
         * @param caseSensitive 是否区分大小写
         * @returns {boolean}
         */
        function stringsAreEqual(s1, s2, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = false; }
            return (caseSensitive) ? (s1 === s2) : (s1.toUpperCase() === s2.toUpperCase());
        }
        zanejs.stringsAreEqual = stringsAreEqual;
        /**
         * 根据指定长度返回截断的字符串。
         * @param value
         * @param length
         * @param suffix
         * @returns {string}
         */
        function stringTruncate(value, length, suffix) {
            if (suffix === void 0) { suffix = '...'; }
            var out = '';
            var l = length;
            if (value) {
                l -= suffix.length;
                var trunc = value;
                if (trunc.length > l) {
                    trunc = trunc.substr(0, l);
                    if (/[^\s]/.test(value.charAt(l))) {
                        trunc = rtrim(trunc.replace(/\w+$|\s+$/, ''));
                    }
                    trunc += suffix;
                }
                out = trunc;
            }
            return out;
        }
        zanejs.stringTruncate = stringTruncate;
        /**
         *
         * @returns {string}
         */
        function generateUUID() {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = new Array(36);
            var rnd = 0, r;
            for (var i = 0; i < 36; i++) {
                if (i === 8 || i === 13 || i === 18 || i === 23) {
                    uuid[i] = '-';
                }
                else if (i === 14) {
                    uuid[i] = '4';
                }
                else {
                    if (rnd <= 0x02) {
                        rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                    }
                    r = rnd & 0xf;
                    rnd = rnd >> 4;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        }
        zanejs.generateUUID = generateUUID;
        /**
         * 以 C 语言风格使用反斜线转义字符串中的字符
         * 返回字符串，该字符串在属于参数 charlist 列表中的字符前都加上了反斜线。
         *
         * // Escape all ASCII within capital A to lower z range, including square brackets
         * example 1: addcslashes('foo[ ]', 'A..z');
         * returns 1: "\\f\\o\\o\\[ \\]"
         *
         * // Only escape z, period, and A here since not a lower-to-higher range
         * example 2: addcslashes("zoo['.']", 'z..A');
         * returns 2: "\\zoo['\\.']"
         *
         * // Escape as octals those specified and less than 32 (0x20) or greater than 126 (0x7E), but not otherwise
         * example 3: addcslashes("@a\u0000\u0010\u00A9", "\0..\37!@\177..\377");
         * returns 3: '\\@a\\000\\020\\302\\251'
         *
         * // Those between 32 (0x20 or 040) and 126 (0x7E or 0176) decimal
         * // value will be backslashed if specified (not octalized)
         * example 4: addcslashes("\u0020\u007E", "\40..\175");
         * returns 4: '\\ ~'
         *
         * example 5: addcslashes("\r\u0007\n", '\0..\37'); // Recognize C escape sequences if specified
         * returns 5: "\\r\\a\\n"
         *
         * example 6: addcslashes("\r\u0007\n", '\0'); // Do not recognize C escape sequences if not specified
         * returns 6: "\r\u0007\n"
         *
         * @param str - 要转义的字符
         * @param charlist - 如果 charlist 中包含有 \n，\r 等字符，将以 C 语言风格转换，
         * 而其它非字母数字且 ASCII 码低于 32 以及高于 126 的字符均转换成使用八进制表示。
         * @returns {string} 返回转义后的字符。
         */
        function addcslashes(str, charlist) {
            if (charlist === void 0) { charlist = null; }
            var target = '';
            var chrs = [];
            var i = 0;
            var j = 0;
            var c = '';
            var next = '';
            var rangeBegin = '';
            var rangeEnd = '';
            var $chr = '';
            var begin = 0;
            var end = 0;
            var octalLength = 0;
            var postOctalPos = 0;
            var cca = 0;
            var escHexGrp = [];
            var encoded = '';
            var percentHex = /%([\dA-Fa-f]+)/g;
            var _pad = function ($n, $c) {
                if (($n = $n + '').length < $c) {
                    return new Array(++$c - $n.length).join('0') + $n;
                }
                return $n;
            };
            for (i = 0; i < charlist.length; i++) {
                c = charlist.charAt(i);
                next = charlist.charAt(i + 1);
                if (c === '\\' && next && (/\d/).test(next)) {
                    // Octal
                    rangeBegin = charlist.slice(i + 1).match(/^\d+/)[0];
                    octalLength = rangeBegin.length;
                    postOctalPos = i + octalLength + 1;
                    if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') {
                        // Octal begins range
                        begin = rangeBegin.charCodeAt(0);
                        if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) {
                            // Range ends with octal
                            rangeEnd = charlist.slice(postOctalPos + 3).match(/^\d+/)[0];
                            // Skip range end backslash
                            i += 1;
                        }
                        else if (charlist.charAt(postOctalPos + 2)) {
                            // Range ends with character
                            rangeEnd = charlist.charAt(postOctalPos + 2);
                        }
                        else {
                            throw new Error('Range with no end point');
                        }
                        end = rangeEnd.charCodeAt(0);
                        if (end > begin) {
                            // Treat as a range
                            for (j = begin; j <= end; j++) {
                                chrs.push(String.fromCharCode(j));
                            }
                        }
                        else {
                            // Supposed to treat period, begin and end as individual characters only, not a range
                            chrs.push('.', rangeBegin, rangeEnd);
                        }
                        // Skip dots and range end (already skipped range end backslash if present)
                        i += rangeEnd.length + 2;
                    }
                    else {
                        // Octal is by itself
                        $chr = String.fromCharCode(parseInt(rangeBegin, 8));
                        chrs.push($chr);
                    }
                    // Skip range begin
                    i += octalLength;
                }
                else if (next + charlist.charAt(i + 2) === '..') {
                    // Character begins range
                    rangeBegin = c;
                    begin = rangeBegin.charCodeAt(0);
                    if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) {
                        // Range ends with octal
                        rangeEnd = charlist.slice(i + 4).match(/^\d+/)[0];
                        // Skip range end backslash
                        i += 1;
                    }
                    else if (charlist.charAt(i + 3)) {
                        // Range ends with character
                        rangeEnd = charlist.charAt(i + 3);
                    }
                    else {
                        throw new Error('Range with no end point');
                    }
                    end = rangeEnd.charCodeAt(0);
                    if (end > begin) {
                        // Treat as a range
                        for (j = begin; j <= end; j++) {
                            chrs.push(String.fromCharCode(j));
                        }
                    }
                    else {
                        // Supposed to treat period, begin and end as individual characters only, not a range
                        chrs.push('.', rangeBegin, rangeEnd);
                    }
                    // Skip dots and range end (already skipped range end backslash if present)
                    i += rangeEnd.length + 2;
                }
                else {
                    // Character is by itself
                    chrs.push(c);
                }
            }
            for (i = 0; i < str.length; i++) {
                c = str.charAt(i);
                if (chrs.indexOf(c) !== -1) {
                    target += '\\';
                    cca = c.charCodeAt(0);
                    if (cca < 32 || cca > 126) {
                        // Needs special escaping
                        switch (c) {
                            case '\n':
                                target += 'n';
                                break;
                            case '\t':
                                target += 't';
                                break;
                            case '\u000D':
                                target += 'r';
                                break;
                            case '\u0007':
                                target += 'a';
                                break;
                            case '\v':
                                target += 'v';
                                break;
                            case '\b':
                                target += 'b';
                                break;
                            case '\f':
                                target += 'f';
                                break;
                            default:
                                // target += _pad(cca.toString(8), 3);break; // Sufficient for UTF-16
                                encoded = encodeURIComponent(c);
                                // 3-length-padded UTF-8 octets
                                if ((escHexGrp = percentHex.exec(encoded)) !== null) {
                                    // already added a slash above:
                                    target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                                }
                                while ((escHexGrp = percentHex.exec(encoded)) !== null) {
                                    target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3);
                                }
                                break;
                        }
                    }
                    else {
                        // Perform regular backslashed escaping
                        target += c;
                    }
                }
                else {
                    // Just add the character unescaped
                    target += c;
                }
            }
            return target;
        }
        zanejs.addcslashes = addcslashes;
        /**
         * 使用反斜线引用字符串
         * 返回字符串，该字符串为了数据库查询语句等的需要在某些字符前加上了反斜线。这些字符是单引号（'）、双引号（"）、反斜线（\）与 NUL（NULL 字符）。
         * 一个使用 addslashes() 的例子是当你要往数据库中输入数据时。 例如，将名字 O'reilly 插入到数据库中，这就需要对其进行转义。
         *
         * example 1: addslashes("kevin's birthday")
         * returns 1: "kevin\\'s birthday"
         *
         * @param str - 要转义的字符。
         * @returns {string} - 返回转义后的字符
         */
        function addslashes(str) {
            return (str + '')
                .replace(/[\\"']/g, '\\$&')
                .replace(/\u0000/g, '\\0');
        }
        zanejs.addslashes = addslashes;
        /**
         *
         * example 1: stripslashes('Kevin\'s code')
         * returns 1: "Kevin's code"
         *
         * example 2: stripslashes('Kevin\\\'s code')
         * returns 2: "Kevin\'s code"
         *
         * @param str
         * @returns {string}
         */
        function stripslashes(str) {
            return (str + '').replace(/\\(.?)/g, function (s, n1) {
                switch (n1) {
                    case '\\':
                        return '\\';
                    case '0':
                        return '\u0000';
                    case '':
                        return '';
                    default:
                        return n1;
                }
            });
        }
        zanejs.stripslashes = stripslashes;
        /**
         *
         * example 1: bin2hex('Kev')
         * returns 1: '4b6576'
         *
         * example 2: bin2hex(String.fromCharCode(0x00))
         * returns 2: '00'
         *
         * @param s
         * @returns {string}
         */
        function bin2hex(s) {
            var i;
            var l;
            var o = '';
            var n;
            s += '';
            for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i)
                    .toString(16);
                o += n.length < 2 ? '0' + n : n;
            }
            return o;
        }
        zanejs.bin2hex = bin2hex;
        /**
         *
         * example 1: hex2bin('44696d61')
         * returns 1: 'Dima'
         *
         * example 2: hex2bin('00')
         * returns 2: '\x00'
         *
         * example 3: hex2bin('2f1q')
         * returns 3: false
         *
         * @param s
         * @returns {*}
         */
        function hex2bin(s) {
            var ret = [];
            var i = 0;
            var l;
            s += '';
            for (l = s.length; i < l; i += 2) {
                var c = parseInt(s.substr(i, 1), 16);
                var k = parseInt(s.substr(i + 1, 1), 16);
                if (isNaN(c) || isNaN(k)) {
                    return false;
                }
                ret.push((c << 4) | k);
            }
            return String.fromCharCode.apply(String, ret);
        }
        zanejs.hex2bin = hex2bin;
        /**
         * 返回相对应于 ascii 所指定的单个字符。
         *
         * example 1: chr(75) === 'K'
         * example 1: chr(65536) === '\uD800\uDC00'
         * returns 1: true
         *
         * @param codePt
         * @returns {string}
         */
        function chr(codePt) {
            if (codePt > 0xFFFF) {
                codePt -= 0x10000;
                return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
            }
            return String.fromCharCode(codePt);
        }
        zanejs.chr = chr;
        /**
         * 使用此函数将字符串分割成小块非常有用。例如将 base64_encode() 的输出转换成符合 RFC 2045 语义的字符串。它会在每 chunklen 个字符后边插入 end。
         *
         * example 1: chunk_split('Hello world!', 1, '*')
         * returns 1: 'H*e*l*l*o* *w*o*r*l*d*!*'
         *
         * example 2: chunk_split('Hello world!', 10, '*')
         * returns 2: 'Hello worl*d!*'
         *
         * @param body - 要分割的字符。
         * @param chunklen - 分割的尺寸。
         * @param end - 行尾序列符号。
         * @returns {*} - 返回分割后的字符。
         */
        function chunk_split(body, chunklen, end) {
            chunklen = parseInt(String(chunklen), 10) || 76;
            end = end || '\r\n';
            if (chunklen < 1) {
                return false;
            }
            return body.match(new RegExp('.{0,' + chunklen + '}', 'g'))
                .join(end);
        }
        zanejs.chunk_split = chunk_split;
        /**
         * 此函数将给定的字符串从一种 Cyrillic 字符转换成另一种，返回转换之后的字符串。
         * 支持的类型有：
         * k - koi8-r
         * w - windows-1251
         * i - iso8859-5
         * a - x-cp866
         * d - x-cp866
         * m - x-mac-cyrillic
         *
         * // Char. 214 of KOI8-R gives equivalent number value 230 in win1251
         * example 1: convert_cyr_string(String.fromCharCode(214), 'k', 'w').charCodeAt(0) === 230;
         * returns 1: true
         *
         * @param str - 要转换的字符。
         * @param from - 单个字符，代表源 Cyrillic 字符集。
         * @param to - 单个字符，代表了目标 Cyrillic 字符集。
         * @returns {*} - 返回转换后的字符串。
         */
        function convert_cyr_string(str, from, to) {
            var _cyrWin1251 = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
                60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
                80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
                100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
                120, 121, 122, 123, 124, 125, 126, 127, 46, 46, 46, 46, 46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                46,
                154,
                174,
                190,
                46,
                159,
                189,
                46,
                46,
                179,
                191,
                180,
                157,
                46,
                46,
                156,
                183,
                46,
                46,
                182,
                166,
                173,
                46,
                46,
                158,
                163,
                152,
                164,
                155,
                46,
                46,
                46,
                167,
                225,
                226,
                247,
                231,
                228,
                229,
                246,
                250,
                233,
                234,
                235,
                236,
                237,
                238,
                239,
                240,
                242,
                243,
                244,
                245,
                230,
                232,
                227,
                254,
                251,
                253,
                255,
                249,
                248,
                252,
                224,
                241,
                193,
                194,
                215,
                199,
                196,
                197,
                214,
                218,
                201,
                202,
                203,
                204,
                205,
                206,
                207,
                208,
                210,
                211,
                212,
                213,
                198,
                200,
                195,
                222,
                219,
                221,
                223,
                217,
                216,
                220,
                192,
                209,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                184,
                186,
                32,
                179,
                191,
                32,
                32,
                32,
                32,
                32,
                180,
                162,
                32,
                32,
                32,
                32,
                168,
                170,
                32,
                178,
                175,
                32,
                32,
                32,
                32,
                32,
                165,
                161,
                169,
                254,
                224,
                225,
                246,
                228,
                229,
                244,
                227,
                245,
                232,
                233,
                234,
                235,
                236,
                237,
                238,
                239,
                255,
                240,
                241,
                242,
                243,
                230,
                226,
                252,
                251,
                231,
                248,
                253,
                249,
                247,
                250,
                222,
                192,
                193,
                214,
                196,
                197,
                212,
                195,
                213,
                200,
                201,
                202,
                203,
                204,
                205,
                206,
                207,
                223,
                208,
                209,
                210,
                211,
                198,
                194,
                220,
                219,
                199,
                216,
                221,
                217,
                215,
                218
            ];
            var _cyrCp866 = [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                225,
                226,
                247,
                231,
                228,
                229,
                246,
                250,
                233,
                234,
                235,
                236,
                237,
                238,
                239,
                240,
                242,
                243,
                244,
                245,
                230,
                232,
                227,
                254,
                251,
                253,
                255,
                249,
                248,
                252,
                224,
                241,
                193,
                194,
                215,
                199,
                196,
                197,
                214,
                218,
                201,
                202,
                203,
                204,
                205,
                206,
                207,
                208,
                35,
                35,
                35,
                124,
                124,
                124,
                124,
                43,
                43,
                124,
                124,
                43,
                43,
                43,
                43,
                43,
                43,
                45,
                45,
                124,
                45,
                43,
                124,
                124,
                43,
                43,
                45,
                45,
                124,
                45,
                43,
                45,
                45,
                45,
                45,
                43,
                43,
                43,
                43,
                43,
                43,
                43,
                43,
                35,
                35,
                124,
                124,
                35,
                210,
                211,
                212,
                213,
                198,
                200,
                195,
                222,
                219,
                221,
                223,
                217,
                216,
                220,
                192,
                209,
                179,
                163,
                180,
                164,
                183,
                167,
                190,
                174,
                32,
                149,
                158,
                32,
                152,
                159,
                148,
                154,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                205,
                186,
                213,
                241,
                243,
                201,
                32,
                245,
                187,
                212,
                211,
                200,
                190,
                32,
                247,
                198,
                199,
                204,
                181,
                240,
                242,
                185,
                32,
                244,
                203,
                207,
                208,
                202,
                216,
                32,
                246,
                32,
                238,
                160,
                161,
                230,
                164,
                165,
                228,
                163,
                229,
                168,
                169,
                170,
                171,
                172,
                173,
                174,
                175,
                239,
                224,
                225,
                226,
                227,
                166,
                162,
                236,
                235,
                167,
                232,
                237,
                233,
                231,
                234,
                158,
                128,
                129,
                150,
                132,
                133,
                148,
                131,
                149,
                136,
                137,
                138,
                139,
                140,
                141,
                142,
                143,
                159,
                144,
                145,
                146,
                147,
                134,
                130,
                156,
                155,
                135,
                152,
                157,
                153,
                151,
                154
            ];
            var _cyrIso88595 = [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                179,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                225,
                226,
                247,
                231,
                228,
                229,
                246,
                250,
                233,
                234,
                235,
                236,
                237,
                238,
                239,
                240,
                242,
                243,
                244,
                245,
                230,
                232,
                227,
                254,
                251,
                253,
                255,
                249,
                248,
                252,
                224,
                241,
                193,
                194,
                215,
                199,
                196,
                197,
                214,
                218,
                201,
                202,
                203,
                204,
                205,
                206,
                207,
                208,
                210,
                211,
                212,
                213,
                198,
                200,
                195,
                222,
                219,
                221,
                223,
                217,
                216,
                220,
                192,
                209,
                32,
                163,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                241,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                161,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                32,
                238,
                208,
                209,
                230,
                212,
                213,
                228,
                211,
                229,
                216,
                217,
                218,
                219,
                220,
                221,
                222,
                223,
                239,
                224,
                225,
                226,
                227,
                214,
                210,
                236,
                235,
                215,
                232,
                237,
                233,
                231,
                234,
                206,
                176,
                177,
                198,
                180,
                181,
                196,
                179,
                197,
                184,
                185,
                186,
                187,
                188,
                189,
                190,
                191,
                207,
                192,
                193,
                194,
                195,
                182,
                178,
                204,
                203,
                183,
                200,
                205,
                201,
                199,
                202
            ];
            var _cyrMac = [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                225,
                226,
                247,
                231,
                228,
                229,
                246,
                250,
                233,
                234,
                235,
                236,
                237,
                238,
                239,
                240,
                242,
                243,
                244,
                245,
                230,
                232,
                227,
                254,
                251,
                253,
                255,
                249,
                248,
                252,
                224,
                241,
                160,
                161,
                162,
                163,
                164,
                165,
                166,
                167,
                168,
                169,
                170,
                171,
                172,
                173,
                174,
                175,
                176,
                177,
                178,
                179,
                180,
                181,
                182,
                183,
                184,
                185,
                186,
                187,
                188,
                189,
                190,
                191,
                128,
                129,
                130,
                131,
                132,
                133,
                134,
                135,
                136,
                137,
                138,
                139,
                140,
                141,
                142,
                143,
                144,
                145,
                146,
                147,
                148,
                149,
                150,
                151,
                152,
                153,
                154,
                155,
                156,
                179,
                163,
                209,
                193,
                194,
                215,
                199,
                196,
                197,
                214,
                218,
                201,
                202,
                203,
                204,
                205,
                206,
                207,
                208,
                210,
                211,
                212,
                213,
                198,
                200,
                195,
                222,
                219,
                221,
                223,
                217,
                216,
                220,
                192,
                255,
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                64,
                65,
                66,
                67,
                68,
                69,
                70,
                71,
                72,
                73,
                74,
                75,
                76,
                77,
                78,
                79,
                80,
                81,
                82,
                83,
                84,
                85,
                86,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
                96,
                97,
                98,
                99,
                100,
                101,
                102,
                103,
                104,
                105,
                106,
                107,
                108,
                109,
                110,
                111,
                112,
                113,
                114,
                115,
                116,
                117,
                118,
                119,
                120,
                121,
                122,
                123,
                124,
                125,
                126,
                127,
                192,
                193,
                194,
                195,
                196,
                197,
                198,
                199,
                200,
                201,
                202,
                203,
                204,
                205,
                206,
                207,
                208,
                209,
                210,
                211,
                212,
                213,
                214,
                215,
                216,
                217,
                218,
                219,
                220,
                221,
                222,
                223,
                160,
                161,
                162,
                222,
                164,
                165,
                166,
                167,
                168,
                169,
                170,
                171,
                172,
                173,
                174,
                175,
                176,
                177,
                178,
                221,
                180,
                181,
                182,
                183,
                184,
                185,
                186,
                187,
                188,
                189,
                190,
                191,
                254,
                224,
                225,
                246,
                228,
                229,
                244,
                227,
                245,
                232,
                233,
                234,
                235,
                236,
                237,
                238,
                239,
                223,
                240,
                241,
                242,
                243,
                230,
                226,
                252,
                251,
                231,
                248,
                253,
                249,
                247,
                250,
                158,
                128,
                129,
                150,
                132,
                133,
                148,
                131,
                149,
                136,
                137,
                138,
                139,
                140,
                141,
                142,
                143,
                159,
                144,
                145,
                146,
                147,
                134,
                130,
                156,
                155,
                135,
                152,
                157,
                153,
                151,
                154
            ];
            var fromTable = null;
            var toTable = null;
            var tmp;
            var i = 0;
            var retStr = '';
            switch (from.toUpperCase()) {
                case 'W':
                    fromTable = _cyrWin1251;
                    break;
                case 'A':
                case 'D':
                    fromTable = _cyrCp866;
                    break;
                case 'I':
                    fromTable = _cyrIso88595;
                    break;
                case 'M':
                    fromTable = _cyrMac;
                    break;
                case 'K':
                    break;
                default:
                    // Can we throw a warning instead? That would be more in line with PHP
                    throw new Error('Unknown source charset: ' + fromTable);
            }
            switch (to.toUpperCase()) {
                case 'W':
                    toTable = _cyrWin1251;
                    break;
                case 'A':
                case 'D':
                    toTable = _cyrCp866;
                    break;
                case 'I':
                    toTable = _cyrIso88595;
                    break;
                case 'M':
                    toTable = _cyrMac;
                    break;
                case 'K':
                    break;
                default:
                    // Can we throw a warning instead? That would be more in line with PHP
                    throw new Error('Unknown destination charset: ' + toTable);
            }
            if (!str) {
                return str;
            }
            for (i = 0; i < str.length; i++) {
                tmp = (fromTable === null)
                    ? str.charAt(i)
                    : String.fromCharCode(fromTable[str.charAt(i).charCodeAt(0)]);
                retStr += (toTable === null)
                    ? tmp
                    : String.fromCharCode(toTable[tmp.charCodeAt(0) + 256]);
            }
            return retStr;
        }
        zanejs.convert_cyr_string = convert_cyr_string;
        /**
         * 返回字符串所用字符的信息
         *
         * example 1: count_chars("Hello World!", 3)
         * returns 1: " !HWdelor"
         *
         * example 2: count_chars("Hello World!", 1)
         * returns 2: {32:1,33:1,72:1,87:1,100:1,101:1,108:3,111:2,114:1}
         *
         * @param str - 需要统计的字符串。
         * @param mode - 参见返回的值。
         * @returns {*}
         * 根据不同的 mode，count_chars() 返回下列不同的结果：
         * 0 - 以所有的每个字节值作为键名，出现次数作为值的数组。
         * 1 - 与 0 相同，但只列出出现次数大于零的字节值。
         * 2 - 与 0 相同，但只列出出现次数等于零的字节值。
         * 3 - 返回由所有使用了的字节值组成的字符串。
         * 4 - 返回由所有未使用的字节值组成的字符串。
         */
        function count_chars(str, mode) {
            var result = {};
            var resultArr = [];
            var i;
            var matchArr = ('' + str).split('').sort().join('').match(/(.)\1*/g);
            if ((mode & 1) === 0) {
                for (i = 0; i !== 256; i++) {
                    result[i] = 0;
                }
            }
            if (mode === 2 || mode === 4) {
                for (i = 0; i !== str.length; i += 1) {
                    delete result[matchArr[i].charCodeAt(0)];
                }
                Object.keys(result).map(function (key) {
                    result[key] = (mode === 4) ? String.fromCharCode(Number(key)) : 0;
                });
            }
            else if (mode === 3) {
                for (i = 0; i !== str.length; i += 1) {
                    result[i] = str[i].slice(0, 1);
                }
            }
            else {
                for (i = 0; i !== str.length; i += 1) {
                    result[str[i].charCodeAt(0)] = str[i].length;
                }
            }
            if (mode < 3) {
                return result;
            }
            Object.keys(result).map(function (key) {
                resultArr.push(result[key]);
            });
            return resultArr.join('');
        }
        zanejs.count_chars = count_chars;
        /**
         * 输出一个或多个字符串
         * @param args
         */
        function echo() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return console.log(args.join(' '));
        }
        zanejs.echo = echo;
        /**
         * 使用一个字符串分割另一个字符串
         *
         * example 1: explode(' ', 'Kevin van Zonneveld')
         * returns 1: [ 'Kevin', 'van', 'Zonneveld' ]
         *
         * @param delimiter - 边界上的分隔字符。
         * @param str - 输入的字符串。
         * @param limit - 如果设置了 limit 参数并且是正数，则返回的数组包含最多 limit 个元素，而最后那个元素将包含 string 的剩余部分。
         * 如果 limit 参数是负数，则返回除了最后的 -limit 个元素外的所有元素。
         * 如果 limit 是 0，则会被当做 1。
         * @returns {*}
         */
        function explode(delimiter, str, limit) {
            if (arguments.length < 2 ||
                typeof delimiter === 'undefined' ||
                typeof str === 'undefined') {
                return null;
            }
            if (delimiter === '' ||
                delimiter === false ||
                delimiter === null) {
                return false;
            }
            if (typeof delimiter === 'function' ||
                typeof delimiter === 'object' ||
                typeof str === 'function' ||
                typeof str === 'object') {
                return { 0: '' };
            }
            if (delimiter === true) {
                delimiter = '1';
            }
            // Here we go...
            delimiter += '';
            str += '';
            var s = str.split(delimiter);
            if (typeof limit === 'undefined') {
                return s;
            }
            // Support for limit
            if (limit === 0) {
                limit = 1;
            }
            // Positive limit
            if (limit > 0) {
                if (limit >= s.length) {
                    return s;
                }
                return s
                    .slice(0, limit - 1)
                    .concat([s.slice(limit - 1)
                        .join(delimiter)
                ]);
            }
            // Negative limit
            if (-limit >= s.length) {
                return [];
            }
            s.splice(s.length + limit);
            return s;
        }
        zanejs.explode = explode;
        /**
         *  将一个一维数组的值转化为字符串
         *
         * example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
         * returns 1: 'Kevin van Zonneveld'
         *
         * example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
         * returns 2: 'Kevin van Zonneveld'
         *
         * @param glue - 默认为空的字符串。
         * @param pieces - 你想要转换的数组。
         * @returns {*}
         */
        function implode(glue, pieces) {
            var i = '';
            var retVal = '';
            var tGlue = '';
            if (arguments.length === 1) {
                pieces = glue;
                glue = '';
            }
            if (typeof pieces === 'object') {
                if (Object.prototype.toString.call(pieces) === '[object Array]') {
                    return pieces.join(glue);
                }
                Object.keys(pieces).map(function (key) {
                    retVal += tGlue + pieces[key];
                    tGlue = glue;
                });
                return retVal;
            }
            return pieces;
        }
        zanejs.implode = implode;
        /**
         *
         * @param glue
         * @param pieces
         * @returns {*}
         */
        function join(glue, pieces) {
            return implode(glue, pieces);
        }
        zanejs.join = join;
        /**
         * 返回使用 htmlspecialchars() 和 htmlentities() 后的转换表
         *
         * example 1: get_html_translation_table('HTML_SPECIALCHARS')
         * returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
         *
         * @param table - 有两个新的常量 (HTML_ENTITIES, HTML_SPECIALCHARS) 允许你指定你想要的表。
         * @param quoteStyle
         * @returns {{}} 将转换表作为一个数组返回。
         */
        function get_html_translation_table(table, quoteStyle) {
            if (quoteStyle === void 0) { quoteStyle = null; }
            var entities = {};
            var hashMap = {};
            var decimal;
            var constMappingTable = {};
            var constMappingQuoteStyle = {};
            var useTable = {};
            var useQuoteStyle = {};
            // Translate arguments
            constMappingTable[0] = 'HTML_SPECIALCHARS';
            constMappingTable[1] = 'HTML_ENTITIES';
            constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
            constMappingQuoteStyle[2] = 'ENT_COMPAT';
            constMappingQuoteStyle[3] = 'ENT_QUOTES';
            useTable = !isNaN(Number(table))
                ? constMappingTable[table]
                : table
                    ? table.toUpperCase()
                    : 'HTML_SPECIALCHARS';
            useQuoteStyle = !isNaN(Number(quoteStyle))
                ? constMappingQuoteStyle[quoteStyle]
                : quoteStyle
                    ? quoteStyle.toUpperCase()
                    : 'ENT_COMPAT';
            if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
                throw new Error('Table: ' + useTable + ' not supported');
            }
            entities['38'] = '&amp;';
            if (useTable === 'HTML_ENTITIES') {
                entities['160'] = '&nbsp;';
                entities['161'] = '&iexcl;';
                entities['162'] = '&cent;';
                entities['163'] = '&pound;';
                entities['164'] = '&curren;';
                entities['165'] = '&yen;';
                entities['166'] = '&brvbar;';
                entities['167'] = '&sect;';
                entities['168'] = '&uml;';
                entities['169'] = '&copy;';
                entities['170'] = '&ordf;';
                entities['171'] = '&laquo;';
                entities['172'] = '&not;';
                entities['173'] = '&shy;';
                entities['174'] = '&reg;';
                entities['175'] = '&macr;';
                entities['176'] = '&deg;';
                entities['177'] = '&plusmn;';
                entities['178'] = '&sup2;';
                entities['179'] = '&sup3;';
                entities['180'] = '&acute;';
                entities['181'] = '&micro;';
                entities['182'] = '&para;';
                entities['183'] = '&middot;';
                entities['184'] = '&cedil;';
                entities['185'] = '&sup1;';
                entities['186'] = '&ordm;';
                entities['187'] = '&raquo;';
                entities['188'] = '&frac14;';
                entities['189'] = '&frac12;';
                entities['190'] = '&frac34;';
                entities['191'] = '&iquest;';
                entities['192'] = '&Agrave;';
                entities['193'] = '&Aacute;';
                entities['194'] = '&Acirc;';
                entities['195'] = '&Atilde;';
                entities['196'] = '&Auml;';
                entities['197'] = '&Aring;';
                entities['198'] = '&AElig;';
                entities['199'] = '&Ccedil;';
                entities['200'] = '&Egrave;';
                entities['201'] = '&Eacute;';
                entities['202'] = '&Ecirc;';
                entities['203'] = '&Euml;';
                entities['204'] = '&Igrave;';
                entities['205'] = '&Iacute;';
                entities['206'] = '&Icirc;';
                entities['207'] = '&Iuml;';
                entities['208'] = '&ETH;';
                entities['209'] = '&Ntilde;';
                entities['210'] = '&Ograve;';
                entities['211'] = '&Oacute;';
                entities['212'] = '&Ocirc;';
                entities['213'] = '&Otilde;';
                entities['214'] = '&Ouml;';
                entities['215'] = '&times;';
                entities['216'] = '&Oslash;';
                entities['217'] = '&Ugrave;';
                entities['218'] = '&Uacute;';
                entities['219'] = '&Ucirc;';
                entities['220'] = '&Uuml;';
                entities['221'] = '&Yacute;';
                entities['222'] = '&THORN;';
                entities['223'] = '&szlig;';
                entities['224'] = '&agrave;';
                entities['225'] = '&aacute;';
                entities['226'] = '&acirc;';
                entities['227'] = '&atilde;';
                entities['228'] = '&auml;';
                entities['229'] = '&aring;';
                entities['230'] = '&aelig;';
                entities['231'] = '&ccedil;';
                entities['232'] = '&egrave;';
                entities['233'] = '&eacute;';
                entities['234'] = '&ecirc;';
                entities['235'] = '&euml;';
                entities['236'] = '&igrave;';
                entities['237'] = '&iacute;';
                entities['238'] = '&icirc;';
                entities['239'] = '&iuml;';
                entities['240'] = '&eth;';
                entities['241'] = '&ntilde;';
                entities['242'] = '&ograve;';
                entities['243'] = '&oacute;';
                entities['244'] = '&ocirc;';
                entities['245'] = '&otilde;';
                entities['246'] = '&ouml;';
                entities['247'] = '&divide;';
                entities['248'] = '&oslash;';
                entities['249'] = '&ugrave;';
                entities['250'] = '&uacute;';
                entities['251'] = '&ucirc;';
                entities['252'] = '&uuml;';
                entities['253'] = '&yacute;';
                entities['254'] = '&thorn;';
                entities['255'] = '&yuml;';
            }
            if (useQuoteStyle !== 'ENT_NOQUOTES') {
                entities['34'] = '&quot;';
            }
            if (useQuoteStyle === 'ENT_QUOTES') {
                entities['39'] = '&#39;';
            }
            entities['60'] = '&lt;';
            entities['62'] = '&gt;';
            for (decimal in entities) {
                if (entities.hasOwnProperty(decimal)) {
                    hashMap[String.fromCharCode(decimal)] = entities[decimal];
                }
            }
            return hashMap;
        }
        zanejs.get_html_translation_table = get_html_translation_table;
        /**
         *
         * example 1: html_entity_decode('Kevin &amp; van Zonneveld')
         * returns 1: 'Kevin & van Zonneveld'
         *
         * example 2: html_entity_decode('&amp;lt;')
         * returns 2: '&lt;'
         *
         * @param string
         * @param quoteStyle
         * @returns {*}
         */
        function html_entity_decode(str, quoteStyle) {
            if (quoteStyle === void 0) { quoteStyle = null; }
            var tmpStr = str.toString();
            var hashMap = get_html_translation_table('HTML_ENTITIES', quoteStyle);
            if (hashMap === false) {
                return false;
            }
            // @todo: &amp; problem
            // http://locutus.io/php/get_html_translation_table:416#comment_97660
            delete (hashMap['&']);
            hashMap['&'] = '&amp;';
            Object.keys(hashMap).map(function (symbol) {
                var entity = hashMap[symbol];
                tmpStr = tmpStr.split(entity).join(symbol);
            });
            tmpStr = tmpStr.split('&#039;').join('\'');
            return tmpStr;
        }
        zanejs.html_entity_decode = html_entity_decode;
        /**
         * 在字符串 string 所有新行之前插入 '<br />' 或 '<br>'，并返回。
         *
         * example 1: nl2br('Kevin\nvan\nZonneveld')
         * returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
         *
         * example 2: nl2br("\nOne\nTwo\n\nThree\n", false)
         * returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
         *
         * example 3: nl2br("\nOne\nTwo\n\nThree\n", true)
         * returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
         *
         * example 4: nl2br(null)
         * returns 4: ''
         *
         * @param str - 输入字符串
         * @param isXhtml - 是否使用 XHTML 兼容换行符。
         * @returns {*} - 返回调整后的字符串。
         */
        function nl2br(str, isXhtml) {
            if (isXhtml === void 0) { isXhtml = true; }
            // Some latest browsers when str is null return and unexpected null value
            if (typeof str === 'undefined' || str === null) {
                return '';
            }
            // Adjust comment to avoid issue on locutus.io display
            var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br ' + '/>' : '<br>';
            return (str + '')
                .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        }
        zanejs.nl2br = nl2br;
        /**
         * 以千位分隔符方式格式化一个数字
         *
         * example 1: number_format(1234.56)
         * returns 1: '1,235'
         *
         * example 2: number_format(1234.56, 2, ',', ' ')
         * returns 2: '1 234,56'
         *
         * example 3: number_format(1234.5678, 2, '.', '')
         * returns 3: '1234.57'
         *
         * example 4: number_format(67, 2, ',', '.')
         * returns 4: '67,00'
         *
         * example 5: number_format(1000)
         * returns 5: '1,000'
         *
         * example 6: number_format(67.311, 2)
         * returns 6: '67.31'
         *
         * example 7: number_format(1000.55, 1)
         * returns 7: '1,000.6'
         *
         * example 8: number_format(67000, 5, ',', '.')
         * returns 8: '67.000,00000'
         *
         * example 9: number_format(0.9, 0)
         * returns 9: '1'
         *
         * example 10: number_format('1.20', 2)
         * returns 10: '1.20'
         *
         * example 11: number_format('1.20', 4)
         * returns 11: '1.2000'
         *
         * example 12: number_format('1.2000', 3)
         * returns 12: '1.200'
         *
         * example 13: number_format('1 000,50', 2, '.', ' ')
         * returns 13: '100 050.00'
         *
         * example 14: number_format(1e-8, 8, '.', '')
         * returns 14: '0.00000001'
         *
         * @param num
         * @param decimals
         * @param decPoint
         * @param thousandsSep
         * @returns {*}
         */
        function number_format(num, decimals, decPoint, thousandsSep) {
            num = (num + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+num) ? 0 : +num;
            var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
            var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
            var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
            var toFixedFix = function ($n, $prec) {
                var k = Math.pow(10, $prec);
                return '' + (Math.round($n * k) / k).toFixed($prec);
            };
            // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
            var s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        }
        zanejs.number_format = number_format;
        /**
         * 生成 URL-encode 之后的请求字符串
         *
         * example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;')
         * returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
         *
         * example 2: http_build_query({'php': 'hypertext processor',
         * 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_')
         * returns 2: 'myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&php=hypertext+processor&cow=milk'
         *
         * @param formData - 可以是数组或包含属性的对象。
         * @param numericPrefix - 如果在基础数组中使用了数字下标同时给出了该参数，此参数值将会作为基础数组中的数字下标元素的前缀。
         * @param argSeparator - 除非指定并使用了这个参数，否则会用 arg_separator.output 来分隔参数。
         * @returns {string}
         */
        function http_build_query(formData, numericPrefix, argSeparator) {
            if (numericPrefix === void 0) { numericPrefix = null; }
            if (argSeparator === void 0) { argSeparator = null; }
            var _httpBuildQueryHelper = function (key, val, $argSeparator) {
                var k;
                var $tmp = [];
                if (val === true) {
                    val = '1';
                }
                else if (val === false) {
                    val = '0';
                }
                if (val !== null) {
                    if (typeof val === 'object') {
                        for (k in val) {
                            if (val[k] !== null) {
                                $tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], $argSeparator));
                            }
                        }
                        return $tmp.join($argSeparator);
                    }
                    else if (typeof val !== 'function') {
                        return urlencode(key) + '=' + urlencode(val);
                    }
                    else {
                        throw new Error('There was an error processing for http_build_query().');
                    }
                }
                else {
                    return '';
                }
            };
            if (!argSeparator) {
                argSeparator = '&';
            }
            var tmp = [];
            Object.keys(formData).map(function (key) {
                var value = formData[key];
                if (numericPrefix && !isNaN(Number(key))) {
                    key = String(numericPrefix) + key;
                }
                var query = _httpBuildQueryHelper(key, value, argSeparator);
                if (query !== '') {
                    tmp.push(query);
                }
            });
            return tmp.join(argSeparator);
        }
        zanejs.http_build_query = http_build_query;
        /**
         * 解析 URL，返回其组成部分
         *
         * example 1: parse_url('http://user:pass@host/path?a=v#a')
         * returns 1: {scheme: 'http', host: 'host', user: 'user', pass: 'pass', path: '/path', query: 'a=v', fragment: 'a'}
         *
         * example 2: parse_url('http://en.wikipedia.org/wiki/%22@%22_%28album%29')
         * returns 2: {scheme: 'http', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
         *
         * example 3: parse_url('https://host.domain.tld/a@b.c/folder')
         * returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
         *
         * example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar')
         * returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder',
         * query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }
         *
         * @param str - 要解析的 URL。无效字符将使用 _ 来替换。
         * @param component - 指定 PHP_URL_SCHEME、 PHP_URL_HOST、 PHP_URL_PORT、 PHP_URL_USER、 PHP_URL_PASS、
         * PHP_URL_PATH、 PHP_URL_QUERY 或 PHP_URL_FRAGMENT 的其中一个来获取 URL 中指定的部分的 string。
         * @param mode
         * @returns {*}
         */
        function parse_url(str, component, mode) {
            if (mode === void 0) { mode = 'php'; }
            var query;
            var key = [
                'source',
                'scheme',
                'authority',
                'userInfo',
                'user',
                'pass',
                'host',
                'port',
                'relative',
                'path',
                'directory',
                'file',
                'query',
                'fragment'
            ];
            // For loose we added one optional slash to post-scheme to catch file:/// (should restrict this)
            var parser = {
                php: new RegExp([
                    '(?:([^:\\/?#]+):)?',
                    '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
                    '()',
                    '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
                ].join('')),
                strict: new RegExp([
                    '(?:([^:\\/?#]+):)?',
                    '(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
                    '((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
                ].join('')),
                loose: new RegExp([
                    '(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?',
                    '(?:\\/\\/\\/?)?',
                    '((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)',
                    '(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))',
                    '(?:\\?([^#]*))?(?:#(.*))?)'
                ].join(''))
            };
            var m = parser[mode].exec(str);
            var uri = {};
            var i = 14;
            while (i--) {
                if (m[i]) {
                    uri[key[i]] = m[i];
                }
            }
            if (component) {
                return uri[component.replace('PHP_URL_', '').toLowerCase()];
            }
            if (mode !== 'php') {
                var name_4 = 'queryKey';
                parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
                uri[name_4] = {};
                query = uri[key[12]] || '';
                query.replace(parser, function ($0, $1, $2) {
                    if ($1) {
                        uri[name_4][$1] = $2;
                    }
                });
            }
            delete uri.source;
            return uri;
        }
        zanejs.parse_url = parse_url;
        /**
         * 对已编码的 URL 字符串进行解码
         *
         * example 1: rawurldecode('Kevin+van+Zonneveld%21')
         * returns 1: 'Kevin+van+Zonneveld!'
         *
         * example 2: rawurldecode('http%3A%2F%2Fkvz.io%2F')
         * returns 2: 'http://kvz.io/'
         *
         * example 3: rawurldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3D')
         * returns 3: 'http://www.google.nl/search?q=Locutus&ie='
         *
         * @param str - 要解码的 URL。
         * @returns {string} - 返回解码后的 URL 字符串。
         */
        function rawurldecode(str) {
            return decodeURIComponent((str + '')
                .replace(/%(?![\da-f]{2})/gi, function () {
                return '%25';
            }));
        }
        zanejs.rawurldecode = rawurldecode;
        /**
         * 按照 RFC 3986 对 URL 进行编码
         *
         * example 1: rawurlencode('Kevin van Zonneveld!')
         * returns 1: 'Kevin%20van%20Zonneveld%21'
         *
         * example 2: rawurlencode('http://kvz.io/')
         * returns 2: 'http%3A%2F%2Fkvz.io%2F'
         *
         * example 3: rawurlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
         * returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
         *
         * @param str
         * @returns {string}
         */
        function rawurlencode(str) {
            str = (str + '');
            return encodeURIComponent(str)
                .replace(/!/g, '%21')
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\*/g, '%2A');
        }
        zanejs.rawurlencode = rawurlencode;
        /**
         * 解码已编码的 URL 字符串
         *
         * example 1: urldecode('Kevin+van+Zonneveld%21')
         * returns 1: 'Kevin van Zonneveld!'
         *
         * example 2: urldecode('http%3A%2F%2Fkvz.io%2F')
         * returns 2: 'http://kvz.io/'
         *
         * example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-' +
         * '8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a')
         * returns 3:
         * 'http://www.google.nl/search?q=Locutus&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
         *
         * example 4: urldecode('%E5%A5%BD%3_4')
         * returns 4: '\u597d%3_4'
         *
         * @param str - 要解码的字符串。
         * @returns {string} - 返回解码后的字符串。
         */
        function urldecode(str) {
            return decodeURIComponent((str + '')
                .replace(/%(?![\da-f]{2})/gi, function () {
                return '%25';
            })
                .replace(/\+/g, '%20'));
        }
        zanejs.urldecode = urldecode;
        /**
         * 编码 URL 字符串
         *
         * example 1: urlencode('Kevin van Zonneveld!')
         * returns 1: 'Kevin+van+Zonneveld%21'
         *
         * example 2: urlencode('http://kvz.io/')
         * returns 2: 'http%3A%2F%2Fkvz.io%2F'
         *
         * example 3: urlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
         * returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'
         *
         * @param str - 要编码的字符串。
         * @returns {string}
         */
        function urlencode(str) {
            str = (str + '');
            return encodeURIComponent(str)
                .replace(/!/g, '%21')
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\*/g, '%2A')
                .replace(/%20/g, '+');
        }
        zanejs.urlencode = urlencode;
        /**
         * 将 ISO-8859-1 编码的字符串转换为 UTF-8 编码
         * @param argString
         * @returns {*}
         */
        function utf8_encode(argString) {
            if (argString === null || typeof argString === 'undefined') {
                return '';
            }
            // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            var str = (argString + '');
            var utftext = '';
            var start;
            var end;
            var stringl = 0;
            start = end = 0;
            stringl = str.length;
            for (var n = 0; n < stringl; n++) {
                var c1 = str.charCodeAt(n);
                var enc = null;
                if (c1 < 128) {
                    end++;
                }
                else if (c1 > 127 && c1 < 2048) {
                    enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
                }
                else if ((c1 & 0xF800) !== 0xD800) {
                    enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
                }
                else {
                    // surrogate pairs
                    if ((c1 & 0xFC00) !== 0xD800) {
                        throw new RangeError('Unmatched trail surrogate at ' + n);
                    }
                    var c2 = str.charCodeAt(++n);
                    if ((c2 & 0xFC00) !== 0xDC00) {
                        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                    }
                    c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                    enc = String.fromCharCode((c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
                }
                if (enc !== null) {
                    if (end > start) {
                        utftext += str.slice(start, end);
                    }
                    utftext += enc;
                    start = end = n + 1;
                }
            }
            if (end > start) {
                utftext += str.slice(start, stringl);
            }
            return utftext;
        }
        zanejs.utf8_encode = utf8_encode;
        /**
         * 将用 UTF-8 方式编码的 ISO-8859-1 字符串转换成单字节的 ISO-8859-1 字符串。
         * @param strData
         * @returns {string}
         */
        function utf8_decode(strData) {
            var tmpArr = [];
            var i = 0;
            var c1 = 0;
            var seqlen = 0;
            strData += '';
            while (i < strData.length) {
                c1 = strData.charCodeAt(i) & 0xFF;
                seqlen = 0;
                // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
                if (c1 <= 0xBF) {
                    c1 = (c1 & 0x7F);
                    seqlen = 1;
                }
                else if (c1 <= 0xDF) {
                    c1 = (c1 & 0x1F);
                    seqlen = 2;
                }
                else if (c1 <= 0xEF) {
                    c1 = (c1 & 0x0F);
                    seqlen = 3;
                }
                else {
                    c1 = (c1 & 0x07);
                    seqlen = 4;
                }
                for (var ai = 1; ai < seqlen; ++ai) {
                    c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F));
                }
                if (seqlen === 4) {
                    c1 -= 0x10000;
                    tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)));
                    tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
                }
                else {
                    tmpArr.push(String.fromCharCode(c1));
                }
                i += seqlen;
            }
            return tmpArr.join('');
        }
        zanejs.utf8_decode = utf8_decode;
        /**
         * 产生一个可存储的值的表示
         * serialize() 返回字符串，此字符串包含了表示 value 的字节流，可以存储于任何地方。
         * 这有利于存储或传递 PHP 的值，同时不丢失其类型和结构。
         * 想要将已序列化的字符串变回 PHP 的值，可使用 unserialize()。
         *
         * example 1: serialize(['Kevin', 'van', 'Zonneveld'])
         * returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
         *
         * example 2: serialize({firstName: 'Kevin', midName: 'van'})
         * returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'
         *
         * @param mixedValue
         * @returns {*}
         */
        function serialize(mixedValue) {
            var val, key, okey;
            var ktype = '';
            var vals = '';
            var count = 0;
            var _utf8Size = function (str) {
                var size = 0;
                var i = 0;
                var l = str.length;
                var code = 0;
                for (i = 0; i < l; i++) {
                    code = str.charCodeAt(i);
                    if (code < 0x0080) {
                        size += 1;
                    }
                    else if (code < 0x0800) {
                        size += 2;
                    }
                    else {
                        size += 3;
                    }
                }
                return size;
            };
            var _getType = function (inp) {
                var match;
                var key1;
                var cons;
                var types;
                var type1 = typeof inp;
                if (type1 === 'object' && !inp) {
                    return 'null';
                }
                if (type1 === 'object') {
                    if (!inp.constructor) {
                        return 'object';
                    }
                    cons = inp.constructor.toString();
                    match = cons.match(/(\w+)\(/);
                    if (match) {
                        cons = match[1].toLowerCase();
                    }
                    types = ['boolean', 'number', 'string', 'array'];
                    for (key1 in types) {
                        if (cons === types[key1]) {
                            type1 = types[key1];
                            break;
                        }
                    }
                }
                return type1;
            };
            var type = _getType(mixedValue);
            switch (type) {
                case 'function':
                    val = '';
                    break;
                case 'boolean':
                    val = 'b:' + (mixedValue ? '1' : '0');
                    break;
                case 'number':
                    val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue;
                    break;
                case 'string':
                    val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"';
                    break;
                case 'array':
                case 'object':
                    val = 'a';
                    /*
                     if (type === 'object') {
                     var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
                     if (objname === undefined) {
                     return;
                     }
                     objname[1] = serialize(objname[1]);
                     val = 'O' + objname[1].substring(1, objname[1].length - 1);
                     }
                     */
                    for (key in mixedValue) {
                        if (mixedValue.hasOwnProperty(key)) {
                            ktype = _getType(mixedValue[key]);
                            if (ktype === 'function') {
                                continue;
                            }
                            okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
                            vals += serialize(okey) + serialize(mixedValue[key]);
                            count++;
                        }
                    }
                    val += ':' + count + ':{' + vals + '}';
                    break;
                case 'undefined':
                default:
                    // Fall-through
                    // if the JS object has a property which contains a null value,
                    // the string cannot be unserialized by PHP
                    val = 'N';
                    break;
            }
            if (type !== 'object' && type !== 'array') {
                val += ';';
            }
            return val;
        }
        zanejs.serialize = serialize;
        /**
         * 从已存储的表示中创建 PHP 的值
         *
         * example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
         * returns 1: ['Kevin', 'van', 'Zonneveld']
         *
         * example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
         * returns 2: {firstName: 'Kevin', midName: 'van'}
         *
         * example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
         * returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}
         *
         * @param data
         * @returns {*}
         */
        function unserialize(data) {
            var utf8Overhead = function (str) {
                var s = str.length;
                for (var i = str.length - 1; i >= 0; i--) {
                    var code = str.charCodeAt(i);
                    if (code > 0x7f && code <= 0x7ff) {
                        s++;
                    }
                    else if (code > 0x7ff && code <= 0xffff) {
                        s += 2;
                    }
                    // trail surrogate
                    if (code >= 0xDC00 && code <= 0xDFFF) {
                        i--;
                    }
                }
                return s - 1;
            };
            var error = function (type, msg, filename, line) {
                if (filename === void 0) { filename = null; }
                if (line === void 0) { line = null; }
                console.log(msg, filename, line);
            };
            var readUntil = function ($data, offset, stopchr) {
                var i = 2;
                var buf = [];
                var $chr = $data.slice(offset, offset + 1);
                while ($chr !== stopchr) {
                    if ((i + offset) > $data.length) {
                        error('Error', 'Invalid');
                    }
                    buf.push($chr);
                    $chr = $data.slice(offset + (i - 1), offset + i);
                    i += 1;
                }
                return [buf.length, buf.join('')];
            };
            var readChrs = function ($data, offset, length) {
                var i, $chr, buf;
                buf = [];
                for (i = 0; i < length; i++) {
                    $chr = $data.slice(offset + (i - 1), offset + i);
                    buf.push($chr);
                    length -= utf8Overhead($chr);
                }
                return [buf.length, buf.join('')];
            };
            function _unserialize($data, offset) {
                var dtype;
                var dataoffset;
                var keyandchrs;
                var keys;
                var contig;
                var length;
                var array;
                var readdata;
                var readData;
                var ccount;
                var stringlength;
                var i;
                var key;
                var kprops;
                var kchrs;
                var vprops;
                var vchrs;
                var value;
                var chrs = 0;
                var typeconvert = function (x) {
                    return x;
                };
                if (!offset) {
                    offset = 0;
                }
                dtype = ($data.slice(offset, offset + 1)).toLowerCase();
                dataoffset = offset + 2;
                switch (dtype) {
                    case 'i':
                        typeconvert = function (x) {
                            return parseInt(x, 10);
                        };
                        readData = readUntil($data, dataoffset, ';');
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 1;
                        break;
                    case 'b':
                        typeconvert = function (x) {
                            return parseInt(x, 10) !== 0;
                        };
                        readData = readUntil($data, dataoffset, ';');
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 1;
                        break;
                    case 'd':
                        typeconvert = function (x) {
                            return parseFloat(x);
                        };
                        readData = readUntil($data, dataoffset, ';');
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 1;
                        break;
                    case 'n':
                        readdata = null;
                        break;
                    case 's':
                        ccount = readUntil($data, dataoffset, ':');
                        chrs = ccount[0];
                        stringlength = ccount[1];
                        dataoffset += chrs + 2;
                        readData = readChrs($data, dataoffset + 1, parseInt(stringlength, 10));
                        chrs = readData[0];
                        readdata = readData[1];
                        dataoffset += chrs + 2;
                        if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                            error('SyntaxError', 'String length mismatch');
                        }
                        break;
                    case 'a':
                        readdata = {};
                        keyandchrs = readUntil($data, dataoffset, ':');
                        chrs = keyandchrs[0];
                        keys = keyandchrs[1];
                        dataoffset += chrs + 2;
                        length = parseInt(keys, 10);
                        contig = true;
                        for (i = 0; i < length; i++) {
                            kprops = _unserialize($data, dataoffset);
                            kchrs = kprops[1];
                            key = kprops[2];
                            dataoffset += kchrs;
                            vprops = _unserialize($data, dataoffset);
                            vchrs = vprops[1];
                            value = vprops[2];
                            dataoffset += vchrs;
                            if (key !== i) {
                                contig = false;
                            }
                            readdata[key] = value;
                        }
                        if (contig) {
                            array = new Array(length);
                            for (i = 0; i < length; i++) {
                                array[i] = readdata[i];
                            }
                            readdata = array;
                        }
                        dataoffset += 1;
                        break;
                    default:
                        error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
                        break;
                }
                return [dtype, dataoffset - offset, typeconvert(readdata)];
            }
            return _unserialize((data + ''), 0)[2];
        }
        zanejs.unserialize = unserialize;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * @module com.zanejs
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         * 获取系统时间
         * @returns {number}
         */
        function getTime() {
            var a = new Date();
            return a.getTime();
        }
        zanejs.getTime = getTime;
        var ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isIOS() {
            return ua.match(/(ipad|iphone|ipod)/i) != null;
        }
        /**
         * 是否IOS系统
         * @type {boolean}
         */
        zanejs.isIOS = _isIOS();
        /**
         *
         * @returns {Array}
         * @private
         */
        function _iOSVersion() {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
            }
            return [0, 0, 0];
        }
        /**
         * 获取IOS系统的版本
         * @type {number[]|number[]}
         */
        zanejs.iOSVersion = _iOSVersion();
        function _isOldIOS() {
            var win = window;
            var ver = '' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(ua)
                || [0, ''])[1];
            ver = ver
                .replace('undefined', '3_2')
                .replace('_', '.')
                .replace('_', '');
            return parseFloat(ver) < 10 && !win.MSStream;
        }
        /**
         * 10以下的IOS系统版本
         * @type {boolean}
         */
        zanejs.isOldIOS = _isOldIOS();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _isAndroid() {
            return ua.match(/android/i) != null;
        }
        /**
         * 是否 Android 系统
         * @type {boolean}
         */
        zanejs.isAndroid = _isAndroid();
        /**
         *
         * @returns {boolean}
         * @private
         */
        function _mobileHTML5() {
            return (ua.match(/(mobile|pre\/|xoom)/i) != null || _isIOS() || _isAndroid());
        }
        /**
         * 移动设备上的HTML5
         * @returns {boolean}
         */
        zanejs.mobileHTML5 = _mobileHTML5();
        /**
         * 圆周率
         * @type {number}
         */
        zanejs.PI = 3.14159265359;
        /**
         * 圆周率的倒数
         * @type {number}
         */
        zanejs.RECIPROCAL_PI = 1 / 3.14159265359;
        /**
         * 半圆周率
         * @type {number}
         */
        zanejs.HALF_PI = 3.14159265359 / 2;
        /**
         *
         * @type {number}
         */
        zanejs.PI64 = 3.141592653589793;
        /**
         * 角度转弧度
         * @type {number}
         */
        zanejs.DEGTORAD = 3.14159265359 / 180;
        /**
         * 弧度转角度
         * @type {number}
         */
        zanejs.RADTODEG = 180 / 3.14159265359;
        /**
         * 公差
         * @type {number}
         */
        zanejs.TOLERANCE = 1e-8;
        /**
         * 弧度转角度
         * @param value
         * @returns {number}
         */
        function radToDeg(value) {
            return value * zanejs.RADTODEG;
        }
        zanejs.radToDeg = radToDeg;
        /**
         * 角度转弧度
         * @param value
         * @returns {number}
         */
        function degToRad(value) {
            return value * zanejs.DEGTORAD;
        }
        zanejs.degToRad = degToRad;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
/**
 * webGL工具类
 * Created by zane.deng on 2016/4/20.
 */
var com;
(function (com) {
    var zanejs;
    (function (zanejs) {
        /**
         *
         * @param canvas
         * @param webGLSettings
         * @returns {WebGLRenderingContext}
         */
        function create3DContext(canvas, webGLSettings) {
            var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
            var context = null;
            for (var ii = 0; ii < names.length; ++ii) {
                try {
                    context = canvas.getContext(names[ii], webGLSettings);
                }
                catch (e) {
                    // todo
                }
                if (context) {
                    break;
                }
            }
            return context;
        }
        zanejs.create3DContext = create3DContext;
        function isWebGLSupported() {
            var contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };
            try {
                var win = window;
                if (!win.WebGLRenderingContext) {
                    return false;
                }
                var canvas = document.createElement('canvas');
                var gl = create3DContext(canvas, contextOptions);
                var success = !!(gl && gl.getContextAttributes().stencil);
                if (gl) {
                    var loseContext = gl.getExtension('WEBGL_lose_context');
                    if (loseContext) {
                        loseContext.loseContext();
                    }
                }
                gl = null;
                return success;
            }
            catch (e) {
                return false;
            }
        }
        zanejs.isWebGLSupported = isWebGLSupported;
        /**
         *
         * @param gl
         * @param source
         * @param type
         * @param defines
         * @param shaderVersion
         */
        function compileShader(gl, source, type, defines, shaderVersion) {
            var shader = gl.createShader(type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
            gl.shaderSource(shader, shaderVersion + (defines ? defines + '\n' : '') + source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                throw new Error(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        zanejs.compileShader = compileShader;
    })(zanejs = com.zanejs || (com.zanejs = {}));
})(com || (com = {}));
//# sourceMappingURL=zanejs.js.map