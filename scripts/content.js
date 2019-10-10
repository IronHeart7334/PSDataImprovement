// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts

$(window).on("load", ()=>{
    switch(window.location.href){
        case "https://psreports.losrios.edu/AccountBalanceSumDescr.asp":
            processOrder();
            break;
        case "https://psreports.losrios.edu/AccountBalanceSumDescrQ.asp":
            readResult();
            break;
        case "http://localhost:8000/":
            processOrder();
            break;
        case "http://localhost:8000/index.html":
            processOrder();
            break;
        case "http://localhost:8000/result.html":
            readResult();
            break;
        default:
            console.log("URL is " + window.location.href);
            break;
    }
});

async function processOrder(){
    let fileText = await get("file");
    if(typeof fileText == undefined){
        //script is done
        return;
    }
    /*
    Since the script is reloaded every time the page does, 
    we need to delete entries as we complete them
     */
    let order = fileText.substring(0, fileText.search(NEWLINE) + 1).trim().split(",");
    fileText = fileText.substring(fileText.search(NEWLINE) + 1, fileText.length).trim();
    
    console.log("Order is [" + order.join(", ") + "]");
    console.log("Remaining orders are: \n" + fileText);
        
    if(order.length !== 8){
        //were done! Download the file
        downloadResult();
    } else {
        await set("file", fileText);
        $('[name="BusinessUnit"]').val(order[0]);
        $('[name="Account"]').val(order[1]);
        $('[name="Fund"]').val(order[2]);
        $('[name="ORG"]').val(order[3]);
        $('[name="Program"]').val(order[4]);
        $('[name="SubClass"]').val(order[5]);
        $('[name="BudgetYear"]').val(order[6]);
        $('[name="ProjectGrant"]').val(order[7]);
    }
}
/*
function processOrder(){
    chrome.storage.sync.get("file", (file)=>{
        if(typeof file["file"] == undefined){
            //script is done
            return;
        }
        
        Since the script is reloaded every time the page does, 
        we need to delete entries as we complete them
         
        let text = file["file"];
        let lines = text.split(/\r?\n|\r/);
        let order = lines.shift().split(",");
        if(order.length !== 8){
            //were done! Download the file
            downloadResult();
        } else {
            chrome.storage.sync.set({"file": lines.join("\n")}, ()=>{
                $('[name="BusinessUnit"]').val(order[0]);
                $('[name="Account"]').val(order[1]);
                $('[name="Fund"]').val(order[2]);
                $('[name="ORG"]').val(order[3]);
                $('[name="Program"]').val(order[4]);
                $('[name="SubClass"]').val(order[5]);
                $('[name="BudgetYear"]').val(order[6]);
                $('[name="ProjectGrant"]').val(order[7]);
            });
            console.log("Current order is [" + order.join(", ") + "]");
        }

        console.log("Entire text is: \n" + text);
    });
}*/

function readResult(){
    let text = $("table[border=1]").table2CSV({
        delivery: "value"
    });
    
    chrome.storage.sync.get("result", (result)=>{
        if(result["result"].trim() !== ""){
            //already have a result, so ignore headers
            text = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        }
        chrome.storage.sync.set({"result": result["result"] + text + "\n"}, ()=>{
            console.log("set result to " + result["result"] + text);
        });
    });
}

//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
function downloadResult(){
    chrome.storage.sync.get("result", (result)=>{
        let data = result["result"];
        console.log(data);
        let file = new Blob([data], {type: "text/csv"});
        let a = $("<a></a>");
        let url = URL.createObjectURL(file);
        a.attr("href", url);
        a.attr("download", "result.csv");
        $("body").append(a);
        //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
        a[0].click();
        setTimeout(()=>{
            $("body").remove(a);
            window.URL.revokeObjectURL(url);
            chrome.storage.sync.remove(["file", "result"], ()=>{
                console.log("All done :)");
            });
        }, 0);
    });
}

$("#test").click(async()=>{
    await set("test", "test value");
    let val = await get("test");
    console.log("val is " + val);
    //downloadResult();
});