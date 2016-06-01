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
        constructor(options?: any);
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
        static CONTENT_NONE: number;
        static CONTENT_TOP: number;
        static CONTENT_LEFT: number;
        static CONTENT_RIGHT: number;
        static CONTENT_BOTTOM: number;
        static CONTENT_CENTER: number;
        static CONTENT_CENTER_BOTTOM: number;
        topElement: HTMLElement;
        topContentElement: HTMLElement;
        bottomElement: HTMLElement;
        bottomContentElement: HTMLElement;
        leftElement: HTMLElement;
        leftContentElement: HTMLElement;
        rightElement: HTMLElement;
        rightContentElement: HTMLElement;
        centerElement: HTMLElement;
        centerContentElement: HTMLElement;
        centerBottomElement: HTMLElement;
        centerBottomContentElement: HTMLElement;
        constructor(options?: any);
        protected _init(): void;
        protected _render(): void;
    }
}
declare module zane.web.component {
    class LayoutOptions {
        id: string;
        width: string;
        height: string;
        heightDiff: number;
        topHeight: number;
        bottomHeight: number;
        leftWidth: number;
        centerWidth: number;
        rightWidth: number;
        centerBottomHeight: number;
        allowCenterBottomResize: boolean;
        inWindow: boolean;
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
        content: number;
    }
}
