
const webview = document.getElementById('container');

let webview_zoom_level =null;
window.addEventListener('load',function(e){
    chrome.storage.sync.get(function(items){
        if(items.url!=null){
            
            // window.tracker.sendEvent('Browser','Load URL',items.url);
            webview.setAttribute('src', items.url);
            webview.getZoom(function(zoomFactor){webview_zoom_level = zoomFactor;});
        }
    })
})

function updateWebviews(){
    let webview = document.getElementById("WindowView");
  webview.style.height = document.documentElement.clientHeight + "px";
  webview.style.width = document.documentElement.clientWidth + "px";
}
window.onresize=updateWebviews;