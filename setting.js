chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("setting.html",{
        id:'setting',
        bounds:{width:300,height:50},
        alwaysOnTop:true
    });


    chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
        if (request.open === 'window') {
            chrome.app.window.create("window.html",{
                id:'window',
                bounds:{width:600,height:200},
                alwaysOnTop:true
            })
            // createWindow({ url: 'window.html', id: 'window', outerBounds: browserBoundaries });
        }
        if (request.open === 'setting') {
            chrome.app.window.create("setting.html",{
                id:'setting',
                bounds:{width:300,height:50},
                alwaysOnTop:true
            })
            createWindow({ url: 'setting.html', id: 'setting', outerBounds: settingsBoundaries });
        }
        if (request.close === 'setting') {
            chrome.app.window.get('setting').close();
        }
    });
    function createWindow(param){
        chrome.app.window.create(param.url,{

        },function(appWindow){

        })
    }

  });