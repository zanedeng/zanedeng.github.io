declare module zane {
    class BrowserUtil {
        static ua: string;
        private static _isIOS();
        static isIOS: boolean;
        private static _iOSVersion();
        static iOSVersion: number[];
        private static _isAndroid();
        static isAndroid: boolean;
        private static _isIE();
        static isIE: boolean;
        private static _isChrome();
        static isChrome: boolean;
        private static _isWebkit();
        static isWebkit: boolean;
        private static _isSafari();
        static isSafari: boolean;
        private static _isWeiXin();
        static isWeiXin: boolean;
        private static _isQQBrowser();
        static isQQBrowser: boolean;
        private static _isOpera();
        static isOpera: boolean;
        private static _mobileHTML5();
        static mobileHTML5: boolean;
        private static _network();
        static network: string;
        static touchSupported(): boolean;
        static getParams(): {};
        static getUrlParams(url: any): {};
        static innerHeight(): number;
        static innerWidth(): number;
    }
}
declare module zane {
    function BuildBridgedWorker(workerFunction: Function, workerExportNames: Array<string>, mainExportNames: Array<string>, mainExportHandles: Array<Function>): any;
}
declare module zane {
    class Color {
        static white: Color;
        static black: Color;
        static red: Color;
        static green: Color;
        static blue: Color;
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        equals(color: Color): boolean;
        rgba(): Float32Array;
        rgb(): Float32Array;
        toUniform(type: any): Float32Array;
    }
}
declare module zane {
    class ColorUtil {
        static float32ColorToARGB(float32Color: number): number[];
        static ARGBtoFloat32(a: number, r: number, g: number, b: number): number;
        private static componentToHex(c);
        static RGBToHexString(argb: number[]): string;
        static ARGBToHexString(argb: number[]): string;
    }
}
declare module zane {
    class HtmlUtl {
        static addClass(el: any, className: string): void;
        static removeClass(el: any, className: string): void;
        static hasClass(el: any, className: string): any;
        static toggleClass(el: any, className: string): any;
        static insertAfter(newEl: Element, targetEl: Element): void;
        static remove(el: any): void;
        static getDocumentScrollTop(): number;
        static setDocumentScrollTop(value: number): number;
        static outerHeight(el: HTMLElement): number;
        static outerHeightWithMargin(el: HTMLElement): number;
        static outerWidth(el: HTMLElement): number;
        static outerWidthWithMargin(el: HTMLElement): number;
        static getComputedStyles(el: HTMLElement): CSSStyleDeclaration;
        static getComputedStyle(el: any, att: any): any;
        static getOffset(el: any): Point;
        static getPosition(el: HTMLElement): Point;
        private static reUnit;
        static setStyle(node: any, att: any, val: any, style: any): void;
        static setStyles(el: HTMLElement, hash: any): void;
        static getStyle(el: HTMLElement, att: any, style: any): string;
        static get(selector: string): {};
        static getAll(selector: string): NodeListOf<Element> | {
            [x: number]: any;
        };
        private static simpleSelectorRE;
        static find(el: any, selector: any): any;
        private static _showHide(el, show);
        static show(elements: string | HTMLElement | NodeList): void;
        static hide(elements: string | HTMLElement | NodeList): void;
        static toggle(element: HTMLElement): void;
        static width(el: HTMLElement): number;
        static height(el: HTMLElement): number;
    }
}
declare module zane {
    class Vector3D {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        length(): number;
        lengthSquared(): number;
        add(a: Vector3D): Vector3D;
        clone(): Vector3D;
        copyFrom(src: Vector3D): void;
        crossProduct(a: Vector3D): Vector3D;
        decrementBy(a: Vector3D): void;
        incrementBy(a: Vector3D): void;
        dotProduct(a: Vector3D): number;
        equals(toCompare: Vector3D, allFour?: boolean): boolean;
        nearEquals(toCompare: Vector3D, tolerance: number, allFour?: boolean): boolean;
        negate(): void;
        normalize(thickness?: number): void;
        multiplyMatrix3D(matrix: Matrix3D): void;
        project(): void;
        scaleBy(s: number): void;
        setTo(xa: number, ya: number, za: number): void;
        subtract(a: Vector3D): Vector3D;
        xyz(): Float32Array;
        toString(): string;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        static combine(a: Vector3D, b: Vector3D, ascl: number, bscl: number): Vector3D;
    }
}
declare module zane {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        length(): number;
        add(v: Point): Point;
        clone(): Point;
        copyFrom(sourcePoint: Point): void;
        equals(toCompare: Point): boolean;
        normalize(thickness?: number): void;
        offset(dx: number, dy: number): void;
        setTo(xa: number, ya: number): void;
        subtract(v: Point): Point;
        toString(): string;
        static distance(pt1: Point, pt2: Point): number;
        static interpolate(pt1: Point, pt2: Point, f: number): Point;
        static polar(len: number, angle: number): Point;
    }
}
declare module zane {
    class Matrix {
        private static tempRawData;
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        u: number;
        v: number;
        w: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number, u?: number, v?: number, w?: number);
        clone(): Matrix;
        concat(matrix: Matrix): void;
        copyColumnFrom(column: number, vector3D: Vector3D): void;
        copyColumnTo(column: number, vector3D: Vector3D): void;
        copyFrom(sourceMatrix: Matrix): void;
        copyRowFrom(row: number, vector3D: Vector3D): void;
        copyRowTo(row: number, vector3D: Vector3D): void;
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        deltaTransformPoint(point: Point): Point;
        identity(): void;
        invert(): void;
        transpose(): void;
        multiply(matrix: Matrix): Matrix;
        rotate(angle: number): void;
        scale(sx: number, sy: number): void;
        translate(dx: number, dy: number): void;
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        toArray(): Float32Array;
        toString(): string;
        transformPoint(point: Point): Point;
    }
}
declare module zane {
    class Orientation3D {
        static AXIS_ANGLE: string;
        static EULER_ANGLES: string;
        static QUATERNION: string;
    }
}
declare module zane {
    class Matrix3D {
        private static tempMatrix;
        private static tempRawData;
        rawData: Float32Array;
        private _position;
        private _components;
        constructor(v?: Float32Array);
        append(lhs: Matrix3D): void;
        appendRotation(degrees: number, axis: Vector3D): void;
        appendSkew(xSkew: number, ySkew: number, zSkew: number): void;
        appendScale(xScale: number, yScale: number, zScale: number): void;
        appendTranslation(x: number, y: number, z: number): void;
        clone(): Matrix3D;
        copyColumnFrom(column: number, vector3D: Vector3D): void;
        copyColumnTo(column: number, vector3D: Vector3D): void;
        copyFrom(sourceMatrix3D: Matrix3D): void;
        copyRawDataFrom(vector: Float32Array, index?: number, transpose?: boolean): void;
        copyRawDataTo(vector: Float32Array, index?: number, transpose?: boolean): void;
        copyRowFrom(row: number, vector3D: Vector3D): void;
        copyRowTo(row: number, vector3D: Vector3D): void;
        copyToMatrix3D(dest: Matrix3D): void;
        decompose(orientationStyle?: string): Vector3D[];
        deltaTransformVector(v: Vector3D, t?: Vector3D): Vector3D;
        identity(): void;
        interpolateTo(toMat: Matrix3D, percent: number): void;
        invert(): boolean;
        prepend(rhs: Matrix3D): void;
        prependRotation(degrees: number, axis: Vector3D): void;
        prependScale(xScale: number, yScale: number, zScale: number): void;
        prependTranslation(x: number, y: number, z: number): void;
        recompose(components: Vector3D[]): boolean;
        transformVector(v: Vector3D, t?: Vector3D): Vector3D;
        transformVectors(vin: number[], vout: number[]): void;
        transpose(): void;
        determinant(): number;
        orthogonal(left: number, right: number, bottom: number, top: number, near: number, far: number, dest?: Matrix3D): Matrix3D;
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix3D;
        perspective(fov: number, aspect: number, near: number, far: number): Matrix3D;
        toMatrix(dest: Matrix): Matrix;
        translate(dx: number, dy?: number, dz?: number): void;
        scale(sx: number, sy?: number, sz?: number): void;
        rotate(angle: number, axis: Vector3D): void;
        rotateX(angle: number): void;
        rotateY(angle: number): void;
        rotateZ(angle: number): void;
        getPosition(): Vector3D;
        setPosition(value: Vector3D): void;
        toString(): string;
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        static getAxisRotation(x: number, y: number, z: number, degrees: number): Matrix3D;
    }
}
declare module zane {
    class Matrix3DUtil {
        private static _tempMatrix3D;
        private static _tempMatrix;
        static multiply(m1: Matrix3D, m2: Matrix3D, dest: Matrix3D): Matrix3D;
        static inverse(mat: Matrix3D, dest: Matrix3D): Matrix3D;
        static toInverseMatrix(mat: Matrix3D, dest: Matrix): Matrix;
    }
}
declare module zane {
    class ajax {
        private static $_GLOBAL;
        static request(arg: any): void;
        static jsonpCallback(data: any): void;
        private static getXMLHttpReq();
        private static parseData(data);
        private static parserCacheHeaders(headers);
        private static isEmptyObject(obj);
    }
}
declare module zane {
    function cancelRequestAnimationFrame(): Function;
}
declare module zane {
    var defaultImage: HTMLImageElement;
}
declare module zane {
    function requestAnimationFrame(): Function;
}
declare module zane {
    function indexByObjectValue(arr: Array<any>, attribute: string, value: any): number;
}
declare module zane {
    function getFileExtension(filePath: string): string;
}
declare module zane {
    function isPowerOf2(...args: Array<number>): boolean;
}
declare module zane {
    function assign(obj: any, params: any): any;
}
declare module zane {
    function combine(defaultVars: any, additionalVars: any): any;
}
declare module zane {
    function createInstance(cls: any, properties?: any, parameters?: Array<any>): any;
}
declare module zane {
    function isDocument(obj: any): boolean;
}
declare module zane {
    function cleanURL(url: string): string;
}
