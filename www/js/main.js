(function(){
    var queue = new zane.LoaderQueue({ignoreErrors: true});
    queue.addEventListener(zane.LoaderQueueEvent.START, onQueueStart);
    queue.addEventListener(zane.LoaderQueueEvent.COMPLETE, onCompleteQueue);
    queue.addEventListener(zane.LoaderQueueEvent.PROGRESS, onQueueProgress);
    for (var i=0, l=preloadFile.length; i<l; ++i)
    {
        queue.add(preloadFile[i], {loadingType:zane.Loader.LOAD_AS_XHR});
    }
    queue.start();

    function onQueueStart()
    {
        console.log("START");
    }

    function onQueueProgress()
    {
        console.log(queue.progress()+"--");
    }

    function onCompleteQueue()
    {
        console.log(queue);
        for (var i=0, l=queue.items.length; i<l;++i)
        {
            var scriptDeCode = queue.items[i].data;
            var scriptECode = "";
            for (var j = 0; j < scriptDeCode.length; j+=2)
            {
                var code1 = scriptDeCode.charCodeAt(j) & 0xff;
                var code2 = scriptDeCode.charCodeAt(j+1) & 0xff;
                scriptECode += String.fromCharCode(code1 | (code2<<8));
            }
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.innerHTML = decompress(scriptECode);
            _getHeadElement().appendChild(script);
            _getHeadElement().removeChild(script);
        }
    }

    /**
     *
     * @param compressed
     * @returns {*}
     */
    function decompress(compressed)
    {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return _decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
    }

    /**
     * 减压
     * @param length
     * @param resetValue
     * @param getNextValue
     * @returns {*}
     * @private
     */
    function _decompress(length, resetValue, getNextValue) {
        var dictionary = [],
            next,
            enlargeIn = 4,
            dictSize = 4,
            numBits = 3,
            entry = "",
            result = [],
            i,
            w,
            bits, resb, maxpower, power,
            c,
            data = {val: getNextValue(0), position: resetValue, index: 1};

        for (i = 0; i < 3; i += 1) {
            dictionary[i] = i;
        }

        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;
        while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
        }

        switch (next = bits) {
            case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                c = String.fromCharCode(bits);
                break;
            case 2:
                return "";
        }
        dictionary[3] = c;
        w = c;
        result.push(c);
        while (true) {
            if (data.index > length) {
                return "";
            }

            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }

            switch (c = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }

                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    dictionary[dictSize++] = String.fromCharCode(bits);
                    c = dictSize - 1;
                    enlargeIn--;
                    break;
                case 2:
                    return result.join('');
            }

            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }

            if (dictionary[c]) {
                entry = dictionary[c];
            }
            else {
                if (c === dictSize) {
                    entry = w + w.charAt(0);
                }
                else {
                    return null;
                }
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
            }
        }
    }

    function _getHeadElement()
    {
        var head = document.head || document.getElementsByTagName('head')[0];
        if (!head)
        {
            head = document.createElement('head');
            var body = document.body || document.getElementsByTagName('body')[0];
            if (body) {
                body.parentNode.insertBefore(head, body);
            }
            else {
                document.documentElement.appendChild(head);
            }
        }
        return head;
    }
})();