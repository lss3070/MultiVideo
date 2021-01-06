
var localstorage;

const settingBoundaries={width:300,height:300,minWidth:150,minHeight:200};
const windowBoundaries={width:500,height:350,minWidth:170,minHeight:30};

chrome.storage.sync.get(function(items){
    if(items) localstorage=items;
});
chrome.storage.sync.onChanged.addListener(function(items) {
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
        let mouseMove=false;
        let fade = false;
        
        chrome.app.window.create(param.url,{
            frame:'none',
            id:param.id,
            alwaysOnTop:localstorage?.stayontop ?? false,
            outerBounds:param.bounds,
            resizable:true,
        },function(appWindow){
            const addStyle = function (styleString) {
                const style = appWindow.contentWindow.document.createElement('style');
                style.textContent = styleString;
                appWindow.contentWindow.document.head.append(style);
            }

            appWindow.contentWindow.addEventListener("DOMContentLoaded",function(){
                
            })
            appWindow.contentWindow.onload = function () {
                let closeBtn = appWindow.contentWindow.document.getElementById('close_window_btn')
                settingBtn = appWindow.contentWindow.document.getElementById('setting_window_btn'),
                fixedBtn = appWindow.contentWindow.document.getElementById('fix_window_btn'),
                windowToolBar= appWindow.contentWindow.document.getElementById('window_toolbar'),
                windowContainer = appWindow.contentWindow.document.getElementById('window_container'),
                body = appWindow.contentWindow.document.getElementById('WindowView'),
                bodyobj =appWindow.contentWindow.document.querySelector('body'),
                title = appWindow.contentWindow.document.getElementById('window_title'),
                buttonlist = appWindow.contentWindow.document.getElementById('window_buttonlst'),
                zoomRange = appWindow.contentWindow.document.getElementsByClassName("size_window_range")[0],
                underBar = appWindow.contentWindow.document.getElementById("underbar_window_btn"),
                autocomplete =  appWindow.contentWindow.document.getElementById("input_area"),
                serachBtn =  appWindow.contentWindow.document.getElementById("save_window_btn")
             
                addStyle(`
                    :root {
                        --buttonlists: ${buttonlist.children.length};
                    }`
                )

                if(autocomplete){
                    var head = document.getElementsByTagName('head')[0];
                    let meta = document.createElement("meta");
                    meta.setAttribute("http-equiv","Content-Security-Policy");
                    meta.setAttribute("content","script-src 'self' https://suggestqueries.google.com 'unsafe-inline' 'unsafe-eval' data:;");
                    meta.content="script-src 'self' https://suggestqueries.google.com 'unsafe-inline' 'unsafe-eval' data:;"
                    head.appendChild(meta);
                      $(autocomplete).autocomplete({
                        source:function(request,response){
                            $.ajax({
                                type:'get',
                                url:"https://suggestqueries.google.com/complete/search?client=firefox&q="+request.term,
                                dataType:"json",
                                data:{
                                    term:request.term
                                },
                                success:function(data){
                                    response(
                                        $.map(data[1],function(item){
                                            return item
                                        })
                                    )
                                }
                            });
                        },
                        select:function(event,ui){
                            
                            autocomplete.value=ui.item.value;
                            serachBtn.click();
                        },
                        delay:0,
                        focus:function(event,ui){
                            return false;
                        }
                    })
                
                }


                if(underBar){
                    underBar.addEventListener('click',function(){
                        appWindow.minimize();
                    });
                }
                if(zoomRange){
                    zoomRange.addEventListener("input",function(){

                        windowContainer.setZoom(this.value/100);
                    });
                }

                if(closeBtn){
                    closeBtn.onclick = function () {
                        appWindow.close();
                    };
                }

                if(settingBtn){
                    settingBtn.onclick = function () {
                        appWindow.contentWindow.chrome.runtime.sendMessage({'open': 'setting'});
                    };
                }
                if(fixedBtn){
                    if (localstorage?.stayontop){
                        fixedBtn.classList.add('fixed');
                        fixedBtn.innerHTML="on";
                    }
                else
                    fixedBtn.classList.remove('fixed');
                    fixedBtn.onclick = function () {

                        let fixedbool = fixedBtn.classList.toggle('fixed')
 

                        appWindow.setAlwaysOnTop(fixedbool );
                    };
                }
                if(windowToolBar){
       
                    windowToolBar.addEventListener('mousedown',function(){
                        window.removeButtonsForbidden=true;
                    })
                    windowToolBar.addEventListener('mouseup',function(){
                        
                        window.removeButtonsForbidden=false;
                    })
                    windowToolBar.addEventListener('mousemove',function(e){
                        
                        toolbarMove(true);
                        clearTimeout(appWindow.contentWindow.removeToolbarTimer);
                    });
                    windowToolBar.addEventListener('mouseleave',function(e){
                        toolbarMove(false);
                    })
                    bodyobj.addEventListener("mouseleave",function(e){
                        toolbarMove(false);
                    });
                    
                    bodyobj.addEventListener('mousemove',function(){
                        toolbarMove(true);
                    });
                  
                }
                if(windowContainer){
                    windowContainer.addEventListener("mousemove",function(){
                        
                    });
                    windowContainer.addEventListener('permissionrequest', function(e) {
                        if (e.permission === 'fullscreen') {
                            e.stopPropagation()
                            e.preventDefault();
                        };
                    });
                }
                function toolbarMove(fade){
                    clearTimeout(appWindow.contentWindow.removeToolbarTimer);
                        if(!fade){
                            const storageToolBarTimeOut= localstorage?.toolbartimeout?? 1.5;

                            appWindow.contentWindow.removeToolbarTimer=setTimeout(()=>{
                            
                                if(windowToolBar&&windowContainer){
                                    windowToolBar.classList.remove("window_toolbar_movedown");
                                    windowToolBar.classList.add("window_toolbar_moveup");
            
                                    windowContainer.classList.remove("container_movedown");
                                    windowContainer.classList.add("container_moveup");
                                }
                            },(storageToolBarTimeOut>.5?storageToolBarTimeOut:1.5)*1000) 
                        }else{
                            if(windowToolBar&&windowContainer){
                                windowToolBar.classList.remove("window_toolbar_moveup");
                                windowToolBar.classList.add("window_toolbar_movedown");
        
                                windowContainer.classList.remove("container_moveup");
                                windowContainer.classList.add("container_movedown");
                            }

                        }
                }
            }
        });
    }

    chrome.app.runtime.onLaunched.addListener(function() {

        createWindow({ url: './src/html/setting.html', id: 'setting',bounds:settingBoundaries });
    });