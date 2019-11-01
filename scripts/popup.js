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

$("#everythingSubmit").click(()=>{
    let requesterFile = $("#reqFile2").get(0).files[0];
    let reader = new FileReader();
    
    reader.onload = async(e)=>{
        let text = e.target.result;
        let newText = formatFile(text, ["requestor ID", "requisition number"]);
        if($("#test-mode").is(":checked")){
            download("test.csv", newText, "text/csv");
        } else {
            await set("reqFile", newText);
            await set("reqResult", "");
            await set("autoclick", $("#autoclick").is(":checked"));
            await set("everything", true);
            setUrl("https://psreports.losrios.edu/REQ_History.asp");
        }
    };
    reader.readAsText(requesterFile, "UTF-8");
});

/*

how to remove line with "po is awaiting dispatch" using current template?
may need a separate file formatting function for that.

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





