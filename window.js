
const container = document.getElementById('container');
const webview = document.getElementById("WindowView");

let webview_zoom_level =null;
window.addEventListener('load',function(e){
    chrome.storage.sync.get(function(items){
        if(items.url!=null){
            // window.tracker.sendEvent('Browser','Load URL',items.url);
            console.log(items.url);
            container.setAttribute('src', items.url);
            container.getZoom(function(zoomFactor){webview_zoom_level = zoomFactor;});
            updateWebviews();
        }
    })
})

function updateWebviews(){
  webview.style.height = document.documentElement.clientHeight + "px";
  webview.style.width = document.documentElement.clientWidth + "px";
}
window.onresize=updateWebviews;