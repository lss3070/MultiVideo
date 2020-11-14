
const webview = document.getElementById('container');

window.addEventListener('load',function(e){
    chrome.storage.sync.get(function(items){
        if(items.url!=null){
            
            // window.tracker.sendEvent('Browser','Load URL',items.url);
            webview.setAttribute('src', items.url);
        }
    })
})