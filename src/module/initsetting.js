
export function onloadEvent(){
    this.closeBtn;
    this.settingBtn;
    this.fixedBtn;
}

    onloadEvent.prototype.setElement=function(){
        this.closeBtn= document.getElementById("close_window_btn");
        this.settingBtn = document.getElementById("setting_window_btn");
        this.fixedBtn = document.getElementById("fix_window_btn");

    }


    onloadEvent.prototype.setEvent=function(){
        this.closeBtn.onclick=function(){
            window.close();
        }
        this.settingBtn.onclick=function(){
            window.chrome.runtime.sendMessage({'open': 'setting'});
        }
        this.fixedBtn.onclick=function(){
            
        }

    }
