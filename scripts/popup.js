function linkButton(buttonId, sourceFileName, resultFileName, startURL, headers){
    $("#" + buttonId).click(()=>{
        let file = $("#" + sourceFileName).get(0).files[0];
        let reader = new FileReader();
        reader.onload = async(e)=>{
            let text = e.target.result;
            let newText = formatFile(text, headers);
            if($("#test-mode").is(":checked")){
                download("test.csv", newText, "text/csv");
            } else {
                await set(sourceFileName, newText);
                await set(resultFileName, "");
                await set("autoclick", $("#autoclick").is(":checked"));
                setUrl(startURL);
            }
        };
        reader.readAsText(file, "UTF-8");
    });
}

linkButton(
    "acctSubmit", 
    "acctFile", 
    "acctResult", 
    "https://psreports.losrios.edu/AccountBalanceSumDescr.asp", 
    [
        "Business Unit",
        "Account",
        "Fund",
        "Org/DeptID",
        "Program",
        "Sub-Class",
        "Project/Grant"
    ]
);

linkButton(
    "reqSubmit", 
    "reqFile", 
    "reqResult", 
    "https://psreports.losrios.edu/REQ_History.asp",
    [
        "requestor ID",
        "requisition number"
    ]
);

linkButton(
    "poSubmit",
    "poFile",
    "poResult",
    "https://psreports.losrios.edu/PO_History.asp",
    [
        "Req ID",
        "PO ID"
    ]
);

linkButton(
    "poInfoSubmit",
    "poInfoFile",
    "poInfoResult",
    "https://psreports.losrios.edu/PurchaseOrderInformation.asp",
    [
        "Req ID",
        "PO ID"
    ]
);


//add file-filtering function parameter to linkButton.
/*

how to remove line with "po is awaiting dispatch"?

//needs special behaviour
$("#poSubmit").click(()=>{
    let file = $("#poFile").get(0).files[0];
    let reader = new FileReader();
    reader.onload = async(e)=>{
        let text = e.target.result;
        let data = text.split(NEWLINE).map((line)=>line.split(","));
        //the file has quote marks around just about everything
        let reqIdCol = data[0].indexOf('"Req ID"');
        let poIdCol = data[0].indexOf('"PO ID"');
        let newText = "";
        data.shift(); //remove header
        let reqId;
        let poId;
        //convert to reqId, poId
        data
            .filter((line)=>line[poIdCol] !== "PO is awaiting dispatch" && line[poIdCol].trim() !== "")
            .forEach((line)=>{
                //need to remove quote marks around each entry
                reqId = line[reqIdCol].trim();
                poId = line[poIdCol].trim();
                while(reqId.indexOf('"') !== -1){
                    reqId = reqId.replace('"', '');
                }
                while(poId.indexOf('"') !== -1){
                    poId = poId.replace('"', '');
                }
                newText += "\n" + reqId + "," + poId;
            });
        
        await set("poFile", newText);
        await set("poResult", "");
        await set("autoclick", $("#autoclick").is(":checked"));
        setUrl("https://psreports.losrios.edu/PO_History.asp");
    };
    reader.readAsText(file, "UTF-8");
});*/
/*
$("#poInfoSubmit").click(()=>{
    let file = $("#poInfoFile").get(0).files[0];
    let reader = new FileReader();
    reader.onload = async(e)=>{
        let text = e.target.result;
        let data = text.split(NEWLINE).map((line)=>line.split(","));
        //the file has quote marks around just about everything
        let reqIdCol = data[0].indexOf('"Req ID"');
        let poIdCol = data[0].indexOf('"PO ID"');
        let newText = "";
        data.shift(); //remove header
        let reqId;
        let poId;
        //convert to reqId, poId
        data
            .filter((line)=>line[poIdCol] !== "PO is awaiting dispatch" && line[poIdCol].trim() !== "")
            .forEach((line)=>{
                //need to remove quote marks around each entry
                reqId = line[reqIdCol].trim();
                poId = line[poIdCol].trim();
                while(reqId.indexOf('"') !== -1){
                    reqId = reqId.replace('"', '');
                }
                while(poId.indexOf('"') !== -1){
                    poId = poId.replace('"', '');
                }
                newText += "\n" + reqId + "," + poId;
            });
        
        await set("poInfoFile", newText);
        await set("poInfoResult", "");
        await set("autoclick", $("#autoclick").is(":checked"));
        setUrl("https://psreports.losrios.edu/PurchaseOrderInformation.asp");
    };
    reader.readAsText(file, "UTF-8");
});*/
/*
$("#everythingSubmit").click(()=>{
    let acctFile = $("#acctFile2").get(0).files[0];
    let reader1 = new FileReader();
    let reader2 = new FileReader();
    let count = 0;
    
    reader1.onload = async(e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(NEWLINE) + 1).trim();
        await set("acctFile2", newText);
        await set("acctResult2", "");
        await set("autoclick", $("#autoclick").is(":checked"));
        count++;
        if(count === 2){
            //might cause issues if JS variables don't lock or aren't synchronized
            setUrl("https://psreports.losrios.edu/AccountBalanceSumDescr.asp");
        }
    };
    reader1.readAsText(acctFile, "UTF-8");
});*/

function setUrl(newUrl){
    chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
        chrome.tabs.update(tab.id, {url: newUrl});
    });
}



