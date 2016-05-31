var zane;
(function (zane) {
    var BrowserUtil = (function () {
        function BrowserUtil() {
        }
        BrowserUtil.innerHeight = function () {
            var _height;
            if (window.innerHeight)
                _height = window.innerHeight;
            else {
                if (document.compatMode == "CSS1Compat")
                    _height = document.documentElement.clientHeight;
                else {
                    _height = document.body.clientHeight;
                }
            }
            return _height;
        };
        BrowserUtil.innerWidth = function () {
            var _width;
            if (window.innerWidth)
                _width = window.innerWidth;
            else {
                if (document.compatMode == "CSS1Compat")
                    _width = document.documentElement.clientWidth;
                else {
                    _width = document.body.clientWidth;
                }
            }
            return _width;
        };
        return BrowserUtil;
    }());
    zane.BrowserUtil = BrowserUtil;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function BuildBridgedWorker(workerFunction, workerExportNames, mainExportNames, mainExportHandles) {
        var baseWorkerStr = workerFunction.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
        var extraWorkerStr = [];
        extraWorkerStr.push("var main = {};\n");
        for (var i = 0; i < mainExportNames.length; i++) {
            var name = mainExportNames[i];
            if (name.charAt(name.length - 1) == "*") {
                name = name.substr(0, name.length - 1);
                mainExportNames[i] = name;
                extraWorkerStr.push("main." + name + " = function(/* arguments */){\n var args = Array.prototype.slice.call(arguments); var buffers = args.pop(); \n self.postMessage({foo:'" + name + "', args:args},buffers)\n}; \n");
            }
            else {
                extraWorkerStr.push("main." + name + " = function(/* arguments */){\n var args = Array.prototype.slice.call(arguments); \n self.postMessage({foo:'" + name + "', args:args})\n}; \n");
            }
        }
        var tmpStr = [];
        for (var i = 0; i < workerExportNames.length; i++) {
            var name = workerExportNames[i];
            name = name.charAt(name.length - 1) == "*" ? name.substr(0, name.length - 1) : name;
            tmpStr.push(name + ": " + name);
        }
        extraWorkerStr.push("var foos={" + tmpStr.join(",") + "};\n");
        extraWorkerStr.push("self.onmessage = function(e){\n");
        extraWorkerStr.push("if(e.data.foo in foos) \n  foos[e.data.foo].apply(null, e.data.args); \n else \n throw(new Error('Main thread requested function ' + e.data.foo + '. But it is not available.'));\n");
        extraWorkerStr.push("\n};\n");
        var fullWorkerStr = baseWorkerStr + "\n\n/*==== STUFF ADDED BY BuildBridgeWorker ==== */\n\n" + extraWorkerStr.join("");
        var url = window.URL.createObjectURL(new Blob([fullWorkerStr], { type: 'text/javascript' }));
        var theWorker = new Worker(url);
        theWorker.onmessage = function (e) {
            var fooInd = mainExportNames.indexOf(e.data.foo);
            if (fooInd != -1)
                mainExportHandles[fooInd].apply(null, e.data.args);
            else
                throw (new Error("Worker requested function " + e.data.foo + ". But it is not available."));
        };
        var ret = { blobURL: url };
        var makePostMessageForFunction = function (name, hasBuffers) {
            if (hasBuffers)
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    var buffers = args.pop();
                    theWorker.postMessage({ foo: name, args: args }, buffers);
                };
            else
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    theWorker.postMessage({ foo: name, args: args });
                };
        };
        for (var i = 0; i < workerExportNames.length; i++) {
            var name = workerExportNames[i];
            if (name.charAt(name.length - 1) == "*") {
                name = name.substr(0, name.length - 1);
                ret[name] = makePostMessageForFunction(name, true);
            }
            else {
                ret[name] = makePostMessageForFunction(name, false);
            }
        }
        return ret;
    }
    zane.BuildBridgedWorker = BuildBridgedWorker;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Color = (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 0.0; }
            if (g === void 0) { g = 0.0; }
            if (b === void 0) { b = 0.0; }
            if (a === void 0) { a = 0.0; }
            this.r = 0.0;
            this.g = 0.0;
            this.b = 0.0;
            this.a = 0.0;
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.prototype.equals = function (color) {
            return this.a == color.a && this.g == color.g && this.b == color.b && this.r == color.r;
        };
        Color.prototype.rgba = function () {
            return new Float32Array([this.r, this.g, this.b, this.a]);
        };
        Color.prototype.rgb = function () {
            return new Float32Array([this.r, this.g, this.b]);
        };
        Color.prototype.toUniform = function (type) {
            if (typeof zane["App"] !== "undefined" && type == zane["App"].gl.FLOAT_VEC3)
                return this.rgb();
            else
                return this.rgba();
        };
        Color.white = new Color(1.0, 1.0, 1.0, 1.0);
        Color.black = new Color(0.0, 0.0, 0.0, 1.0);
        Color.red = new Color(1.0, 0.0, 0.0, 1.0);
        Color.green = new Color(0.0, 1.0, 0.0, 1.0);
        Color.blue = new Color(0.0, 0.0, 1.0, 1.0);
        return Color;
    }());
    zane.Color = Color;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var ColorUtil = (function () {
        function ColorUtil() {
        }
        ColorUtil.float32ColorToARGB = function (float32Color) {
            var a = (float32Color & 0xff000000) >>> 24;
            var r = (float32Color & 0xff0000) >>> 16;
            var g = (float32Color & 0xff00) >>> 8;
            var b = float32Color & 0xff;
            return [a, r, g, b];
        };
        ColorUtil.ARGBtoFloat32 = function (a, r, g, b) {
            return ((a << 24) | (r << 16) | (g << 8) | b);
        };
        ColorUtil.componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        ColorUtil.RGBToHexString = function (argb) {
            return "#" + ColorUtil.componentToHex(argb[1]) + ColorUtil.componentToHex(argb[2]) + ColorUtil.componentToHex(argb[3]);
        };
        ColorUtil.ARGBToHexString = function (argb) {
            return "#" + ColorUtil.componentToHex(argb[0]) + ColorUtil.componentToHex(argb[1]) + ColorUtil.componentToHex(argb[2]) + ColorUtil.componentToHex(argb[3]);
        };
        return ColorUtil;
    }());
    zane.ColorUtil = ColorUtil;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var HtmlUtl = (function () {
        function HtmlUtl() {
        }
        HtmlUtl.addClass = function (el, className) {
            if (typeof el === 'string')
                el = document.querySelectorAll(el);
            var els = (el instanceof NodeList) ? [].slice.call(el) : [el];
            els.forEach(function (e) {
                if (HtmlUtl.hasClass(e, className)) {
                    return;
                }
                if (e.classList) {
                    e.classList.add(className);
                }
                else {
                    e.className += ' ' + className;
                }
            });
        };
        HtmlUtl.removeClass = function (el, className) {
            if (typeof el === 'string')
                el = document.querySelectorAll(el);
            var els = (el instanceof NodeList) ? [].slice.call(el) : [el];
            els.forEach(function (e) {
                if (HtmlUtl.hasClass(e, className)) {
                    if (e.classList) {
                        e.classList.remove(className);
                    }
                    else {
                        e.className = e.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                    }
                }
            });
        };
        HtmlUtl.hasClass = function (el, className) {
            if (typeof el === 'string')
                el = document.querySelector(el);
            if (el.classList) {
                return el.classList.contains(className);
            }
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        };
        HtmlUtl.toggleClass = function (el, className) {
            if (typeof el === 'string')
                el = document.querySelector(el);
            var flag = HtmlUtl.hasClass(el, className);
            if (flag) {
                HtmlUtl.removeClass(el, className);
            }
            else {
                HtmlUtl.addClass(el, className);
            }
            return flag;
        };
        HtmlUtl.insertAfter = function (newEl, targetEl) {
            var parent = targetEl.parentNode;
            if (parent.lastChild === targetEl) {
                parent.appendChild(newEl);
            }
            else {
                parent.insertBefore(newEl, targetEl.nextSibling);
            }
        };
        HtmlUtl.remove = function (el) {
            if (typeof el === 'string') {
                [].forEach.call(document.querySelectorAll(el), function (node) {
                    node.parentNode.removeChild(node);
                });
            }
            else if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
            else if (el instanceof NodeList) {
                [].forEach.call(el, function (node) {
                    node.parentNode.removeChild(node);
                });
            }
            else {
                throw new Error('you can only pass Element, array of Elements or query string as argument');
            }
        };
        HtmlUtl.getDocumentScrollTop = function () {
            return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        };
        HtmlUtl.setDocumentScrollTop = function (value) {
            window.scrollTo(0, value);
            return value;
        };
        HtmlUtl.outerHeight = function (el) { return el.offsetHeight; };
        HtmlUtl.outerHeightWithMargin = function (el) {
            var height = el.offsetHeight;
            var style = getComputedStyle(el);
            height += (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
            return height;
        };
        HtmlUtl.outerWidth = function (el) { return el.offsetWidth; };
        HtmlUtl.outerWidthWithMargin = function (el) {
            var width = el.offsetWidth;
            var style = getComputedStyle(el);
            width += (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
            return width;
        };
        HtmlUtl.getComputedStyles = function (el) {
            return el.ownerDocument.defaultView.getComputedStyle(el, null);
        };
        HtmlUtl.getComputedStyle = function (el, att) {
            var win = el.ownerDocument.defaultView;
            var computed = win.getComputedStyle(el, null);
            return att ? computed[att] : computed;
        };
        HtmlUtl.getOffset = function (el) {
            var html = el.ownerDocument.documentElement;
            var box = { top: 0, left: 0 };
            if (typeof el.getBoundingClientRect !== 'undefined') {
                box = el.getBoundingClientRect();
            }
            return new zane.Point(box.top + window.pageYOffset - html.clientTop, box.left + window.pageXOffset - html.clientLeft);
        };
        HtmlUtl.getPosition = function (el) {
            var p = new zane.Point();
            if (el) {
                p.x = el.offsetLeft;
                p.y = el.offsetTop;
            }
            return p;
        };
        HtmlUtl.setStyle = function (node, att, val, style) {
            style = style || node.style;
            if (style) {
                if (val === null || val === '') {
                    val = '';
                }
                else if (!isNaN(Number(val)) && HtmlUtl.reUnit.test(att)) {
                    val += 'px';
                }
                if (att === '') {
                    att = 'cssText';
                    val = '';
                }
                style[att] = val;
            }
        };
        HtmlUtl.setStyles = function (el, hash) {
            var _this = this;
            var HAS_CSS_TEXT_FEATURE = typeof (el.style.cssText) !== 'undefined';
            function trim(str) {
                return str.replace(/^\s+|\s+$/g, '');
            }
            var originStyleText;
            var originStyleObj = {};
            if (!!HAS_CSS_TEXT_FEATURE) {
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
            var mergedStyleObj = Object["assign"]({}, originStyleObj, styleObj);
            var styleText = Object.keys(mergedStyleObj)
                .map(function (item) { return item + ': ' + mergedStyleObj[item] + ';'; })
                .join(' ');
            if (!!HAS_CSS_TEXT_FEATURE) {
                el.style.cssText = styleText;
            }
            else {
                el.setAttribute('style', styleText);
            }
        };
        HtmlUtl.getStyle = function (el, att, style) {
            style = style || el.style;
            var val = '';
            if (style) {
                val = style[att];
                if (val === '') {
                    val = this.getComputedStyle(el, att);
                }
            }
            return val;
        };
        HtmlUtl.get = function (selector) {
            return document.querySelector(selector) || {};
        };
        HtmlUtl.getAll = function (selector) {
            return document.querySelectorAll(selector) || {};
        };
        HtmlUtl.find = function (el, selector) {
            var found, maybeID = selector[0] == '#', maybeClass = !maybeID && selector[0] == '.', nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = HtmlUtl.simpleSelectorRE.test(nameOnly);
            if (zane.isDocument(el) && isSimple && maybeID) {
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
                var result;
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
        };
        HtmlUtl._showHide = function (el, show) {
            if (typeof el === 'string')
                el = document.querySelectorAll(el);
            var els = (el instanceof NodeList) ? [].slice.call(el) : [el];
            var display;
            var values = [];
            if (els.length === 0)
                return;
            els.forEach(function (e, index) {
                if (e.style) {
                    display = e.style.display;
                    if (show) {
                        if (display === 'none') {
                            values[index] = '';
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
        };
        HtmlUtl.show = function (elements) {
            HtmlUtl._showHide(elements, true);
        };
        HtmlUtl.hide = function (elements) {
            HtmlUtl._showHide(elements, false);
        };
        HtmlUtl.toggle = function (element) {
            if (element.style.display === 'none') {
                HtmlUtl.show(element);
            }
            else {
                HtmlUtl.hide(element);
            }
        };
        HtmlUtl.width = function (el) {
            var styles = HtmlUtl.getComputedStyles(el);
            var width = parseFloat(styles.width.indexOf('px') !== -1 ? styles.width : "0");
            var boxSizing = styles.boxSizing || 'content-box';
            if (boxSizing === 'border-box')
                return width;
            var borderLeftWidth = parseFloat(styles.borderLeftWidth);
            var borderRightWidth = parseFloat(styles.borderRightWidth);
            var paddingLeft = parseFloat(styles.paddingLeft);
            var paddingRight = parseFloat(styles.paddingRight);
            return width - borderRightWidth - borderLeftWidth - paddingLeft - paddingRight;
        };
        HtmlUtl.height = function (el) {
            var styles = HtmlUtl.getComputedStyles(el);
            var height = parseFloat(styles["height"].indexOf('px') !== -1 ? styles.height : "0");
            var boxSizing = styles.boxSizing || 'content-box';
            if (boxSizing === 'border-box')
                return height;
            var borderTopWidth = parseFloat(styles.borderTopWidth);
            var borderBottomWidth = parseFloat(styles.borderBottomWidth);
            var paddingTop = parseFloat(styles.paddingTop);
            var paddingBottom = parseFloat(styles.paddingBottom);
            return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
        };
        HtmlUtl.reUnit = /width|height|top|left|right|bottom|margin|padding/i;
        HtmlUtl.simpleSelectorRE = /^[\w-]*$/;
        return HtmlUtl;
    }());
    zane.HtmlUtl = HtmlUtl;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Vector3D = (function () {
        function Vector3D(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 0; }
            this.z = 0;
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        Vector3D.prototype.length = function () {
            return Math.sqrt(this.lengthSquared());
        };
        Vector3D.prototype.lengthSquared = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };
        Vector3D.prototype.add = function (a) {
            return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
        };
        Vector3D.prototype.clone = function () {
            return new Vector3D(this.x, this.y, this.z, this.w);
        };
        Vector3D.prototype.copyFrom = function (src) {
            this.x = src.x;
            this.y = src.y;
            this.z = src.z;
            this.w = src.w;
        };
        Vector3D.prototype.crossProduct = function (a) {
            return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x, 1);
        };
        Vector3D.prototype.decrementBy = function (a) {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
        };
        Vector3D.prototype.incrementBy = function (a) {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
        };
        Vector3D.prototype.dotProduct = function (a) {
            return this.x * a.x + this.y * a.y + this.z * a.z;
        };
        Vector3D.prototype.equals = function (toCompare, allFour) {
            if (allFour === void 0) { allFour = false; }
            return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (!allFour || this.w == toCompare.w));
        };
        Vector3D.prototype.nearEquals = function (toCompare, tolerance, allFour) {
            if (allFour === void 0) { allFour = true; }
            return ((Math.abs(this.x - toCompare.x) < tolerance) &&
                (Math.abs(this.y - toCompare.y) < tolerance) &&
                (Math.abs(this.z - toCompare.z) < tolerance) &&
                (!allFour || Math.abs(this.w - toCompare.w) < tolerance));
        };
        Vector3D.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        };
        Vector3D.prototype.normalize = function (thickness) {
            if (thickness === void 0) { thickness = 1; }
            var length = this.length();
            if (length != 0) {
                var invLength = thickness / length;
                this.x *= invLength;
                this.y *= invLength;
                this.z *= invLength;
            }
        };
        Vector3D.prototype.multiplyMatrix3D = function (matrix) {
            var x = this.x, y = this.y, z = this.z;
            this.x = matrix.rawData[0] * x + matrix.rawData[4] * y + matrix.rawData[8] * z + matrix.rawData[12];
            this.y = matrix.rawData[1] * x + matrix.rawData[5] * y + matrix.rawData[9] * z + matrix.rawData[13];
            this.z = matrix.rawData[2] * x + matrix.rawData[6] * y + matrix.rawData[10] * z + matrix.rawData[14];
        };
        Vector3D.prototype.project = function () {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
        };
        Vector3D.prototype.scaleBy = function (s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        };
        Vector3D.prototype.setTo = function (xa, ya, za) {
            this.x = xa;
            this.y = ya;
            this.z = za;
        };
        Vector3D.prototype.subtract = function (a) {
            return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
        };
        Vector3D.prototype.xyz = function () {
            return new Float32Array([this.x, this.y, this.z]);
        };
        Vector3D.prototype.toString = function () {
            return "{x:" + this.x + ", y:" + this.y + ", z" + this.z + ", w:" + this.w + "}";
        };
        Vector3D.angleBetween = function (a, b) {
            return Math.acos(a.dotProduct(b) / (a.length() * b.length()));
        };
        Vector3D.distance = function (pt1, pt2) {
            var x = (pt1.x - pt2.x);
            var y = (pt1.y - pt2.y);
            var z = (pt1.z - pt2.z);
            return Math.sqrt(x * x + y * y + z * z);
        };
        Vector3D.combine = function (a, b, ascl, bscl) {
            return new Vector3D(a.x * ascl + b.x * bscl, a.y * ascl + b.y * bscl, a.z * ascl + b.z * bscl);
        };
        return Vector3D;
    }());
    zane.Vector3D = Vector3D;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Point.prototype.add = function (v) {
            return new Point(this.x + v.x, this.y + v.y);
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.copyFrom = function (sourcePoint) {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        };
        Point.prototype.equals = function (toCompare) {
            return (this.x == toCompare.x && this.y == toCompare.y);
        };
        Point.prototype.normalize = function (thickness) {
            if (thickness === void 0) { thickness = 1; }
            var length = this.length();
            if (length != 0) {
                var invLength = thickness / length;
                this.x *= invLength;
                this.y *= invLength;
                return;
            }
            throw "Cannot divide by zero length.";
        };
        Point.prototype.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        Point.prototype.setTo = function (xa, ya) {
            this.x = xa;
            this.y = ya;
        };
        Point.prototype.subtract = function (v) {
            return new Point(this.x - v.x, this.y - v.y);
        };
        Point.prototype.toString = function () {
            return "{x:" + this.x + ", y:" + this.y + "}";
        };
        Point.distance = function (pt1, pt2) {
            var dx = pt2.x - pt1.x;
            var dy = pt2.y - pt1.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        Point.interpolate = function (pt1, pt2, f) {
            return new Point(pt2.x + (pt1.x - pt2.x) * f, pt2.y + (pt1.y - pt2.y) * f);
        };
        Point.polar = function (len, angle) {
            return new Point(len * Math.cos(angle), len * Math.sin(angle));
        };
        return Point;
    }());
    zane.Point = Point;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty, u, v, w) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            if (u === void 0) { u = 0; }
            if (v === void 0) { v = 0; }
            if (w === void 0) { w = 1; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            this.u = u;
            this.v = v;
            this.w = w;
        }
        Matrix.prototype.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty, this.u, this.v, this.w);
        };
        Matrix.prototype.concat = function (matrix) {
            var a1 = this.a * matrix.a + this.b * matrix.c;
            this.b = this.a * matrix.b + this.b * matrix.d;
            this.a = a1;
            var c1 = this.c * matrix.a + this.d * matrix.c;
            this.d = this.c * matrix.b + this.d * matrix.d;
            this.c = c1;
            var tx1 = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
            this.ty = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;
            this.tx = tx1;
        };
        Matrix.prototype.copyColumnFrom = function (column, vector3D) {
            if (column > 2) {
                throw "Column " + column + " out of bounds (2)";
            }
            else if (column == 0) {
                this.a = vector3D.x;
                this.c = vector3D.y;
                this.u = vector3D.z;
            }
            else if (column == 1) {
                this.b = vector3D.x;
                this.d = vector3D.y;
                this.v = vector3D.z;
            }
            else {
                this.tx = vector3D.x;
                this.ty = vector3D.y;
                this.w = vector3D.z;
            }
        };
        Matrix.prototype.copyColumnTo = function (column, vector3D) {
            if (column > 2) {
                throw ("ArgumentError, Column " + column + " out of bounds [0, ..., 2]");
            }
            else if (column == 0) {
                vector3D.x = this.a;
                vector3D.y = this.c;
                vector3D.z = this.u;
            }
            else if (column == 1) {
                vector3D.x = this.b;
                vector3D.y = this.d;
                vector3D.z = this.v;
            }
            else {
                vector3D.x = this.tx;
                vector3D.y = this.ty;
                vector3D.z = this.w;
            }
        };
        Matrix.prototype.copyFrom = function (sourceMatrix) {
            this.a = sourceMatrix.a;
            this.b = sourceMatrix.b;
            this.c = sourceMatrix.c;
            this.d = sourceMatrix.d;
            this.tx = sourceMatrix.tx;
            this.ty = sourceMatrix.ty;
            this.u = sourceMatrix.u;
            this.v = sourceMatrix.v;
            this.w = sourceMatrix.w;
        };
        Matrix.prototype.copyRowFrom = function (row, vector3D) {
            if (row > 2) {
                throw ("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
            }
            else if (row == 0) {
                this.a = vector3D.x;
                this.c = vector3D.y;
            }
            else if (row == 1) {
                this.b = vector3D.x;
                this.d = vector3D.y;
            }
            else {
                this.tx = vector3D.x;
                this.ty = vector3D.y;
            }
        };
        Matrix.prototype.copyRowTo = function (row, vector3D) {
            if (row > 2) {
                throw ("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
            }
            else if (row == 0) {
                vector3D.x = this.a;
                vector3D.y = this.b;
                vector3D.z = this.tx;
            }
            else if (row == 1) {
                vector3D.x = this.c;
                vector3D.y = this.d;
                vector3D.z = this.ty;
            }
            else {
                vector3D.setTo(0, 0, 1);
            }
        };
        Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
            if (rotation === void 0) { rotation = 0; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = scaleX;
            this.d = scaleY;
            this.b = rotation;
            this.tx = tx;
            this.ty = ty;
        };
        Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
            if (rotation === void 0) { rotation = 0; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = width / 1638.4;
            this.d = height / 1638.4;
            if (rotation != 0.0) {
                var cos = Math.cos(rotation);
                var sin = Math.sin(rotation);
                this.b = sin * this.d;
                this.c = -sin * this.a;
                this.a *= cos;
                this.d *= cos;
            }
            else {
                this.b = this.c = 0;
            }
            this.tx = tx + width / 2;
            this.ty = ty + height / 2;
        };
        Matrix.prototype.deltaTransformPoint = function (point) {
            return new zane.Point(point.x * this.a + point.y * this.c, point.x * this.b + point.y * this.d);
        };
        Matrix.prototype.identity = function () {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
        };
        Matrix.prototype.invert = function () {
            var a00 = this.a, a01 = this.c, a02 = this.tx, a10 = this.b, a11 = this.d, a12 = this.ty, a20 = this.u, a21 = this.v, a22 = this.w;
            var b01 = a22 * a11 - a12 * a21;
            var b11 = -a22 * a10 + a12 * a20;
            var b21 = a21 * a10 - a11 * a20;
            var d = a00 * b01 + a01 * b11 + a02 * b21;
            if (d == 0) {
                this.a = this.b = this.c = this.d = 0;
                this.tx = -this.tx;
                this.ty = -this.ty;
            }
            else {
                var id = 1.0 / d;
                this.a = b01 * id;
                this.c = (-a22 * a01 + a02 * a21) * id;
                this.tx = (a12 * a01 - a02 * a11) * id;
                this.b = b11 * id;
                this.d = (a22 * a00 - a02 * a20) * id;
                this.ty = (-a12 * a00 + a02 * a10) * id;
                this.u = b21 * id;
                this.v = (-a21 * a00 + a01 * a20) * id;
                this.w = (a11 * a00 - a01 * a10) * id;
            }
        };
        Matrix.prototype.transpose = function () {
            var a01 = this.c, a02 = this.tx, a12 = this.ty;
            this.c = this.b;
            this.tx = this.u;
            this.b = a01;
            this.ty = this.v;
            this.u = a02;
            this.v = a12;
        };
        Matrix.prototype.multiply = function (matrix) {
            var result = new Matrix();
            result.a = this.a * matrix.a + this.b * matrix.c;
            result.b = this.a * matrix.b + this.b * matrix.d;
            result.c = this.c * matrix.a + this.d * matrix.c;
            result.d = this.c * matrix.b + this.d * matrix.d;
            result.tx = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
            result.ty = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;
            return result;
        };
        Matrix.prototype.rotate = function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var a1 = this.a * cos - this.b * sin;
            this.b = this.a * sin + this.b * cos;
            this.a = a1;
            var c1 = this.c * cos - this.d * sin;
            this.d = this.c * sin + this.d * cos;
            this.c = c1;
            var tx1 = this.tx * cos - this.ty * sin;
            this.ty = this.tx * sin + this.ty * cos;
            this.tx = tx1;
        };
        Matrix.prototype.scale = function (sx, sy) {
            this.a *= sx;
            this.b *= sy;
            this.c *= sx;
            this.d *= sy;
            this.tx *= sx;
            this.ty *= sy;
        };
        Matrix.prototype.translate = function (dx, dy) {
            this.tx += dx;
            this.ty += dy;
        };
        Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        };
        Matrix.prototype.toArray = function () {
            return new Float32Array([
                this.a, this.c, this.tx,
                this.b, this.d, this.ty,
                this.u, this.v, this.w
            ]);
        };
        Matrix.prototype.toString = function () {
            return "{a:" + this.a + ", b:" + this.b + ", c:" + this.c + ", d:" +
                this.d + ", tx:" + this.tx + ", ty:" + this.ty + ", u:" + this.u + ", v:" + this.v + ", w:" + this.w + "}";
        };
        Matrix.prototype.transformPoint = function (point) {
            return new zane.Point(point.x * this.a + point.y * this.c + this.tx, point.x * this.b + point.y * this.d + this.ty);
        };
        Matrix.tempRawData = new Float32Array(9);
        return Matrix;
    }());
    zane.Matrix = Matrix;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Orientation3D = (function () {
        function Orientation3D() {
        }
        Orientation3D.AXIS_ANGLE = "axisAngle";
        Orientation3D.EULER_ANGLES = "eulerAngles";
        Orientation3D.QUATERNION = "quaternion";
        return Orientation3D;
    }());
    zane.Orientation3D = Orientation3D;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Matrix3D = (function () {
        function Matrix3D(v) {
            if (v === void 0) { v = null; }
            this.rawData = new Float32Array(16);
            if (v != null && v.length == 16) {
                this.copyRawDataFrom(v);
            }
            else {
                this.identity();
            }
        }
        Matrix3D.prototype.append = function (lhs) {
            var lrd = lhs.rawData;
            var m111 = this.rawData[0];
            var m112 = this.rawData[1];
            var m113 = this.rawData[2];
            var m114 = this.rawData[3];
            var m121 = this.rawData[4];
            var m122 = this.rawData[5];
            var m123 = this.rawData[6];
            var m124 = this.rawData[7];
            var m131 = this.rawData[8];
            var m132 = this.rawData[9];
            var m133 = this.rawData[10];
            var m134 = this.rawData[11];
            var m141 = this.rawData[12];
            var m142 = this.rawData[13];
            var m143 = this.rawData[14];
            var m144 = this.rawData[15];
            var m211 = lrd[0];
            var m212 = lrd[1];
            var m213 = lrd[2];
            var m214 = lrd[3];
            var m221 = lrd[4];
            var m222 = lrd[5];
            var m223 = lrd[6];
            var m224 = lrd[7];
            var m231 = lrd[8];
            var m232 = lrd[9];
            var m233 = lrd[10];
            var m234 = lrd[11];
            var m241 = lrd[12];
            var m242 = lrd[13];
            var m243 = lrd[14];
            var m244 = lrd[15];
            this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
            this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
            this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
            this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
            this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
            this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
            this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
            this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
            this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
            this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
            this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
            this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
            this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
            this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
            this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
            this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
        };
        Matrix3D.prototype.appendRotation = function (degrees, axis) {
            this.append(Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees));
        };
        Matrix3D.prototype.appendSkew = function (xSkew, ySkew, zSkew) {
            if (xSkew == 0 && ySkew == 0 && zSkew == 0)
                return;
            var raw = Matrix3D.tempRawData;
            raw[0] = 1;
            raw[1] = 0;
            raw[2] = 0;
            raw[3] = 0;
            raw[4] = xSkew;
            raw[5] = 1;
            raw[6] = 0;
            raw[7] = 0;
            raw[8] = ySkew;
            raw[9] = zSkew;
            raw[10] = 1;
            raw[11] = 0;
            raw[12] = 0;
            raw[13] = 0;
            raw[14] = 0;
            raw[15] = 1;
            this.append(Matrix3D.tempMatrix);
        };
        Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
            if (xScale == 1 && yScale == 1 && zScale == 1)
                return;
            var raw = Matrix3D.tempRawData;
            raw[0] = xScale;
            raw[1] = 0;
            raw[2] = 0;
            raw[3] = 0;
            raw[4] = 0;
            raw[5] = yScale;
            raw[6] = 0;
            raw[7] = 0;
            raw[8] = 0;
            raw[9] = 0;
            raw[10] = zScale;
            raw[11] = 0;
            raw[12] = 0;
            raw[13] = 0;
            raw[14] = 0;
            raw[15] = 1;
            this.append(Matrix3D.tempMatrix);
        };
        Matrix3D.prototype.appendTranslation = function (x, y, z) {
            this.rawData[12] += x;
            this.rawData[13] += y;
            this.rawData[14] += z;
        };
        Matrix3D.prototype.clone = function () {
            return new Matrix3D(this.rawData);
        };
        Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
            switch (column) {
                case 0:
                    this.rawData[0] = vector3D.x;
                    this.rawData[1] = vector3D.y;
                    this.rawData[2] = vector3D.z;
                    this.rawData[3] = vector3D.w;
                    break;
                case 1:
                    this.rawData[4] = vector3D.x;
                    this.rawData[5] = vector3D.y;
                    this.rawData[6] = vector3D.z;
                    this.rawData[7] = vector3D.w;
                    break;
                case 2:
                    this.rawData[8] = vector3D.x;
                    this.rawData[9] = vector3D.y;
                    this.rawData[10] = vector3D.z;
                    this.rawData[11] = vector3D.w;
                    break;
                case 3:
                    this.rawData[12] = vector3D.x;
                    this.rawData[13] = vector3D.y;
                    this.rawData[14] = vector3D.z;
                    this.rawData[15] = vector3D.w;
                    break;
                default:
                    throw new Error("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
            }
        };
        Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
            switch (column) {
                case 0:
                    vector3D.x = this.rawData[0];
                    vector3D.y = this.rawData[1];
                    vector3D.z = this.rawData[2];
                    vector3D.w = this.rawData[3];
                    break;
                case 1:
                    vector3D.x = this.rawData[4];
                    vector3D.y = this.rawData[5];
                    vector3D.z = this.rawData[6];
                    vector3D.w = this.rawData[7];
                    break;
                case 2:
                    vector3D.x = this.rawData[8];
                    vector3D.y = this.rawData[9];
                    vector3D.z = this.rawData[10];
                    vector3D.w = this.rawData[11];
                    break;
                case 3:
                    vector3D.x = this.rawData[12];
                    vector3D.y = this.rawData[13];
                    vector3D.z = this.rawData[14];
                    vector3D.w = this.rawData[15];
                    break;
                default:
                    throw new Error("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
            }
        };
        Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
            var sourceRaw = sourceMatrix3D.rawData;
            var len = sourceRaw.length;
            for (var c = 0; c < len; c++)
                this.rawData[c] = sourceRaw[c];
        };
        Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
            if (index === void 0) { index = 0; }
            if (transpose === void 0) { transpose = false; }
            if (transpose)
                this.transpose();
            var len = vector.length - index;
            for (var c = 0; c < len; c++)
                this.rawData[c] = vector[c + index];
            if (transpose)
                this.transpose();
        };
        Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
            if (index === void 0) { index = 0; }
            if (transpose === void 0) { transpose = false; }
            if (transpose)
                this.transpose();
            var len = this.rawData.length;
            for (var c = 0; c < len; c++)
                vector[c + index] = this.rawData[c];
            if (transpose)
                this.transpose();
        };
        Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
            switch (row) {
                case 0:
                    this.rawData[0] = vector3D.x;
                    this.rawData[4] = vector3D.y;
                    this.rawData[8] = vector3D.z;
                    this.rawData[12] = vector3D.w;
                    break;
                case 1:
                    this.rawData[1] = vector3D.x;
                    this.rawData[5] = vector3D.y;
                    this.rawData[9] = vector3D.z;
                    this.rawData[13] = vector3D.w;
                    break;
                case 2:
                    this.rawData[2] = vector3D.x;
                    this.rawData[6] = vector3D.y;
                    this.rawData[10] = vector3D.z;
                    this.rawData[14] = vector3D.w;
                    break;
                case 3:
                    this.rawData[3] = vector3D.x;
                    this.rawData[7] = vector3D.y;
                    this.rawData[11] = vector3D.z;
                    this.rawData[15] = vector3D.w;
                    break;
                default:
                    throw new Error("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
            }
        };
        Matrix3D.prototype.copyRowTo = function (row, vector3D) {
            switch (row) {
                case 0:
                    vector3D.x = this.rawData[0];
                    vector3D.y = this.rawData[4];
                    vector3D.z = this.rawData[8];
                    vector3D.w = this.rawData[12];
                    break;
                case 1:
                    vector3D.x = this.rawData[1];
                    vector3D.y = this.rawData[5];
                    vector3D.z = this.rawData[9];
                    vector3D.w = this.rawData[13];
                    break;
                case 2:
                    vector3D.x = this.rawData[2];
                    vector3D.y = this.rawData[6];
                    vector3D.z = this.rawData[10];
                    vector3D.w = this.rawData[14];
                    break;
                case 3:
                    vector3D.x = this.rawData[3];
                    vector3D.y = this.rawData[7];
                    vector3D.z = this.rawData[11];
                    vector3D.w = this.rawData[15];
                    break;
                default:
                    throw new Error("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
            }
        };
        Matrix3D.prototype.copyToMatrix3D = function (dest) {
            this.copyRawDataTo(dest.rawData);
        };
        Matrix3D.prototype.decompose = function (orientationStyle) {
            if (orientationStyle === void 0) { orientationStyle = "eulerAngles"; }
            if (this._components == null)
                this._components = [new zane.Vector3D(), new zane.Vector3D(), new zane.Vector3D(), new zane.Vector3D()];
            var colX = new zane.Vector3D(this.rawData[0], this.rawData[1], this.rawData[2]);
            var colY = new zane.Vector3D(this.rawData[4], this.rawData[5], this.rawData[6]);
            var colZ = new zane.Vector3D(this.rawData[8], this.rawData[9], this.rawData[10]);
            var pos = this._components[0];
            pos.x = this.rawData[12];
            pos.y = this.rawData[13];
            pos.z = this.rawData[14];
            var scale = this._components[3];
            var skew = this._components[2];
            scale.x = colX.length();
            colX.scaleBy(1 / scale.x);
            skew.x = colX.dotProduct(colY);
            colY = zane.Vector3D.combine(colY, colX, 1, -skew.x);
            scale.y = colY.length();
            colY.scaleBy(1 / scale.y);
            skew.x /= scale.y;
            skew.y = colX.dotProduct(colZ);
            colZ = zane.Vector3D.combine(colZ, colX, 1, -skew.y);
            skew.z = colY.dotProduct(colZ);
            colZ = zane.Vector3D.combine(colZ, colY, 1, -skew.z);
            scale.z = colZ.length();
            colZ.scaleBy(1 / scale.z);
            skew.y /= scale.z;
            skew.z /= scale.z;
            if (colX.dotProduct(colY.crossProduct(colZ)) < 0) {
                scale.z = -scale.z;
                colZ.x = -colZ.x;
                colZ.y = -colZ.y;
                colZ.z = -colZ.z;
            }
            var rot = this._components[1];
            switch (orientationStyle) {
                case zane.Orientation3D.AXIS_ANGLE:
                    rot.w = Math.acos((colX.x + colY.y + colZ.z - 1) / 2);
                    var len = Math.sqrt((colY.z - colZ.y) * (colY.z - colZ.y) + (colZ.x - colX.z) * (colZ.x - colX.z) + (colX.y - colY.x) * (colX.y - colY.x));
                    rot.x = (colY.z - colZ.y) / len;
                    rot.y = (colZ.x - colX.z) / len;
                    rot.z = (colX.y - colY.x) / len;
                    break;
                case zane.Orientation3D.QUATERNION:
                    var tr = colX.x + colY.y + colZ.z;
                    if (tr > 0) {
                        rot.w = Math.sqrt(1 + tr) / 2;
                        rot.x = (colY.z - colZ.y) / (4 * rot.w);
                        rot.y = (colZ.x - colX.z) / (4 * rot.w);
                        rot.z = (colX.y - colY.x) / (4 * rot.w);
                    }
                    else if ((colX.x > colY.y) && (colX.x > colZ.z)) {
                        rot.x = Math.sqrt(1 + colX.x - colY.y - colZ.z) / 2;
                        rot.w = (colY.z - colZ.y) / (4 * rot.x);
                        rot.y = (colX.y + colY.x) / (4 * rot.x);
                        rot.z = (colZ.x + colX.z) / (4 * rot.x);
                    }
                    else if (colY.y > colZ.z) {
                        rot.y = Math.sqrt(1 + colY.y - colX.x - colZ.z) / 2;
                        rot.x = (colX.y + colY.x) / (4 * rot.y);
                        rot.w = (colZ.x - colX.z) / (4 * rot.y);
                        rot.z = (colY.z + colZ.y) / (4 * rot.y);
                    }
                    else {
                        rot.z = Math.sqrt(1 + colZ.z - colX.x - colY.y) / 2;
                        rot.x = (colZ.x + colX.z) / (4 * rot.z);
                        rot.y = (colY.z + colZ.y) / (4 * rot.z);
                        rot.w = (colX.y - colY.x) / (4 * rot.z);
                    }
                    break;
                case zane.Orientation3D.EULER_ANGLES:
                    rot.y = Math.asin(-colX.z);
                    if (colX.z != 1 && colX.z != -1) {
                        rot.x = Math.atan2(colY.z, colZ.z);
                        rot.z = Math.atan2(colX.y, colX.x);
                    }
                    else {
                        rot.z = 0;
                        rot.x = Math.atan2(colY.x, colY.y);
                    }
                    break;
            }
            return this._components;
        };
        Matrix3D.prototype.deltaTransformVector = function (v, t) {
            if (t === void 0) { t = null; }
            var x = v.x;
            var y = v.y;
            var z = v.z;
            if (!t)
                t = new zane.Vector3D();
            t.x = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8];
            t.y = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9];
            t.z = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10];
            t.w = x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11];
            return t;
        };
        Matrix3D.prototype.identity = function () {
            this.rawData[0] = 1;
            this.rawData[1] = 0;
            this.rawData[2] = 0;
            this.rawData[3] = 0;
            this.rawData[4] = 0;
            this.rawData[5] = 1;
            this.rawData[6] = 0;
            this.rawData[7] = 0;
            this.rawData[8] = 0;
            this.rawData[9] = 0;
            this.rawData[10] = 1;
            this.rawData[11] = 0;
            this.rawData[12] = 0;
            this.rawData[13] = 0;
            this.rawData[14] = 0;
            this.rawData[15] = 1;
        };
        Matrix3D.prototype.interpolateTo = function (toMat, percent) {
            for (var i = 0; i < 16; ++i)
                this.rawData[i] = this.rawData[i] + (toMat.rawData[i] - this.rawData[i]) * percent;
        };
        Matrix3D.prototype.invert = function () {
            var d = this.determinant();
            var invertAble = Math.abs(d) > 0.00000000001;
            if (invertAble) {
                d = 1 / d;
                var m11 = this.rawData[0];
                var m12 = this.rawData[1];
                var m13 = this.rawData[2];
                var m14 = this.rawData[3];
                var m21 = this.rawData[4];
                var m22 = this.rawData[5];
                var m23 = this.rawData[6];
                var m24 = this.rawData[7];
                var m31 = this.rawData[8];
                var m32 = this.rawData[9];
                var m33 = this.rawData[10];
                var m34 = this.rawData[11];
                var m41 = this.rawData[12];
                var m42 = this.rawData[13];
                var m43 = this.rawData[14];
                var m44 = this.rawData[15];
                this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
                this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
                this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
                this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
                this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
                this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
                this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
                this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
                this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
                this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
                this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
                this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
                this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
                this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
                this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
                this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
            }
            return invertAble;
        };
        Matrix3D.prototype.prepend = function (rhs) {
            var m111 = rhs.rawData[0];
            var m112 = rhs.rawData[1];
            var m113 = rhs.rawData[2];
            var m114 = rhs.rawData[3];
            var m121 = rhs.rawData[4];
            var m122 = rhs.rawData[5];
            var m123 = rhs.rawData[6];
            var m124 = rhs.rawData[7];
            var m131 = rhs.rawData[8];
            var m132 = rhs.rawData[9];
            var m133 = rhs.rawData[10];
            var m134 = rhs.rawData[11];
            var m141 = rhs.rawData[12];
            var m142 = rhs.rawData[13];
            var m143 = rhs.rawData[14];
            var m144 = rhs.rawData[15];
            var m211 = this.rawData[0];
            var m212 = this.rawData[1];
            var m213 = this.rawData[2];
            var m214 = this.rawData[3];
            var m221 = this.rawData[4];
            var m222 = this.rawData[5];
            var m223 = this.rawData[6];
            var m224 = this.rawData[7];
            var m231 = this.rawData[8];
            var m232 = this.rawData[9];
            var m233 = this.rawData[10];
            var m234 = this.rawData[11];
            var m241 = this.rawData[12];
            var m242 = this.rawData[13];
            var m243 = this.rawData[14];
            var m244 = this.rawData[15];
            this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
            this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
            this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
            this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
            this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
            this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
            this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
            this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
            this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
            this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
            this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
            this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
            this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
            this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
            this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
            this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
        };
        Matrix3D.prototype.prependRotation = function (degrees, axis) {
            var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);
            this.prepend(m);
        };
        Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
            if (xScale == 1 && yScale == 1 && zScale == 1)
                return;
            var raw = Matrix3D.tempRawData;
            raw[0] = xScale;
            raw[1] = 0;
            raw[2] = 0;
            raw[3] = 0;
            raw[4] = 0;
            raw[5] = yScale;
            raw[6] = 0;
            raw[7] = 0;
            raw[8] = 0;
            raw[9] = 0;
            raw[10] = zScale;
            raw[11] = 0;
            raw[12] = 0;
            raw[13] = 0;
            raw[14] = 0;
            raw[15] = 1;
            this.prepend(Matrix3D.tempMatrix);
        };
        Matrix3D.prototype.prependTranslation = function (x, y, z) {
            var raw = Matrix3D.tempRawData;
            raw[0] = 1;
            raw[1] = 0;
            raw[2] = 0;
            raw[3] = 0;
            raw[4] = 0;
            raw[5] = 1;
            raw[6] = 0;
            raw[7] = 0;
            raw[8] = 0;
            raw[9] = 0;
            raw[10] = 1;
            raw[11] = 0;
            raw[12] = x;
            raw[13] = y;
            raw[14] = z;
            raw[15] = 1;
            this.prepend(Matrix3D.tempMatrix);
        };
        Matrix3D.prototype.recompose = function (components) {
            var pos = (components[0]) ? components[0] : this.getPosition();
            this.identity();
            var scale = components[3];
            if (scale && (scale.x != 1 || scale.y != 1 || scale.z != 1))
                this.appendScale(scale.x, scale.y, scale.z);
            var skew = components[2];
            if (skew && (skew.x != 0 || skew.y != 0 || skew.z != 0))
                this.appendSkew(skew.x, skew.y, skew.z);
            var sin;
            var cos;
            var raw = Matrix3D.tempRawData;
            raw[12] = 0;
            raw[13] = 0;
            raw[14] = 0;
            raw[15] = 0;
            var rotation = components[1];
            if (rotation) {
                var angle = -rotation.x;
                if (angle != 0) {
                    sin = Math.sin(angle);
                    cos = Math.cos(angle);
                    raw[0] = 1;
                    raw[1] = 0;
                    raw[2] = 0;
                    raw[3] = 0;
                    raw[4] = 0;
                    raw[5] = cos;
                    raw[6] = -sin;
                    raw[7] = 0;
                    raw[8] = 0;
                    raw[9] = sin;
                    raw[10] = cos;
                    raw[11] = 0;
                    this.append(Matrix3D.tempMatrix);
                }
                angle = -rotation.y;
                if (angle != 0) {
                    sin = Math.sin(angle);
                    cos = Math.cos(angle);
                    raw[0] = cos;
                    raw[1] = 0;
                    raw[2] = sin;
                    raw[3] = 0;
                    raw[4] = 0;
                    raw[5] = 1;
                    raw[6] = 0;
                    raw[7] = 0;
                    raw[8] = -sin;
                    raw[9] = 0;
                    raw[10] = cos;
                    raw[11] = 0;
                    this.append(Matrix3D.tempMatrix);
                }
                angle = -rotation.z;
                if (angle != 0) {
                    sin = Math.sin(angle);
                    cos = Math.cos(angle);
                    raw[0] = cos;
                    raw[1] = -sin;
                    raw[2] = 0;
                    raw[3] = 0;
                    raw[4] = sin;
                    raw[5] = cos;
                    raw[6] = 0;
                    raw[7] = 0;
                    raw[8] = 0;
                    raw[9] = 0;
                    raw[10] = 1;
                    raw[11] = 0;
                    this.append(Matrix3D.tempMatrix);
                }
            }
            this.setPosition(pos);
            this.rawData[15] = 1;
            return true;
        };
        Matrix3D.prototype.transformVector = function (v, t) {
            if (t === void 0) { t = null; }
            if (v == null)
                return t || new zane.Vector3D();
            var x = v.x;
            var y = v.y;
            var z = v.z;
            if (!t)
                t = new zane.Vector3D();
            t.x = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
            t.y = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
            t.z = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
            t.w = x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11] + this.rawData[15];
            return t;
        };
        Matrix3D.prototype.transformVectors = function (vin, vout) {
            var i = 0;
            var x = 0, y = 0, z = 0;
            while (i + 3 <= vin.length) {
                x = vin[i];
                y = vin[i + 1];
                z = vin[i + 2];
                vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
                vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
                vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
                i += 3;
            }
        };
        Matrix3D.prototype.transpose = function () {
            var raw = Matrix3D.tempRawData;
            this.copyRawDataTo(raw);
            this.rawData[1] = raw[4];
            this.rawData[2] = raw[8];
            this.rawData[3] = raw[12];
            this.rawData[4] = raw[1];
            this.rawData[6] = raw[9];
            this.rawData[7] = raw[13];
            this.rawData[8] = raw[2];
            this.rawData[9] = raw[6];
            this.rawData[11] = raw[14];
            this.rawData[12] = raw[3];
            this.rawData[13] = raw[7];
            this.rawData[14] = raw[11];
        };
        Matrix3D.prototype.determinant = function () {
            return ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) *
                (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) -
                (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) *
                    (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) +
                (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) *
                    (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) +
                (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) *
                    (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) -
                (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) *
                    (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) +
                (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) *
                    (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
        };
        Matrix3D.prototype.orthogonal = function (left, right, bottom, top, near, far, dest) {
            if (dest === void 0) { dest = null; }
            if (!dest) {
                dest = Matrix3D.tempMatrix;
            }
            var rl = (right - left), tb = (top - bottom), fn = (far - near);
            dest.rawData[0] = 2 / rl;
            dest.rawData[1] = 0;
            dest.rawData[2] = 0;
            dest.rawData[3] = 0;
            dest.rawData[4] = 0;
            dest.rawData[5] = 2 / tb;
            dest.rawData[6] = 0;
            dest.rawData[7] = 0;
            dest.rawData[8] = 0;
            dest.rawData[9] = 0;
            dest.rawData[10] = -2 / fn;
            dest.rawData[11] = 0;
            dest.rawData[12] = -(left + right) / rl;
            dest.rawData[13] = -(top + bottom) / tb;
            dest.rawData[14] = -(far + near) / fn;
            dest.rawData[15] = 1;
            return dest;
        };
        Matrix3D.prototype.frustum = function (left, right, bottom, top, near, far) {
            var rl = (right - left), tb = (top - bottom), fn = (far - near);
            this.rawData[0] = (near * 2) / rl;
            this.rawData[1] = 0;
            this.rawData[2] = 0;
            this.rawData[3] = 0;
            this.rawData[4] = 0;
            this.rawData[5] = (near * 2) / tb;
            this.rawData[6] = 0;
            this.rawData[7] = 0;
            this.rawData[8] = (right + left) / rl;
            this.rawData[9] = (top + bottom) / tb;
            this.rawData[10] = -(far + near) / fn;
            this.rawData[11] = -1;
            this.rawData[12] = 0;
            this.rawData[13] = 0;
            this.rawData[14] = -(far * near * 2) / fn;
            this.rawData[15] = 0;
            return this;
        };
        Matrix3D.prototype.perspective = function (fov, aspect, near, far) {
            var top = near * Math.tan(fov * Math.PI / 360.0), right = top * aspect;
            return this.frustum(-right, right, -top, top, near, far);
        };
        Matrix3D.prototype.toMatrix = function (dest) {
            if (!dest)
                dest = new zane.Matrix();
            dest.a = this.rawData[0];
            dest.c = this.rawData[1];
            dest.tx = this.rawData[2];
            dest.b = this.rawData[4];
            dest.d = this.rawData[5];
            dest.ty = this.rawData[6];
            dest.u = this.rawData[8];
            dest.v = this.rawData[9];
            dest.w = this.rawData[10];
            return dest;
        };
        Matrix3D.prototype.translate = function (dx, dy, dz) {
            if (dy === void 0) { dy = 0.0; }
            if (dz === void 0) { dz = 0.0; }
            this.rawData[12] = this.rawData[0] * dx + this.rawData[4] * dy + this.rawData[8] * dz + this.rawData[12];
            this.rawData[13] = this.rawData[1] * dx + this.rawData[5] * dy + this.rawData[9] * dz + this.rawData[13];
            this.rawData[14] = this.rawData[2] * dx + this.rawData[6] * dy + this.rawData[10] * dz + this.rawData[14];
            this.rawData[15] = this.rawData[3] * dx + this.rawData[7] * dy + this.rawData[11] * dz + this.rawData[15];
        };
        Matrix3D.prototype.scale = function (sx, sy, sz) {
            if (sy === void 0) { sy = 1.0; }
            if (sz === void 0) { sz = 1.0; }
            this.rawData[0] *= sx;
            this.rawData[1] *= sx;
            this.rawData[2] *= sx;
            this.rawData[3] *= sx;
            this.rawData[4] *= sy;
            this.rawData[5] *= sy;
            this.rawData[6] *= sy;
            this.rawData[7] *= sy;
            this.rawData[8] *= sz;
            this.rawData[9] *= sz;
            this.rawData[10] *= sz;
            this.rawData[11] *= sz;
        };
        Matrix3D.prototype.rotate = function (angle, axis) {
            var x = axis.x, y = axis.y, z = axis.z, len = axis.length(), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
            if (len == 0)
                return;
            if (len !== 1) {
                len = 1 / len;
                x *= len;
                y *= len;
                z *= len;
            }
            s = Math.sin(angle);
            c = Math.cos(angle);
            t = 1 - c;
            a00 = this.rawData[0];
            a01 = this.rawData[1];
            a02 = this.rawData[2];
            a03 = this.rawData[3];
            a10 = this.rawData[4];
            a11 = this.rawData[5];
            a12 = this.rawData[6];
            a13 = this.rawData[7];
            a20 = this.rawData[8];
            a21 = this.rawData[9];
            a22 = this.rawData[10];
            a23 = this.rawData[11];
            b00 = x * x * t + c;
            b01 = y * x * t + z * s;
            b02 = z * x * t - y * s;
            b10 = x * y * t - z * s;
            b11 = y * y * t + c;
            b12 = z * y * t + x * s;
            b20 = x * z * t + y * s;
            b21 = y * z * t - x * s;
            b22 = z * z * t + c;
            this.rawData[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.rawData[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.rawData[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.rawData[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.rawData[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.rawData[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.rawData[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.rawData[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.rawData[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.rawData[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.rawData[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.rawData[11] = a03 * b20 + a13 * b21 + a23 * b22;
        };
        Matrix3D.prototype.rotateX = function (angle) {
            var s = Math.sin(angle), c = Math.cos(angle), a10 = this.rawData[4], a11 = this.rawData[5], a12 = this.rawData[6], a13 = this.rawData[7], a20 = this.rawData[8], a21 = this.rawData[9], a22 = this.rawData[10], a23 = this.rawData[11];
            this.rawData[4] = a10 * c + a20 * s;
            this.rawData[5] = a11 * c + a21 * s;
            this.rawData[6] = a12 * c + a22 * s;
            this.rawData[7] = a13 * c + a23 * s;
            this.rawData[8] = a10 * -s + a20 * c;
            this.rawData[9] = a11 * -s + a21 * c;
            this.rawData[10] = a12 * -s + a22 * c;
            this.rawData[11] = a13 * -s + a23 * c;
        };
        Matrix3D.prototype.rotateY = function (angle) {
            var s = Math.sin(angle), c = Math.cos(angle), a00 = this.rawData[0], a01 = this.rawData[1], a02 = this.rawData[2], a03 = this.rawData[3], a20 = this.rawData[8], a21 = this.rawData[9], a22 = this.rawData[10], a23 = this.rawData[11];
            this.rawData[0] = a00 * c + a20 * -s;
            this.rawData[1] = a01 * c + a21 * -s;
            this.rawData[2] = a02 * c + a22 * -s;
            this.rawData[3] = a03 * c + a23 * -s;
            this.rawData[8] = a00 * s + a20 * c;
            this.rawData[9] = a01 * s + a21 * c;
            this.rawData[10] = a02 * s + a22 * c;
            this.rawData[11] = a03 * s + a23 * c;
        };
        Matrix3D.prototype.rotateZ = function (angle) {
            var s = Math.sin(angle), c = Math.cos(angle), a00 = this.rawData[0], a01 = this.rawData[1], a02 = this.rawData[2], a03 = this.rawData[3], a10 = this.rawData[4], a11 = this.rawData[5], a12 = this.rawData[6], a13 = this.rawData[7];
            this.rawData[0] = a00 * c + a10 * s;
            this.rawData[1] = a01 * c + a11 * s;
            this.rawData[2] = a02 * c + a12 * s;
            this.rawData[3] = a03 * c + a13 * s;
            this.rawData[4] = a00 * -s + a10 * c;
            this.rawData[5] = a01 * -s + a11 * c;
            this.rawData[6] = a02 * -s + a12 * c;
            this.rawData[7] = a03 * -s + a13 * c;
        };
        Matrix3D.prototype.getPosition = function () {
            if (this._position == null)
                this._position = new zane.Vector3D();
            this._position.x = this.rawData[12];
            this._position.y = this.rawData[13];
            this._position.z = this.rawData[14];
            return this._position;
        };
        Matrix3D.prototype.setPosition = function (value) {
            this.rawData[12] = value.x;
            this.rawData[13] = value.y;
            this.rawData[14] = value.z;
        };
        Matrix3D.prototype.toString = function () {
            return "[" +
                Math.round(this.rawData[0] * 1000) / 1000 + "," +
                Math.round(this.rawData[1] * 1000) / 1000 + "," +
                Math.round(this.rawData[2] * 1000) / 1000 + "," +
                Math.round(this.rawData[3] * 1000) / 1000 + "," +
                Math.round(this.rawData[4] * 1000) / 1000 + "," +
                Math.round(this.rawData[5] * 1000) / 1000 + "," +
                Math.round(this.rawData[6] * 1000) / 1000 + "," +
                Math.round(this.rawData[7] * 1000) / 1000 + "," +
                Math.round(this.rawData[8] * 1000) / 1000 + "," +
                Math.round(this.rawData[9] * 1000) / 1000 + "," +
                Math.round(this.rawData[10] * 1000) / 1000 + "," +
                Math.round(this.rawData[11] * 1000) / 1000 + "," +
                Math.round(this.rawData[12] * 1000) / 1000 + "," +
                Math.round(this.rawData[13] * 1000) / 1000 + "," +
                Math.round(this.rawData[14] * 1000) / 1000 + "," +
                Math.round(this.rawData[15] * 1000) / 1000 + "]";
        };
        Matrix3D.interpolate = function (thisMat, toMat, percent) {
            var m = new Matrix3D();
            for (var i = 0; i < 16; ++i)
                m.rawData[i] = thisMat.rawData[i] + (toMat.rawData[i] - thisMat.rawData[i]) * percent;
            return m;
        };
        Matrix3D.getAxisRotation = function (x, y, z, degrees) {
            var m = new Matrix3D();
            var rad = degrees * (Math.PI / 180);
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var t = 1 - c;
            var tmp1, tmp2;
            m.rawData[0] = c + x * x * t;
            m.rawData[5] = c + y * y * t;
            m.rawData[10] = c + z * z * t;
            tmp1 = x * y * t;
            tmp2 = z * s;
            m.rawData[1] = tmp1 + tmp2;
            m.rawData[4] = tmp1 - tmp2;
            tmp1 = x * z * t;
            tmp2 = y * s;
            m.rawData[8] = tmp1 + tmp2;
            m.rawData[2] = tmp1 - tmp2;
            tmp1 = y * z * t;
            tmp2 = x * s;
            m.rawData[9] = tmp1 - tmp2;
            m.rawData[6] = tmp1 + tmp2;
            return m;
        };
        Matrix3D.tempMatrix = new Matrix3D();
        Matrix3D.tempRawData = Matrix3D.tempMatrix.rawData;
        return Matrix3D;
    }());
    zane.Matrix3D = Matrix3D;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var Matrix3DUtil = (function () {
        function Matrix3DUtil() {
        }
        Matrix3DUtil.multiply = function (m1, m2, dest) {
            if (!dest) {
                dest = Matrix3DUtil._tempMatrix3D;
            }
            var a00 = m1.rawData[0], a01 = m1.rawData[1], a02 = m1.rawData[2], a03 = m1.rawData[3], a10 = m1.rawData[4], a11 = m1.rawData[5], a12 = m1.rawData[6], a13 = m1.rawData[7], a20 = m1.rawData[8], a21 = m1.rawData[9], a22 = m1.rawData[10], a23 = m1.rawData[11], a30 = m1.rawData[12], a31 = m1.rawData[13], a32 = m1.rawData[14], a33 = m1.rawData[15], b00 = m2.rawData[0], b01 = m2.rawData[1], b02 = m2.rawData[2], b03 = m2.rawData[3], b10 = m2.rawData[4], b11 = m2.rawData[5], b12 = m2.rawData[6], b13 = m2.rawData[7], b20 = m2.rawData[8], b21 = m2.rawData[9], b22 = m2.rawData[10], b23 = m2.rawData[11], b30 = m2.rawData[12], b31 = m2.rawData[13], b32 = m2.rawData[14], b33 = m2.rawData[15];
            dest.rawData[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            dest.rawData[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            dest.rawData[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            dest.rawData[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            dest.rawData[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            dest.rawData[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            dest.rawData[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            dest.rawData[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            dest.rawData[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            dest.rawData[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            dest.rawData[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            dest.rawData[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            dest.rawData[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            dest.rawData[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            dest.rawData[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            dest.rawData[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
            return dest;
        };
        Matrix3DUtil.inverse = function (mat, dest) {
            if (!dest) {
                dest = Matrix3DUtil._tempMatrix3D;
            }
            var a00 = mat.rawData[0], a01 = mat.rawData[1], a02 = mat.rawData[2], a03 = mat.rawData[3], a10 = mat.rawData[4], a11 = mat.rawData[5], a12 = mat.rawData[6], a13 = mat.rawData[7], a20 = mat.rawData[8], a21 = mat.rawData[9], a22 = mat.rawData[10], a23 = mat.rawData[11], a30 = mat.rawData[12], a31 = mat.rawData[13], a32 = mat.rawData[14], a33 = mat.rawData[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
            dest.rawData[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
            dest.rawData[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
            dest.rawData[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
            dest.rawData[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
            dest.rawData[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
            dest.rawData[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
            dest.rawData[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
            dest.rawData[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
            dest.rawData[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
            dest.rawData[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
            dest.rawData[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
            dest.rawData[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
            dest.rawData[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
            dest.rawData[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
            dest.rawData[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
            dest.rawData[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
            return dest;
        };
        Matrix3DUtil.toInverseMatrix = function (mat, dest) {
            var a00 = mat.rawData[0], a01 = mat.rawData[1], a02 = mat.rawData[2], a10 = mat.rawData[4], a11 = mat.rawData[5], a12 = mat.rawData[6], a20 = mat.rawData[8], a21 = mat.rawData[9], a22 = mat.rawData[10], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
            var d = a00 * b01 + a01 * b11 + a02 * b21;
            var id;
            if (!d) {
                return null;
            }
            id = 1 / d;
            if (!dest) {
                dest = Matrix3DUtil._tempMatrix;
            }
            dest[0] = b01 * id;
            dest[1] = (-a22 * a01 + a02 * a21) * id;
            dest[2] = (a12 * a01 - a02 * a11) * id;
            dest[3] = b11 * id;
            dest[4] = (a22 * a00 - a02 * a20) * id;
            dest[5] = (-a12 * a00 + a02 * a10) * id;
            dest[6] = b21 * id;
            dest[7] = (-a21 * a00 + a01 * a20) * id;
            dest[8] = (a11 * a00 - a01 * a10) * id;
            return dest;
        };
        Matrix3DUtil._tempMatrix3D = new zane.Matrix3D();
        Matrix3DUtil._tempMatrix = new zane.Matrix();
        return Matrix3DUtil;
    }());
    zane.Matrix3DUtil = Matrix3DUtil;
})(zane || (zane = {}));
var zane;
(function (zane) {
    var ajax = (function () {
        function ajax() {
        }
        ajax.request = function (arg) {
            var url = arg.url || null;
            var dataType = arg.dataType || 'text';
            var type = arg.type || 'post';
            var async = arg.async || true;
            var callback = arg.callback || null;
            var callbackFail = arg.callbackFail || null;
            var callbackProgress = arg.callbackProgress || null;
            var data = arg.data || null;
            if (!url)
                return null;
            var XMLHttpReq = ajax.getXMLHttpReq();
            data = ajax.parseData(data);
            if (type.toLowerCase() === "jsonp") {
                if (!arg.jsonp)
                    arg.jsonp = "jsonp";
                url += url.indexOf('?') == -1 ? '?' : '&';
                if (!ajax.isEmptyObject(data)) {
                    for (var o in data) {
                        url += o + "=" + data[o] + '&';
                    }
                    url = url.substring(0, url.length - 1);
                    url += "&" + arg.jsonp + "=zane.ajax.jsonpCallback";
                    var JSONP = document.createElement("script");
                    JSONP.type = "text/javascript";
                    JSONP.id = 'jsonp';
                    JSONP.src = url;
                    document.getElementsByTagName("head")[0].appendChild(JSONP);
                    if (callback)
                        ajax.$_GLOBAL.callback = callback;
                }
                else if (type.toLowerCase() === 'get') {
                    if (!ajax.isEmptyObject(data)) {
                        url += url.indexOf('?') == -1 ? '?' : '&';
                        for (var o in data) {
                            url += o + "=" + data[o] + '&';
                        }
                        url = url.substring(0, url.length - 1);
                    }
                    XMLHttpReq.open(type, url, async);
                }
                else {
                    var sendData = '';
                    XMLHttpReq.open(type, url, async);
                    XMLHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    if (!ajax.isEmptyObject(data)) {
                        for (var o in data) {
                            sendData += o + "=" + data[o] + '&';
                        }
                        sendData = sendData.substring(0, sendData.length - 1);
                    }
                    else {
                        sendData = null;
                    }
                }
                XMLHttpReq.send(sendData);
                XMLHttpReq.onerror = function (e) {
                    if (callbackFail)
                        callbackFail(e);
                };
                XMLHttpReq.onprogress = function (e) {
                    if (callbackProgress)
                        callbackProgress(e.loaded / e.total);
                };
                XMLHttpReq.onreadystatechange = function () {
                    if (XMLHttpReq.readyState == 4) {
                        if (XMLHttpReq.status == 200) {
                            var res = null;
                            switch (dataType.toLowerCase()) {
                                case 'json':
                                    res = XMLHttpReq.responseText;
                                    res = JSON.parse(res);
                                    break;
                                case 'xml':
                                    res = XMLHttpReq.responseXML;
                                    break;
                                case 'blob':
                                    res = XMLHttpReq.response;
                                    break;
                                default:
                                    res = XMLHttpReq.responseText;
                            }
                            if (callback) {
                                var fileInfo = ajax.parserCacheHeaders(XMLHttpReq.getAllResponseHeaders());
                                callback(res, fileInfo);
                            }
                        }
                    }
                };
            }
        };
        ajax.jsonpCallback = function (data) {
            document.getElementsByTagName("head")[0].removeChild(document.getElementById("jsonp"));
            if (ajax.$_GLOBAL.callback) {
                ajax.$_GLOBAL.callback(data);
            }
        };
        ajax.getXMLHttpReq = function () {
            var xhr = null;
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (E) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (E) {
                    xhr = new XMLHttpRequest();
                }
            }
            return xhr;
        };
        ajax.parseData = function (data) {
            if (!data)
                return {};
            if (typeof data != 'object') {
                try {
                    data = JSON.parse(data);
                }
                catch (e) {
                    data = eval("(" + data + ")");
                }
            }
            return data;
        };
        ajax.parserCacheHeaders = function (headers) {
            var rMaxAge = /max\-age=(\d+)/gi;
            var rNoCache = /Cache-Control:.*?no\-cache/gi;
            var rNoStore = /Cache-Control:.*?no\-store/gi;
            var rMustRevalidate = /Cache-Control:.*?must\-revalidate/gi;
            var rExpiry = /Expires:\s(.*)/gi;
            var warnings = [];
            var expires = rMaxAge.exec(headers);
            var useBy = Date.now();
            if (rNoStore.test(headers)) {
                warnings.push("Cache-Control: no-store is set");
            }
            if (rNoCache.test(headers)) {
                warnings.push("Cache-Control: no-cache is set");
            }
            if (rMustRevalidate.test(headers)) {
                warnings.push("Cache-Control: must-revalidate is set");
            }
            if (expires !== null) {
                useBy = Date.now() + (parseFloat(expires[1]) * 1000);
            }
            else {
                expires = rExpiry.exec(headers);
                if (expires !== null) {
                    useBy = Date.parse(expires[1]);
                }
                else {
                    warnings.push("Cache-Control: max-age and Expires: headers are not set");
                }
            }
            return {
                headers: headers,
                cacheable: (warnings.length === 0),
                useBy: useBy,
                warnings: warnings
            };
        };
        ;
        ajax.isEmptyObject = function (obj) {
            for (var name in obj)
                return false;
            return true;
        };
        ajax.$_GLOBAL = {};
        return ajax;
    }());
    zane.ajax = ajax;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function cancelRequestAnimationFrame() {
        var w = window;
        return w.cancelAnimationFrame ||
            w.webkitCancelAnimationFrame ||
            w.webkitCancelRequestAnimationFrame ||
            w.mozCancelAnimationFrame ||
            w.mozCancelRequestAnimationFrame ||
            w.oCancelRequestAnimationFrame ||
            w.msCancelRequestAnimationFrame ||
            function (timeout_id) {
                return window.clearTimeout(timeout_id);
            };
    }
    zane.cancelRequestAnimationFrame = cancelRequestAnimationFrame;
})(zane || (zane = {}));
var zane;
(function (zane) {
    zane.defaultImage = document.createElement("img");
    zane.defaultImage.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAKtJREFUeNrs2ksKgDAMBcBUekePo8fRU9YbpAspfjrZSjYDj5SHZTtai2T2NUr6/Yyh+xH5fsS9/SUmHwAAAAAAMPOUlj8DPn/ne/siAAAAAAAAJp46+s7rA0QAAAAAAADoA/QBIgAAAAAAAN73Duj9H/D0ndYHiAAAAAAAABg29e93Xh8gAgAAAAAAIH0H6ANEAAAAAAAA6AP0ASIAAAAAAADmmgsAAP//AwCuazpEOXa+fwAAAABJRU5ErkJggg==");
})(zane || (zane = {}));
var zane;
(function (zane) {
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
    zane.requestAnimationFrame = requestAnimationFrame;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function indexByObjectValue(arr, attribute, value) {
        for (var i = 0, l = arr.length; i < l; ++i) {
            var o = arr[i];
            if (o[attribute] == value) {
                return i;
            }
        }
        return -1;
    }
    zane.indexByObjectValue = indexByObjectValue;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function getFileExtension(filePath) {
        return filePath.split('.').pop();
    }
    zane.getFileExtension = getFileExtension;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function isPowerOf2() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var result = true;
        for (var i = 0, l = args.length; i < l; ++i) {
            var num = args[i];
            if (num <= 0 || (num & (num - 1)) != 0) {
                result = false;
                break;
            }
        }
        return result;
    }
    zane.isPowerOf2 = isPowerOf2;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function assign(obj, params) {
        for (var name in params) {
            try {
                obj[name] = params[name];
            }
            catch (err) { }
        }
        return obj;
    }
    zane.assign = assign;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function combine(defaultVars, additionalVars) {
        var combinedObject = {};
        var property;
        for (property in defaultVars) {
            combinedObject[property] = defaultVars[property];
        }
        for (property in additionalVars) {
            combinedObject[property] = additionalVars[property];
        }
        return combinedObject;
    }
    zane.combine = combine;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function createInstance(cls, properties, parameters) {
        if (properties === void 0) { properties = null; }
        if (parameters === void 0) { parameters = null; }
        if (!cls)
            return null;
        var instance;
        if (parameters) {
            switch (parameters.length) {
                case 0:
                    instance = new cls();
                    break;
                case 1:
                    instance = new cls(parameters[0]);
                    break;
                case 2:
                    instance = new cls(parameters[0], parameters[1]);
                    break;
                case 3:
                    instance = new cls(parameters[0], parameters[1], parameters[2]);
                    break;
                case 4:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3]);
                    break;
                case 5:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
                    break;
                case 6:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5]);
                    break;
                case 7:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6]);
                    break;
                case 8:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7]);
                    break;
                case 9:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8]);
                    break;
                case 10:
                    instance = new cls(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8], parameters[9]);
                    break;
                default:
                    return null;
            }
        }
        else
            instance = new cls();
        if (properties) {
            for (var key in properties) {
                if (instance.hasOwnProperty(key))
                    instance[key] = properties[key];
            }
        }
        return instance;
    }
    zane.createInstance = createInstance;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }
    zane.isDocument = isDocument;
})(zane || (zane = {}));
var zane;
(function (zane) {
    function cleanURL(url) {
        return url.replace(/.*?:\/\//, '');
    }
    zane.cleanURL = cleanURL;
})(zane || (zane = {}));
//# sourceMappingURL=zane.utils.js.map