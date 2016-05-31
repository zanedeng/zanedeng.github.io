/// <reference path="../libs/ts/zane.utils.d.ts" />
declare module zane.web.component {
    class Component {
        private static __uid;
        private static __instances;
        static addInstance(item: Component): void;
        static removeInstance(item: any): boolean;
        static getInstance(id: string): Component;
        static getAllInstance(): Array<Component>;
        static generateId(prev?: string): string;
        id: string;
        element: HTMLElement;
        events: any;
        options: any;
        children: any;
        constructor(element?: HTMLElement, options?: any);
        trigger(arg: string, data?: any): boolean;
        bind(arg: any, handler: Function, context?: any): void;
        unbind(arg: string, handler: Function): void;
        hasBind(arg: string): boolean;
        destroy(): void;
        protected _init(): void;
        protected _preRender(): void;
        protected _render(): void;
        protected _rendered(): void;
    }
}
declare module zane.web.component {
    class Layout extends Component {
        topElement: HTMLElement;
        topContentElement: HTMLElement;
        topHeight: number;
        bottomElement: HTMLElement;
        bottomHeight: number;
        leftElement: HTMLElement;
        leftWidth: number;
        centerElement: HTMLElement;
        centerWidth: number;
        rightElement: HTMLElement;
        rightWidth: number;
        centerBottomElement: HTMLElement;
        centerBottomHeight: number;
        allowCenterBottomResize: boolean;
        inWindow: boolean;
        heightDiff: number;
        height: string;
        allowLeftCollapse: boolean;
        isLeftCollapse: boolean;
        allowLeftResize: boolean;
        allowRightCollapse: boolean;
        isRightCollapse: boolean;
        allowRightResize: boolean;
        allowTopResize: boolean;
        allowBottomResize: boolean;
        space: number;
        minLeftWidth: number;
        minRightWidth: number;
        onEndResize: Function;
        onLeftToggle: Function;
        onRightToggle: Function;
        onHeightChanged: Function;
        constructor(element?: HTMLElement, options?: any);
        protected _init(): void;
    }
}
