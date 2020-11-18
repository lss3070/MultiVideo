

function Test(){
   
    let input = document.createElement("input");
    let button = document.createElement("button");
    let visitlistUl= document.createElement("ul");
    let a = document.createElement('a');
    visitlistUl.id="visitlist_ul";
     
    document.body.appendChild(a);
    document.body.appendChild(input);
    document.body.appendChild(button);
    document.body.appendChild(visitlistUl);

    a.innerHTML='주소 : ';
    input.placeholder="주소를 입력해주세요";
    button.innerHTML="저장";

    initVisitList();

    button.addEventListener('click',function(){
        let aa = this;
        // window.tracker.sendEvent('Browser',"URL",newURL);
        if(input.value!==null&&input.value!=="")  initVisitList(input.value);

        chrome.runtime.sendMessage({"open":"window"});
        chrome.runtime.sendMessage({"close":"setting"});
    })
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
    


function listclickEvent(element){
    initVisitList(element.innerHTML);
}
window.onload=Test;
window.onresize=updateWebviews;

