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
        await set("autoclick", $("#autoclick").is(":checked"));
        setUrl(url);
    };
    reader.readAsText(file, "UTF-8");
}

$("#submit").click(()=>{
    start("https://psreports.losrios.edu/AccountBalanceSumDescr.asp");
});
$("#test").click(()=>{
    start("http://localhost:8000/index.html");
});

function setUrl(newUrl){
    chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
        chrome.tabs.update(tab.id, {url: newUrl});
    });
}


