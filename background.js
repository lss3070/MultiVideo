var localstorage;
const settingBoundaries = {
    width: 300,
    height: 300,
    minWidth: 150,
    minHeight: 200
};
const windowBoundaries = {
    width: 500,
    height: 350,
    minWidth: 170,
    minHeight: 30
};

chrome
    .storage
    .sync
    .get(function (items) {
        if (items) 
            localstorage = items;
        }
    );
chrome
    .storage
    .sync
    .onChanged
    .addListener(function (items) {
        Object
            .entries(items)
            .forEach(function (key) {
                localstorage[key[0]] = key[1].newValue;
            });
    });

chrome
    .runtime
    .onMessage
    .addListener(function (request) {
        if (typeof request.open !== 'undefined') {
            if (chrome.app.window.get(request.open)) {
                chrome
                    .app
                    .window
                    .get(request.open)
                    .onClosed
                    .addListener(function () {
                        createWindow({
                            'url': './src/html/' + request.open + '.html',
                            'id': request.open
                        });
                    });
                chrome
                    .app
                    .window
                    .get(request.open)
                    .close();
                return;
            }
        }

        if (request.open === 'window') {
            createWindow(
                {url: './src/html/window.html', id: 'window', bounds: windowBoundaries}
            );
        }
        if (request.open === 'setting') {
            createWindow(
                {url: './src/html/setting.html', id: 'setting', bounds: settingBoundaries}
            );
            if (chrome.app.window.get('window') != null) {
                let temp = chrome
                    .app
                    .window
                    .get('window')
                    .contentWindow
                    .document
                    .getElementById('window_container');
                temp.setZoom(localstorage.size)
            }

        }
        if (request.close === 'setting') {
            chrome
                .app
                .window
                .get('setting')
                .close();
        }
    });

chrome
    .app
    .runtime
    .onLaunched
    .addListener(function () {
        createWindow(
            {url: './src/html/setting.html', id: 'setting', bounds: settingBoundaries}
        );
    });

