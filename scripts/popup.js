//this file is run whenever the icon is clicked
function linkButton(buttonId, sourceFileName, resultFileName, startURL){
    $("#" + buttonId).click(()=>{
        let file = $("#" + sourceFileName).get(0).files[0];
        let reader = new FileReader();
        reader.onload = async(e)=>{
            let text = e.target.result;
            //remove the header
            let newText = text.substring(text.search(NEWLINE) + 1).trim();
            await set(sourceFileName, newText);
            await set(resultFileName, "");
            await set("autoclick", $("#autoclick").is(":checked"));
            setUrl(startURL);
        };
        reader.readAsText(file, "UTF-8");
    });
}
linkButton("acctSubmit", "acctFile", "acctResult", "https://psreports.losrios.edu/AccountBalanceSumDescr.asp");
linkButton("reqSubmit", "reqFile", "reqResult", "https://psreports.losrios.edu/REQ_History.asp");

//needs special behaviour
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



