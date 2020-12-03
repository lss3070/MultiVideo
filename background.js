
var localstorage;
    chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
        
        if (request.open === 'window') {
            createWindow({ url: 'window.html', id: 'window' });
            // chrome.app.window.create("window.html",{
            //     id:'window',å
            //     bounds:{width:600,height:200},
            //     alwaysOnTop:true
            // })
            // createWindow({ url: 'window.html', id: 'window', outerBounds: browserBoundaries });
        }
        if (request.open === 'setting') {

            createWindow({ url: './src/html/setting.html', id: 'setting' });
            // chrome.app.window.create("setting.html",{
            //     id:'setting',
            //     bounds:{width:300,height:50},
            //     alwaysOnTop:true
            // })
        }
        if (request.close === 'setting') {
            chrome.app.window.get('setting').close();
        }
    });


    function createWindow(param){
        param.id=param.id!==param.id !== 'undefined' ? param.id : 'setting';
        param.Bounds = (typeof param.Bounds !== 'undefined' ? param.Bounds : { width: 500, height: 340});

        chrome.app.window.create(param.url,{
            frame:'none',
            id:param.id,
            alwaysOnTop:true,
            bounds:param.Bounds,
            resizable:true,
        },function(appWindow){
         
            appWindow.contentWindow.onload = function () {
                const closeBtn = appWindow.contentWindow.document.getElementById('close_window_btn')
                settingBtn = appWindow.contentWindow.document.getElementById('setting_window_btn'),
                fixedBtn = appWindow.contentWindow.document.getElementById('fix_window_btn');
    
             
                if(closeBtn){
                    closeBtn.onclick = function () {
                        appWindow.contentWindow.close();
                    };
                }

                if(settingBtn){
                    settingBtn.onclick = function () {
                        appWindow.contentWindow.chrome.runtime.sendMessage({'open': 'setting'});
                    };
                }
                if(fixedBtn){
                    if (true)
                    fixedBtn.classList.add('fixed');
                else
                    fixedBtn.classList.remove('fixed');

                    fixedBtn.onclick = function () {
                        appWindow.setAlwaysOnTop( fixedBtn.classList.toggle('fixed') );
                    };
                }

            }
        });
    }

    chrome.app.runtime.onLaunched.addListener(function() {
        createWindow({ url: './src/html/setting.html', id: 'setting' });
    });

