var localstorage;

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("setting.html",{
        frame:'none',
        id:'setting',
        bounds:{width:300,height:50},
        alwaysOnTop: localstoragealwaysOnTop ?? true
    });

    chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
        if (request.open === 'window') {
            createWindow({ url: 'window.html', id: 'window' });
            // chrome.app.window.create("window.html",{
            //     id:'window',
            //     bounds:{width:600,height:200},
            //     alwaysOnTop:true
            // })
            // createWindow({ url: 'window.html', id: 'window', outerBounds: browserBoundaries });
        }
        if (request.open === 'setting') {

            createWindow({ url: 'setting.html', id: 'setting' });
            // chrome.app.window.create("setting.html",{
            //     id:'setting',
            //     bounds:{width:300,height:50},
            //     alwaysOnTop:true
            // })
            createWindow({ url: 'setting.html', id: 'setting', outerBounds: settingsBoundaries });
        }
        if (request.close === 'setting') {
            chrome.app.window.get('setting').close();
        }
    });


    function createWindow(param){
        param.id=param.id!==param.id !== 'undefined' ? param.id : 'window';
        param.outerBounds = (typeof param.outerBounds !== 'undefined' ? param.outerBounds : { width: 500, height: 340, minWidth: 170, minHeight: 38 });

        chrome.app.window.create(param.url,{
            frame:'none',
            id:param.id,
            alwaysOnTop:true,
            bounds:param.Bounds,
            resizable:true,
        },function(appWindow){
            appWindow.contentWindow.onload = function () {
                let closeBtn = appWindow.contentWindow.document.getElementById('close_window_btn'),
                settingBtn = appWindow.contentWindow.document.getElementById('setting_window_btn'),
                fixedBtn = appWindow.contentWindow.document.getElementById('fix_window_btn');
    
                
                if(settingBtn){
                    settingBtn.onclick = function () {
                        appWindow.contentWindow.chrome.runtime.sendMessage({'open': 'setting'});
                    };
                }
                if(fixedBtn){
                    if (localstorage?.alwaysOnTop)
                    pinObj.classList.add('fixed');
                else
                    pinObj.classList.remove('fiexe');

                    pinObj.onclick = function () {
                        appWindow.setAlwaysOnTop( pinObj.classList.toggle('fixed') );
                    };
                }
                if(closeBtn){
                    closeBtn.onclick = function () {
                        appWindow.contentWindow.close();
                    };
                }
            
            }
    
        })
    }

  });