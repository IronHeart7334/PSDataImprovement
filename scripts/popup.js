//this file is run whenever the icon is clicked

function start(url){
    let file = $("#file").get(0).files[0];
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

$("#reqSubmit").click(()=>{
    let file = $("#reqFile").get(0).files[0];
    let reader = new FileReader();
    reader.onload = async(e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        await set("reqFile", newText);
        await set("reqResult", "");
        await set("autoclick", $("#autoclick").is(":checked"));
        setUrl("https://psreports.losrios.edu/REQ_History.asp");
    };
    reader.readAsText(file, "UTF-8");
});

$("#poFile").click(()=>{
    let file = $("#poFile").get(0).files[0];
    let reader = new FileReader();
    reader.onload = async(e)=>{
        let text = e.target.result;
        let data = text.split(NEWLINE).map((line)=>line.split(","));
        let reqIdCol = data[0].indexOf("Req ID");
        let poIdCol = data[0].indexOf("PO ID");
        let newText = "Req ID, PO ID";
        data.shift(); //remove header
        data.forEach((line)=>{
            newText += NEWLINE + line[reqIdCol] + "," + line[poIdCol];
        });
        
        await set("poFile", newText);
        await set("poResult", "");
        await set("autoclick", $("#autoclick").is(":checked"));
        setUrl("https://psreports.losrios.edu/PO_History.asp");
    };
    reader.readAsText(file, "UTF-8");
});

function setUrl(newUrl){
    chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
        chrome.tabs.update(tab.id, {url: newUrl});
    });
}


