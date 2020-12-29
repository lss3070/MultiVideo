
const title = document.getElementById("");

function Test(){    
    // visitlistUl.id="visitlist_ul";
     
    initVisitList();
    let button= document.getElementById("save_window_btn");
    let input = document.getElementById("input_area");

    button.addEventListener('click',function(){
        if(input.value!=null&&input.value!==""){
            initVisitList(input.value);
            chrome.runtime.sendMessage({"open":"window"});
            chrome.runtime.sendMessage({"close":"setting"});
        }
    })
}
function jump(value){
    initVisitList(value);
    chrome.runtime.sendMessage({"open":"window"});
    chrome.runtime.sendMessage({"close":"setting"});
}

function updateWebviews(){
    let webview = document.getElementById("WindowView");
  webview.style.height = document.documentElement.clientHeight + "px";
  webview.style.width = document.documentElement.clientWidth + "px";
}

function initVisitList(value){
    let visitlist=[];
    chrome.storage.sync.get(function(items) {
        
        let visitlistUl= document.getElementById("visitlist_ul");
        visitlistUl.innerHTML="";

        if(value!==null&&value!=''&&value!==undefined){
            if(items.url!=undefined){
                if(items.url.includes(value))
                items.url.splice(items.url.indexOf(value),1);
            }else 
                items.url= [];
            
            items.url.unshift(value);
        }
        visitlist= items.url;
    
        if(visitlist!=undefined&&visitlist.length>0){
            visitlist.forEach(e => {
                let li= document.createElement("li");
                let favicon  = document.createElement("webview");
                let li_a= document.createElement("a");
                let url = new URL(e);

                favicon.setAttribute('class',"visitlist_favicon");
                favicon.addEventListener('loadcommit',function(e){
                    if(e.isTopLevel){
                        favicon.insertCSS({
                            file:'./style/listview_favicon.css',
                            runAt:'document_start'
                        });
                    }
                })

                li_a.innerHTML=e;
                li.className="visitlist_li"
                
                if(value==null){
            // 임시로 막아놈 기존 promise
                fetch("https://favicongrabber.com/api/grab/"+url.hostname)
                .then(response=>response.json())
                .then(({icons}) => {
                if(icons!=undefined&&icons!=null){
                    if(icons[0]?.src){
                        favicon.src = icons[0]?.src;
                    }
                }
            })
        }
                visitlistUl.appendChild(li);
                li.appendChild(favicon);
                li.appendChild(li_a);
                li.addEventListener('click',function(e){
                    jump(this.children[1].innerHTML);
                })
            });
    }
    chrome.storage.sync.set({url:visitlist});
    });
    }

window.addEventListener('DOMContentLoaded',function(){
    Test();
});
window.onresize=updateWebviews;

