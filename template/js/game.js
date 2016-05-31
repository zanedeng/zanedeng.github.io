(function(){
            var element = document.createElement('div');
            var oldDocumentWrite = document.write;
            document.write = function (node)
            {
                insertAndExecute(node);
            };

            function insertAndExecute(text)
            {
                element.innerHTML = text;
                var scripts = [];
                var ret = element.childNodes;
                for (var i = 0; ret[i]; i++)
                {
                    if (scripts && nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript"))
                    {
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
                    }
                }

                for (var script in scripts)
                {
                    evalScript(scripts[script]);
                }
            }

            function nodeName(elem, name)
            {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            }

            function evalScript(elem)
            {
                var data = ( elem.text || elem.textContent || elem.innerHTML || "" );

                var head = document.getElementsByTagName("head")[0] || document.documentElement, script = document.createElement("script");
                script.type = "text/javascript";
                script.appendChild(document.createTextNode(data));
                head.insertBefore(script, head.firstChild);
                head.removeChild(script);

                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
            }

            function loadScript(url, callback)
            {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (script.readyState)
                {
                    script.onreadystatechange = function ()
                    {
                        if (script.readyState == "loaded" ||
                                script.readyState == "complete")
                        {
                            script.onreadystatechange = null;
                            if (callback) callback();
                        }
                    };
                }
                else
                {
                    script.onload = function () { if (callback) callback(); };
                }
                script.src = url;
                document.body.appendChild(script);
            }

            window.onload = function ()
            {
                loadScript("js/zane.loader.min.js", function ()
                {
                    loadScript("js/config.js?r=" + Math.random(), function ()
                    {
                        loadScript("js/main.js?=" + Math.random());
                        setTimeout(function ()
                        {
                            document.write = oldDocumentWrite
                        }, 500)
                    });
                });
            };
        })();