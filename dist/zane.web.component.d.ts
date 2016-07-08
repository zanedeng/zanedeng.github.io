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
        events: any;
        options: any;
        children: any;
        protected parent: HTMLElement;
        protected element: HTMLElement;
        constructor(options?: any, parent?: HTMLElement);
        getParent(): HTMLElement;
        setParent(value: HTMLElement): void;
        getElement(): HTMLElement;
        trigger(arg: string, data?: any): boolean;
        bind(arg: any, handler: Function, context?: any): void;
        unbind(arg: string, handler: Function): void;
        hasBind(arg: string): boolean;
        destroy(): void;
        protected _init(): void;
        protected _preRender(): void;
        protected _render(): void;
        protected _rendered(): void;
        protected _onResize(): void;
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
        private stopDragBindFun;
        private dragBindFun;
        private resizeBindFun;
        constructor(options?: any, parent?: HTMLElement);
        setLeftCollapse(isCollapse: boolean): boolean;
        setRightCollapse(isCollapse: boolean): boolean;
        destroy(): void;
        protected _init(): void;
        protected _render(): void;
        protected _onResize(): void;
        private _addDropHandle();
        private _startDrag(dragType, e?);
        private _setCollapse();
        private _build();
        private _stopDrag(e?);
        private _drag(e?);
        private _updateCenterBottom(isHeightResize?);
        private _setDropHandlePosition();
    }
}
declare module zane.web.component {
    class Menu extends Component {
        menuItemCount: number;
        menuYLineElement: HTMLElement;
        menuOverElement: HTMLElement;
        menuOverLElement: HTMLElement;
        menuOverRElement: HTMLElement;
        menuInnerElement: HTMLElement;
        shadowElement: HTMLElement;
        private subMenuDict;
        private menuItemDict;
        private menuItemDictByCfgId;
        private showedSubMenu;
        private mouseleaveBindFun;
        private itemMouseEnterBindFun;
        private itemMouseLeaveBindFun;
        constructor(options?: any);
        show(options?: any): void;
        hide(): void;
        toggle(): void;
        addItem(data: any, target?: HTMLElement): void;
        getMenuItem(itemId: string): HTMLElement;
        removeItem(itemId: string): void;
        setEnabled(itemId: string): void;
        isEnable(itemId: string): boolean;
        setDisabled(itemId: string): void;
        hideAllSubMenu(): void;
        destroy(): void;
        protected _init(): void;
        protected _render(): void;
        private updateShadow();
        private onMouseLeave(e);
        private onItemMouseEnter(e);
        private onItemMouseLeave(e);
        private onMouseClick(e);
    }
}
declare module zane.web.component {
    class MenuBar extends Component {
        menuCount: number;
        private menuDict;
        private menuBarItems;
        private showMenu;
        private currentShowMenu;
        private currentSelectMenuBarItem;
        private mouseenterBindFun;
        private mousedownBindFun;
        private mouseleaveBindFun;
        constructor(options?: any, parent?: HTMLElement);
        addItem(data?: any): void;
        protected _init(): void;
        protected _render(): void;
        private getMenu(menuBarItem);
        private showMenuBarItemMenu(menuBarItem);
        private onMouseEnter(e);
        private onMouseDown(e);
        private onMouseLeave(e);
    }
}
declare module zane.web.component {
    class Tree extends Component {
        constructor(options?: any, parent?: HTMLElement);
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
    class MenuBarOptions {
        menuBarData: Array<any>;
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
declare module zane.web.component {
    class TreeOptions {
        url: string;
        urlParms: string;
        data: any;
        checkbox: boolean;
        autoCheckboxEven: boolean;
        enabledCompleteCheckbox: boolean;
        parentIcon: string;
        childIcon: string;
        idFieldName: string;
        idField: any;
        textFieldName: string;
        iconFieldName: string;
        iconClsFieldName: string;
        parentIDField: any;
        parentIDFieldName: string;
        topParentIDValue: number;
        attribute: string[];
        treeLine: boolean;
        nodeWidth: number;
        statusName: string;
        isLeaf: Function;
        single: boolean;
        needCancel: boolean;
        slide: boolean;
        nodeDraggable: boolean;
        nodeDraggingRender: any;
        btnClickToToggleOnly: boolean;
        ajaxType: string;
        ajaxContentType: string;
        render: any;
        selectable: any;
        isExpand: any;
        delay: any;
        onBeforeExpand: Function;
        onContextmenu: Function;
        onExpand: Function;
        onBeforeCollapse: Function;
        onCollapse: Function;
        onBeforeSelect: Function;
        onSelect: Function;
        onBeforeCancelSelect: Function;
        onCancelselect: Function;
        onCheck: Function;
        onSuccess: Function;
        onError: Function;
        onClick: Function;
        onBeforeAppend: Function;
        onAppend: Function;
        onAfterAppend: Function;
    }
}
