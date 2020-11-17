

function Test(){
   
    let input = document.createElement("input");
    let button = document.createElement("button");
    let visitlistUl= document.createElement("ul");

    visitlistUl.id="visitlist_ul";
    
    
    
    document.body.innerText="주소 : ";
    document.body.appendChild(input);
    document.body.appendChild(button);
    document.body.appendChild(visitlistUl);

    input.placeholder="주소를 입력해주세요";
    button.innerHTML="저장";

    initVisitList();

    button.addEventListener('click',function(){
        let aa = this;
        // window.tracker.sendEvent('Browser',"URL",newURL);
        
        initVisitList(input.value);

        chrome.runtime.sendMessage({"open":"window"});
        chrome.runtime.sendMessage({"close":"load"});
              
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

            items.url.push(value);
            visitlist= Array.from(new Set(items.url));
            
            if(visitlist.length>0){
                visitlist.reverse();
                visitlist.forEach(e=>{
                    let li= document.createElement("li");
                    visitlistUl.appendChild(li);
                    li.innerHTML=e;
                });
                
            }
            chrome.storage.sync.set({url:visitlist});
        }else{
            visitlist.push(value);
            chrome.storage.sync.set({url:visitlist});
        }
    });
}

function callBack(val){
    return val;
}

function addVisitList(){

}
window.onload=Test;
window.onresize=updateWebviews;

