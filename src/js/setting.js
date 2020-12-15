
const title = document.getElementById("");

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
        console.log(items);
        let visitlistUl= document.getElementById("visitlist_ul");
        visitlistUl.innerHTML="";

        if(value!==null&&value!=''&&value!==undefined)
            items.url.push(value);
        
        visitlist= Array.from(new Set(items.url));
    
        if(visitlist.length>0){
            visitlist.reverse();
            visitlist.forEach(e=>{
               
                let li= document.createElement("li");
                let favicon  = document.createElement("webview");
                let li_a= document.createElement("a");
                let url= new URL(e);
                
                li_a.innerHTML=e;
                li.className="visitlist_li"
                
                fetch("https://favicongrabber.com/api/grab/"+url.protocol+url.hostname)
                .then(response=>response.json())
                .then(({icons}) => {
                    if(icons[0]?.src)
                    favicon.src = icons[0]?.src
                })

                visitlistUl.appendChild(li);
                li.appendChild(favicon);
                li.appendChild(li_a);
                li.addEventListener('click',function(e){
                    jump(this.innerHTML);
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

