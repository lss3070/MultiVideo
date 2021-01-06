const container = document.getElementById('window_container');
const favicon = document.getElementById("window_favicon");
const webview = document.getElementById("WindowView"),
window_title = document.getElementById('window_title');

const sliderbar = document.getElementById("size_window_slider");
const sliderbutton = document.getElementById("size_window_button");

container.addEventListener('loadcommit',function(e){
    if(e.isTopLevel){
        container.executeScript(
            {
                code: 'document.title',
                runAt: 'document_end'
            }, function(results){
                if (results && results[0]) {
                    document.title = results[0];
                    window_title.innerText = results[0];
                }
            });
            container.executeScript({
                code:'document.location.hostname',
                runAt:'document_end'
            },function(results){
                if (results.length>0) {
                    fetch("https://favicongrabber.com/api/grab/" + results[0])
                    .then(response => response.json())
                    .then(({ icons }) => {
                        if(icons!=undefined&&icons!=null){
                            if (icons[0]?.src)
                            favicon.src = icons[0]?.src
                        }
                    })
                }
             });
        }
        });

favicon.addEventListener('loadcommit',function(e){
    if(e.isTopLevel){
        favicon.insertCSS({
            file:'./style/toolbar_favicon.css',
            runAt:'document_start'
        });
    }
})
let webview_zoom_level =null;
window.addEventListener('load',function(e){
    chrome.storage.sync.get(function(items){
        if(items.url!=null){
            // window.tracker.sendEvent('Browser','Load URL',items.url);
            container.setAttribute('src', items.url[0]);
            container.getZoom(function(zoomFactor){webview_zoom_level = zoomFactor;});
        
            updateWebviews();
        }
    })
})



function updateWebviews(){
  webview.style.height = document.documentElement.clientHeight + "px";
  webview.style.width = document.documentElement.clientWidth + "px";
  InitSilderBarPostion();
}


sliderbutton.addEventListener("click",function(){
    VisibleSilderBar(true);
})
sliderbar.addEventListener("mouseup",function(){
    VisibleSilderBar(false);
})

function InitSilderBarPostion(){
    let temp =document.getElementById("window_buttonlst")
    let bodyRect = document.body.getBoundingClientRect(),
    elemRect = sliderbutton.getBoundingClientRect(),
    offsettop   = elemRect.top - bodyRect.top,
    offsetright=bodyRect.right-temp.width;

    offsetleft= bodyRect.width-temp.getBoundingClientRect().width;

    sliderbar.style.top=offsettop;+"px"
    sliderbar.style.left=offsetleft-16+"px";
}
function VisibleSilderBar(bool){
    let sliderbar = document.getElementById("size_window_slider");
    let sliderbutton = document.getElementById("size_window_button");
    if(bool){
        sliderbar.style.display="inline";
        sliderbutton.style.display="none";
    }else{
        sliderbar.style.display="none";
        sliderbutton.style.display="inline";
    }  
}
document.addEventListener('DOMContentLoaded',function(){
    InitSilderBarPostion();
})
window.onresize=updateWebviews;