
var localstorage;

const settingBoundaries={width:300,height:300,minWidth:150,minHeight:200};
const windowBoundaries={width:500,height:350,minWidth:170,minHeight:30};

chrome.storage.sync.get(function(items){

    if(items) localstorage=items;
    //요기부터 다시시작..
    if (items.titlebartimeout !== undefined){
        disappearTimeoutOption.value = items.titlebartimeout;
        disappearTimeoutValue.innerText = disappearTimeoutOption.value;
    } else {
        disappearTimeoutOption.value = 1500;
        disappearTimeoutValue.innerText = disappearTimeoutOption.value;
    }
});
chrome.storage.sync.onChanged.addListener(function(items) {
    if (items)
        Object.entries(items).forEach(function(key, value) {
            localstorage[key[0]] = key[1].newValue;
        });
});


    chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
        
        if (typeof request.open !== 'undefined') {
        if(chrome.app.window.get(request.open)){
            chrome.app.window.get(request.open).onClosed.addListener(function(){
                createWindow({ 'url': './src/html/'+request.open+'.html', 'id': request.open });
            });
            chrome.app.window.get(request.open).close();
            return;
            }
        }

        if (request.open === 'window') {
            createWindow({ url: './src/html/window.html', id: 'window',bounds:windowBoundaries });
        }
        if (request.open === 'setting') {

            createWindow({ url: './src/html/setting.html', id: 'setting',bounds:settingBoundaries });
        }
        if (request.close === 'setting') {
            chrome.app.window.get('setting').close();
        }
    });


    function createWindow(param){
        param.id=param.id!==param.id !== 'undefined' ? param.id : 'setting';
        param.bounds = (typeof param.bounds !== 'undefined' ? param.bounds : { width:500,height:350,minWidth:170,minHeight:30});
        let toolbarDown =false;
        let mouseMove=false;
        let fade = false;
        
        chrome.app.window.create(param.url,{
            frame:'none',
            id:param.id,
            alwaysOnTop:localstorage?.stayontop ?? true,
            outerBounds:param.bounds,
            resizable:true,
        },function(appWindow){
            const addStyle = function (styleString) {
                const style = appWindow.contentWindow.document.createElement('style');
                style.textContent = styleString;
                appWindow.contentWindow.document.head.append(style);
            }
            appWindow.contentWindow.onload = function () {
                const closeBtn = appWindow.contentWindow.document.getElementById('close_window_btn')
                settingBtn = appWindow.contentWindow.document.getElementById('setting_window_btn'),
                fixedBtn = appWindow.contentWindow.document.getElementById('fix_window_btn'),
                windowToolBar= appWindow.contentWindow.document.getElementById('window_toolbar'),
                windowContainer = appWindow.contentWindow.document.getElementById('window_container'),
                body = appWindow.contentWindow.document.getElementById('WindowView'),
                bodyobj =appWindow.contentWindow.document.querySelector('body'),
                title = appWindow.contentWindow.document.getElementById('window_title'),
                buttonlist = appWindow.contentWindow.document.getElementById('window_buttonlst');
             
                addStyle(`
                    :root {
                        --buttonlists: ${buttonlist.children.length};
                    }`
                )

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
                        mouseMove=true;
                    });
                    windowToolBar.addEventListener('mouseup',function(){
                        mouseMove=false;
                    });
                    appWindow.contentWindow.addEventListener('mouseup',function(){
                        toolbarDown= false;
                        
                    });
                    body.addEventListener("mouseout",function(e){
                        if(mouseMove){
                            console.log('a');
                            let deltaX = e.movementX;
                            let deltaY = e.movementY;
                            let winPostionX = appWindow.contentWindow.screenX;
                            let winPostionY = appWindow.contentWindow.screenY;
                            
                            appWindow.contentWindow.moveTo(deltaX+winPostionX,deltaY+winPostionY);
                            }
                    })
                    
                    
                    body.addEventListener("mousemove",function(e){
                    //    e.preventDefault();
                    //    fade=true;
                    //    console.log(fade);
                    //    windowToolBar.style.opacity=1;
                    //    windowToolBar.style.top=0;
                
                    toolbarMove(true);
                       
                        if(mouseMove){
                            console.log('a');
                            let deltaX = e.movementX;
                            let deltaY = e.movementY;
                            let winPostionX = appWindow.contentWindow.screenX;
                            let winPostionY = appWindow.contentWindow.screenY;
                            
                            appWindow.contentWindow.moveTo(deltaX+winPostionX,deltaY+winPostionY);
                            }
                    },true);

                    body.addEventListener('mouseover',function(e){
                        toolbarMove(true);
                    },true);
                    appWindow.contentWindow.addEventListener('mouseout',function(e){
                        toolbarMove(false);
                    });
                
                
                
                }
                if(windowContainer){
                    windowContainer.addEventListener("mousemove",function(){
                        console.log("new event");
                    })
                    windowContainer.addEventListener('permissionrequest', function(e) {
                        if (e.permission === 'fullscreen') {
                            console.log('fullscreen');
                            e.stopPropagation()
                            e.preventDefault();
                        //   e.request.allow();
                        };
                    });
                }
                function toolbarMove(fade){
                    if(windowToolBar&&windowContainer){
                        if(fade){
                            windowToolBar.classList.remove("window_toolbar_moveup");
                            windowToolBar.classList.add("window_toolbar_movedown");
    
                            windowContainer.classList.remove("container_moveup");
                            windowContainer.classList.add("container_movedown");
                        }else{
                            windowToolBar.classList.remove("window_toolbar_movedown");
                            windowToolBar.classList.add("window_toolbar_moveup");
    
                            windowContainer.classList.remove("container_movedown");
                            windowContainer.classList.add("container_moveup");
                            toolbarDown= false;
                        }
                    }
                }
            }
        });
    }

    chrome.app.runtime.onLaunched.addListener(function() {

        createWindow({ url: './src/html/setting.html', id: 'setting',bounds:settingBoundaries });
    });