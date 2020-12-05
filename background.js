
var localstorage;

chrome.storage.sync.get(function(items){
    if(items) localstorage=items;
});
chrome.storage.sync.onChanged.addListener(function(items) {
    if (items)
        Object.entries(items).forEach(function(key, value) {
            localstorage[key[0]] = key[1].newValue;
        });
});


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
        console.log(localstorage);
        param.id=param.id!==param.id !== 'undefined' ? param.id : 'setting';
        param.Bounds = (typeof param.Bounds !== 'undefined' ? param.Bounds : { width: 500, height: 340});

        let toolbarDown =false;
        let fade = false;

        chrome.app.window.create(param.url,{
            frame:'none',
            id:param.id,
            alwaysOnTop:localstorage?.stayontop ?? true,
            bounds:param.Bounds,
            resizable:true,
        },function(appWindow){
         
            appWindow.contentWindow.onload = function () {
                const closeBtn = appWindow.contentWindow.document.getElementById('close_window_btn')
                settingBtn = appWindow.contentWindow.document.getElementById('setting_window_btn'),
                fixedBtn = appWindow.contentWindow.document.getElementById('fix_window_btn'),
                windowToolBar= appWindow.contentWindow.document.getElementById('window_toolbar');
             
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
                    if (localstorage?.stayontop)
                    fixedBtn.classList.add('fixed');
                else
                    fixedBtn.classList.remove('fixed');

                    fixedBtn.onclick = function () {
                        appWindow.setAlwaysOnTop( fixedBtn.classList.toggle('fixed') );
                    };
                }

                if(windowToolBar){
                    windowToolBar.addEventListener('mousedown',function(){
                        toolbarDown= true;
                    });

                    appWindow.contentWindow.addEventListener('mouseup',function(){
                        toolbarDown= false;
                    });
                    
                    appWindow.contentWindow.addEventListener('mousemove',function(e){
                    //    e.preventDefault();
                       fade=true;
                       console.log(fade);
                       windowToolBar.style.opacity=1;
                       windowToolBar.style.top=0;
                        if(toolbarDown){
                            let deltaX = e.movementX;
                            let deltaY = e.movementY;
                            let winPostionX = appWindow.contentWindow.screenX;
                            let winPostionY = appWindow.contentWindow.screenY;
                            
                            appWindow.contentWindow.moveTo(deltaX+winPostionX,deltaY+winPostionY);
                            }
                    });

                    appWindow.contentWindow.addEventListener('mouseover',function(e){
                        fade=true;
                        console.log(fade);
                        windowToolBar.style.opacity=1;
                        windowToolBar.style.top=0;
                        windowToolBar.style.transition= "opacity 1s ease";

                    });
                    appWindow.contentWindow.addEventListener('mouseout',function(e){
                        fade=false;
                        windowToolBar.style.opacity=0;
                        windowToolBar.style.top="-38px";
                    });
                }

            }
        });
    }

    chrome.app.runtime.onLaunched.addListener(function() {
        createWindow({ url: './src/html/setting.html', id: 'setting' });
    });

function WindowMoveEvent(){
    
}