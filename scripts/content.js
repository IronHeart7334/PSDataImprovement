// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts

$(window).on("load", ()=>{
    let loc = window.location;
    if(loc.hostname === "psreports.losrios.edu"){
        if(loc.pathname === "AccountBalanceSumDescr.asp"){
            processOrder();
        } else if(loc.pathname === "AccountBalanceSumDescrQ.asp"){
            readResult();
        } else {
            console.log("Pathname is " + loc.pathname);
        }
    } else if(loc.hostname === "localhost"){
        if(loc.pathname === "/" || loc.pathname === "/index.html"){
            processOrder();
        } else if(loc.pathname === "/result.html"){
            readResult();
        } else {
            console.log("Pathname is " + loc.pathname);
        }
    } else {
        console.log("Hostname is " + loc.hostname);
    }
});

async function processOrder(){
    let fileText = await get("file");
    if(fileText === null){
        //script is done
        console.log("done");
        return;
    }
    let autoclick = await get("autoclick");
    console.log("Autoclick is " + ((autoclick) ? "on" : "off"));
    
    /*
    Since the script is reloaded every time the page does, 
    we need to delete entries as we complete them
     */
    let orders = fileText.split(NEWLINE);
    let order = orders.shift().split(",");
    
    fileText = orders.join("\n");
    
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
        if(autoclick){
            //might need to change based on what the button is like on the actual website
            setTimeout(()=>{
                $('[name="submit"]')[0].click();
            }, 1000);
        }
    }
}

async function readResult(){
    let prevResult = await get("result");
    
    if(prevResult === null){
        //done with script
        console.log("done");
        return;
    }
    
    let autoclick = await get("autoclick");
    console.log("Autoclick is " + ((autoclick) ? "on" : "off"));
    
    let text = $("table[border=1]").table2CSV({
        delivery: "value"
    });
    
    if(prevResult.trim() !== ""){
        //already have a result, so ignore headers of the new text
        text = text.substring(text.search(/\r?\n|\r/) + 1).trim();
    }
    await set("result", prevResult + text + "\n");
    console.log("set result to " + prevResult + text);
    
    if(autoclick){
        // change name once I see the official site again
        setTimeout(()=>{
            $("a[name='goback']")[0].click();
        }, 1000);
    }
}

//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
async function downloadResult(){
    let result = await get("result");
    console.log(result);
    let file = new Blob([result], {type: "text/csv"});
    let a = $("<a></a>");
    let url = URL.createObjectURL(file);
    a.attr("href", url);
    a.attr("download", "result.csv");
    $("body").append(a);
    //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
    a[0].click();
    setTimeout(async()=>{
        $("body").remove(a);
        window.URL.revokeObjectURL(url);
        await del("file");
        await del("result");
        await del("autoclick");
        console.log("All done :)");
    }, 0);
}
/*
//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
function downloadResult(){
    chrome.storage.local.get("result", (result)=>{
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
            chrome.storage.local.remove(["file", "result", "autoclick"], ()=>{
                console.log("All done :)");
            });
        }, 0);
    });
}*/

$("#test").click(async()=>{
    await set("test", "test value");
    let val = await get("test");
    console.log("val is " + val);
    //downloadResult();
});