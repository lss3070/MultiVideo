const httplist = ["http://", "https://"]

window.addEventListener('load', function () {
    load();
});

window.addEventListener("resize", function () {
    let webview = document.getElementById("WindowView");
    webview.style.height = document.documentElement.clientHeight + "px";
    webview.style.width = document.documentElement.clientWidth + "px";
});

function load() {
    let input=document.getElementById("appPlaceHolderSearch");
    let searchbtn=document.getElementById("appBtnSearch");

    input.placeholder=chrome.i18n.getMessage('appPlaceHolderSearch');
    document.getElementById("appLabelRecnetVisitPage").innerHTML=chrome.i18n.getMessage('appLabelRecnetVisitPage');
    document.getElementById("appTxtlAdrressBox").innerHTML=chrome.i18n.getMessage('appTxtlAdrressBox');
    searchbtn.value=chrome.i18n.getMessage('appBtnSearch');


    initVisitList();

    searchbtn.addEventListener('click', function () {
        let check = false;

        httplist.forEach(e => {
            if (input.value.indexOf(e) != -1) {
                check = true;
            }
        });
        if (!check) 
            input.value = "http://" + input.value;
        
        if (input.value != null && input.value !== "") {
            fetch(input.value, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    jump(response.url)
                })
                .catch(error => console.log("err"));

        }
    })
    input.addEventListener('keypress', function (e) {
        if (e.key == "Enter") 
        searchbtn.click();;
    })
}
function jump(value) {
    initVisitList(value);
    chrome
        .runtime
        .sendMessage({"open": "window"});
    chrome
        .runtime
        .sendMessage({"close": "setting"});
}

function updateWebviews() {
    let webview = document.getElementById("WindowView");
    webview.style.height = document.documentElement.clientHeight + "px";
    webview.style.width = document.documentElement.clientWidth + "px";
}

function initVisitList(value) {
    let visitlist = [];
    chrome
        .storage
        .sync
        .get(function (items) {
                let visitlistUl = document.getElementById("visitlist_ul");
                visitlistUl.innerHTML = "";

                if (value !== null && value != '' && value !== undefined) {
                    if (items.url != undefined) {
                        if (items.url.includes(value)) 
                            items
                                .url
                                .splice(items.url.indexOf(value), 1);
                        }
                    else 
                        items.url = [];
                    
                    items
                        .url
                        .unshift(value);
                }
                visitlist = items.url;

                if (visitlist != undefined && visitlist.length > 0) {
                    visitlist.forEach(e => {
                        let li = document.createElement("li");

                        let temp = document.createElement("link");
                        let favicon = document.createElement("webview");
                        let li_a = document.createElement("a");
                        let btn = document.createElement("button");

                        let url = new URL(e);
                        li_a.setAttribute("class", "visitlist_a")
                        favicon.setAttribute('class', "visitlist_favicon");
                        btn.setAttribute("class", "visitlist_closebtn");
                        favicon.addEventListener('loadcommit', function (e) {
                            if (e.isTopLevel) {
                                favicon.insertCSS(
                                    {file: './style/listview_favicon.css', runAt: 'document_start'}
                                );
                            }
                        });
                        li_a.innerHTML = e;
                        li.className = "visitlist_li";

                        favicon.setAttribute("partition", "persist:webviewsession");
                        favicon.src = url.origin + "/favicon.ico";

                        visitlistUl.appendChild(li);
                        li.appendChild(favicon);
                        li.appendChild(li_a);
                        li.appendChild(btn);
                        li_a.addEventListener('click', function (e) {
                            jump(this.innerHTML);
                        })
                        btn.addEventListener('click', function (e) {
                            let index = $("li").index(e.target.parentNode);
                            e
                                .target
                                .parentNode
                                .remove();
                            listremove(index);
                        })
                    });
                }
            

            chrome
                .storage
                .sync
                .set({url: visitlist});

        })
}

function listremove(index) {
    chrome
        .storage
        .sync
        .get(function (items) {
            items
                .url
                .splice(index, 1);
            chrome
                .storage
                .sync
                .set({url: items.url});
        });
}

