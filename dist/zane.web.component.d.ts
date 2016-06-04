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
        parent: HTMLElement;
        element: HTMLElement;
        events: any;
        options: any;
        children: any;
        constructor(parent: HTMLElement, options?: any);
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
        topDropElement: HTMLElement;
        bottomElement: HTMLElement;
        bottomContentElement: HTMLElement;
        bottomDropElement: HTMLElement;
        leftElement: HTMLElement;
        leftContentElement: HTMLElement;
        leftDropElement: HTMLElement;
        leftCollapseElement: HTMLElement;
        rightElement: HTMLElement;
        rightContentElement: HTMLElement;
        rightDropElement: HTMLElement;
        rightCollapseElement: HTMLElement;
        centerElement: HTMLElement;
        centerContentElement: HTMLElement;
        centerBottomElement: HTMLElement;
        centerBottomContentElement: HTMLElement;
        centerBottomDropElement: HTMLElement;
        lockElement: HTMLElement;
        draggingXLineElement: HTMLElement;
        draggingYLineElement: HTMLElement;
        draggingMaskElement: HTMLElement;
        private dragType;
        private xResize;
        private yResize;
        private middleWidth;
        private middleHeight;
        private middleTop;
        private leftWidth;
        private rightWidth;
        private bottomTop;
        private centerLeft;
        private centerWidth;
        private centerBottomHeight;
        private layoutHeight;
        private rightLeft;
        private isLeftCollapse;
        private isRightCollapse;
        private isResize;
        private stopDragBindFun;
        private dragBindFun;
        private resizeBindFun;
        constructor(parent: HTMLElement, options?: any);
        setLeftCollapse(isCollapse: boolean): boolean;
        setRightCollapse(isCollapse: boolean): boolean;
        protected _init(): void;
        protected _render(): void;
        private _addDropHandle();
        private _startDrag(dragType, e?);
        private _setCollapse();
        private _build();
        private _stopDrag(e?);
        private _drag(e?);
        private _updateCenterBottom(isHeightResize?);
        private _setDropHandlePosition();
        private _onResize();
    }
}
declare module zane.web.component {
    class Menu extends Component {
        menuItemCount: number;
        subMenuDict: any;
        menuYLineElement: HTMLElement;
        menuOverElement: HTMLElement;
        menuOverLElement: HTMLElement;
        menuOverRElement: HTMLElement;
        menuInnerElement: HTMLElement;
        shadowElement: HTMLElement;
        private showedSubMenu;
        private mouseleaveBindFun;
        private itemMouseEnterBindFun;
        private itemMouseLeaveBindFun;
        constructor(parent: HTMLElement, options?: any);
        show(options?: any): void;
        hide(menu?: HTMLElement): void;
        toggle(): void;
        addItem(data: any, target?: HTMLElement): void;
        removeItem(): void;
        hideAllSubMenu(): void;
        protected _init(): void;
        protected _render(): void;
        private updateShadow();
        private onMouseLeave(e);
        private onItemMouseEnter(e);
        private onItemMouseLeave(e);
    }
}
declare module zane.web.component {
    class MenuBar extends Component {
        constructor(parent: HTMLElement, options?: any);
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
        minLeftWidth: number;
        centerWidth: number;
        rightWidth: number;
        minRightWidth: number;
        centerBottomHeight: number;
        inWindow: boolean;
        isLeftCollapse: boolean;
        isRightCollapse: boolean;
        allowCenterBottomResize: boolean;
        allowLeftResize: boolean;
        allowRightResize: boolean;
        allowTopResize: boolean;
        allowBottomResize: boolean;
        space: number;
        content: number;
    }
}
declare module zane.web.component {
    class MenuOptions {
        id: string;
        width: number;
        x: number;
        y: number;
        customClass: string;
        shadow: boolean;
        menuData: Array<any>;
    }
}
