

function Test(){
    let input = document.createElement("input");
    let button = document.createElement("button");
    
    document.body.innerText="주소 : ";
    document.body.appendChild(input);
    document.body.appendChild(button);

    input.placeholder="주소를 입력해주세요";
    button.innerHTML="저장";

    button.addEventListener('click',function(){

        let newURL= input.value;
        // window.tracker.sendEvent('Browser',"URL",newURL);
        chrome.storage.sync.set({url:newURL});

        chrome.runtime.sendMessage({"open":"window"});
        chrome.runtime.sendMessage({"close":"load"});
              
    })
}

function updateWebviews(){
    let webview = document.getElementById("container");
  webview.style.height = document.documentElement.clientHeight + "px";
  webview.style.width = document.documentElement.clientWidth + "px";
}
window.onload=Test;
window.onresize=updateWebviews;

