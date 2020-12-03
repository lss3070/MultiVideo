
function Test(){
    // visitlistUl.id="visitlist_ul";
     
    initVisitList();

    let button= document.getElementById("save_window_btn");
    let input = document.getElementById("input_area");

    button.addEventListener('click',function(){

        jump(input.value);
    })
}
function jump(value){
    if(value!==null&&value!=="")  initVisitList(value);

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
        // items.url.splice(items.url.indexOf(null),1);
        if(items.url!==undefined&&items.url!==''){

            if(items.url.indexOf(null)>=0)
                items.url.splice(items.url.indexOf(null),1);
            if(items.url.indexOf(undefined)>=0)
                items.url.splice(items.url.indexOf(null),1);

            items.url.push(value);
            visitlist= Array.from(new Set(items.url));
            
            if(visitlist.length>0){
                visitlist.reverse();
                visitlist.forEach(e=>{
                    let li= document.createElement("li");
                    li.className="visitlist_li"
                    visitlistUl.appendChild(li);
                    li.innerHTML=e;
                    li.addEventListener('click',function(e){
                        jump(this.value);
                        listclickEvent(this);
                    })
                });
            }
            chrome.storage.sync.set({url:visitlist});
        }else{
            visitlist.push(value);
            chrome.storage.sync.set({url:visitlist});
        }
    });
    }

window.addEventListener('DOMContentLoaded',function(){
    Test();
});
window.onresize=updateWebviews;

