//this file is run whenever the icon is clicked

function start(url){
    let file = $("#file").get(0).files[0];
    $("#text").text(typeof file);
    let reader = new FileReader();
    reader.onload = async(e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        await set("file", newText);
        await set("result", "");
        setUrl(url);
    };
    reader.readAsText(file, "UTF-8");
}

$("#submit").click(()=>start("https://psreports.losrios.edu/AccountBalanceSumDescr.asp"));
$("#test").click(()=>start("http://localhost:8000/index.html"));
    /*
    ()=>{
    let fileChooser = $("#file").get(0);
    let reader = new FileReader();
    reader.onload = async(e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        await set("file", newText);
        await set("result", "");
        let newUrl = "https://psreports.losrios.edu/AccountBalanceSumDescr.asp";
        setUrl(newUrl);
    };
    reader.readAsText(fileChooser.files[0], "UTF-8");
});*/


/*
$("#test").click(()=>{
    let fileChooser = $("#file").get(0);
    let reader = new FileReader();
    reader.onload = (e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        chrome.storage.sync.set({file: newText}, ()=>{
            chrome.storage.sync.set({result: ""}, ()=>{
                setUrl("localhost:8000");
            });
        });
    };
    reader.readAsText(fileChooser.files[0], "UTF-8");
});*/

function setUrl(newUrl){
    chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
        chrome.tabs.update(tab.id, {url: newUrl});
    });
}