function createWindow(param) {
    param.id = param.id !== param.id !== 'undefined'
        ? param.id
        : 'setting';
    param.bounds = (
        typeof param.bounds !== 'undefined'
            ? param.bounds
            : {
                width: 500,
                height: 350,
                minWidth: 170,
                minHeight: 30
            }
    );

    chrome
        .app
        .window
        .create(param.url, {
            frame: 'none',
            id: param.id,
            alwaysOnTop: localstorage
                ?.fixed ?? false,
            outerBounds: param.bounds,
            resizable: true
        }, function (window) {
            const addStyle = function (styleString) {
                const style = window
                    .contentWindow
                    .document
                    .createElement('style');
                style.textContent = styleString;
                window
                    .contentWindow
                    .document
                    .head
                    .append(style);
            }
            window.contentWindow.onload = function () {
                let closeBtn = window
                        .contentWindow
                        .document
                        .getElementById('close_window_btn')
                    settingBtn = window
                        .contentWindow
                        .document
                        .getElementById('setting_window_btn'),
                    fixedBtn = window
                        .contentWindow
                        .document
                        .getElementById('fix_window_btn'),
                    windowToolBar = window
                        .contentWindow
                        .document
                        .getElementById('window_toolbar'),
                    windowContainer = window
                        .contentWindow
                        .document
                        .getElementById('window_container'),
                    body = window
                        .contentWindow
                        .document
                        .querySelector('body'),
                    buttonList = window
                        .contentWindow
                        .document
                        .getElementById('window_buttonlst'),
                    zoomRange = window
                        .contentWindow
                        .document
                        .getElementById("size_window_slider"),
                    underBar = window
                        .contentWindow
                        .document
                        .getElementById("underbar_window_btn"),
                    autocomplete = window
                        .contentWindow
                        .document
                        .getElementById("input_area"),
                    serachBtn = window
                        .contentWindow
                        .document
                        .getElementById("save_window_btn")

                    addStyle(
                        `
                    :root {
                        --buttonlists: ${buttonList.children.length};
                    }`
                    )
                    if (autocomplete) {
                        var head = document.head;
                        let meta = document.createElement("meta");
                        meta.setAttribute("http-equiv", "Content-Security-Policy");
                        meta.setAttribute(
                            "content",
                            "script-src 'self' https://suggestqueries.google.com 'unsafe-inline' 'unsafe-ev" +
                                    "al' data:;"
                        );
                        meta.content = "script-src 'self' https://suggestqueries.google.com 'unsafe-inline' 'unsafe-ev" +
                                "al' data:;"
                        head.appendChild(meta);
                        $(autocomplete).autocomplete({
                            source: function (request, response) {
                                $.ajax({
                                    type: 'get',
                                    url: "https://suggestqueries.google.com/complete/search?client=firefox&q=" +
                                            request.term,
                                    dataType: "json",
                                    data: {
                                        term: request.term
                                    },
                                    success: function (data) {
                                        response($.map(data[1], function (item) {
                                            return item
                                        }))
                                    }
                                });
                            },
                            select: function (event, ui) {
                                autocomplete.value = ui.item.value;
                                serachBtn.click();
                            },
                            delay: 0,
                            focus: function (event, ui) {
                                return false;
                            }
                        })
                    }
                    if (underBar) {
                        underBar.addEventListener('click', function () {
                            window.minimize();
                        });
                    }
                    if (zoomRange) {
                        localstorage.size = localstorage.size == undefined
                            ? 1
                            : localstorage.size;

                        window
                            .contentWindow
                            .document
                            .getElementById("window_container")
                            .setZoom(localstorage.size);
                        zoomRange.value = localstorage.size * 100;
                        zoomRange.oninput = function () {
                            window
                                .contentWindow
                                .document
                                .getElementById("window_container")
                                .setZoom(this.value / 100);
                            localstorage.size = this.value / 100;
                        };
                    }

                    if (closeBtn) {
                        closeBtn.onclick = function () {
                            window.close();
                        };
                    }

                    if (settingBtn) {
                        settingBtn.onclick = function () {
                            window
                                .contentWindow
                                .chrome
                                .runtime
                                .sendMessage({'open': 'setting'});
                        };
                    }
                    if (fixedBtn) {
                        fixedBtn = window
                            .contentWindow
                            .document
                            .getElementById('fix_window_btn');
                        if (
                            localstorage
                                ?.fixed
                        ) 
                            fixedBtn
                                .classList
                                .add('fixed');
                        else 
                            fixedBtn
                                .classList
                                .remove('fixed');
                        
                        fixedBtn.onclick = function () {
                            fixedBtn = window
                                .contentWindow
                                .document
                                .getElementById('fix_window_btn');
                            let fixedbool = fixedBtn
                                .classList
                                .toggle('fixed');
                            localstorage.fixed = fixedbool;
                            window.setAlwaysOnTop(fixedbool);
                        };

                    }
                    if (windowToolBar && body) {
                        windowToolBar.onmousemove = function () {
                            toolbarMove(true);
                        }
                        body.addEventListener("mouseleave", function (e) {
                            toolbarMove(false);
                        });
                        body.onmousemove = function (e) {
                            toolbarMove(true);
                        };
                    }
                    if (windowContainer) {

                        windowContainer.addEventListener('permissionrequest', function (e) {
                            if (e.permission === 'fullscreen') {
                                e.stopPropagation()
                                e.preventDefault();
                            };
                        });
                    }
                    function toolbarMove(fade) {
                        clearTimeout(window.contentWindow.removeToolbarTimer);
                        if (!fade) {
                            const storageToolBarTimeOut = localstorage
                                ?.toolbartimeout ?? 1;

                            window.contentWindow.removeToolbarTimer = setTimeout(() => {

                                if (windowToolBar && windowContainer) {
                                    windowToolBar
                                        .classList
                                        .remove("window_toolbar_movedown");
                                    windowToolBar
                                        .classList
                                        .add("window_toolbar_moveup");

                                    windowContainer
                                        .classList
                                        .remove("container_movedown");
                                    windowContainer
                                        .classList
                                        .add("container_moveup");
                                }
                            }, (
                                storageToolBarTimeOut > .5
                                    ? storageToolBarTimeOut
                                    : 2
                            ) * 1000)
                        } else {
                            if (windowToolBar && windowContainer) {
                                windowToolBar
                                    .classList
                                    .remove("window_toolbar_moveup");
                                windowToolBar
                                    .classList
                                    .add("window_toolbar_movedown");

                                windowContainer
                                    .classList
                                    .remove("container_moveup");
                                windowContainer
                                    .classList
                                    .add("container_movedown");
                            }

                        }
                    }
                }
            });
    }
