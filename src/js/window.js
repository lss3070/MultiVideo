const container = document.getElementById('window_container');
const favicon = document.getElementById("window_favicon");
const webview = document.getElementById("WindowView"),
    windowTitle = document.getElementById('window_title');

const sliderbar = document.getElementById("size_window_slider");
const sliderbutton = document.getElementById("appLabelZoom");

window.addEventListener("resize", function () {
    webview.style.height = document.documentElement.clientHeight + "px";
    webview.style.width = document.documentElement.clientWidth + "px";
    InitSilderBarPostion();
});

window.addEventListener('load', function (e) {
    chrome
        .storage
        .sync
        .get(function (items) {
            if (items.url != null && items.url.length > 0) {
                container.setAttribute('src', items.url[0]);
                updateWebviews();
            }
        })
});

document.addEventListener('DOMContentLoaded', function () {
    InitSilderBarPostion();
})

container.addEventListener('loadcommit', function (e) {
    if (e.isTopLevel) {
        container.executeScript({
            code: 'document.location.href',
            runAt: 'document_end'
        }, function (result) {
            let url = new URL(result);
            favicon.src = url.origin + "/favicon.ico";
        });
        container.executeScript({
            code: 'document.title',
            runAt: 'document_end'
        }, function (results) {
            if (results && results.length > 0) {
                document.title = results[0];
                windowTitle.innerText = results[0];
            }
        });
    }
});

container.addEventListener('permissionrequest', function (e) {
    if (e.permission === 'download') {
        e
            .request
            .allow();
    }
});

favicon.addEventListener('loadcommit', function (e) {
    if (e.isTopLevel) {
        favicon.insertCSS(
            {file: './style/toolbar_favicon.css', runAt: 'document_start'}
        );
    }
});

sliderbutton.addEventListener("click", function () {
    VisibleSilderBar(true);
})
sliderbar.addEventListener("mouseup", function () {
    VisibleSilderBar(false);
});

function VisibleSilderBar(bool) {
    if (bool) {
        sliderbar.style.display = "inline";
        sliderbutton.style.display = "none";
    } else {
        sliderbar.style.display = "none";
        sliderbutton.style.display = "inline";
    }
}
function updateWebviews() {
    webview.style.height = document.documentElement.clientHeight + "px";
    webview.style.width = document.documentElement.clientWidth + "px";

    InitSilderBarPostion();
}

function InitSilderBarPostion() {
    let temp = document.getElementById("window_buttonlst")
        let bodyRect = document
                .body
                .getBoundingClientRect(),
            elemRect = sliderbutton.getBoundingClientRect(),
            offsettop = elemRect.top - bodyRect.top;

        offsetleft = bodyRect.width - temp
            .getBoundingClientRect()
            .width;

            sliderbar.style.top=offsettop;+"px"
        sliderbar.style.left = offsetleft - 16 + "px";
    }
