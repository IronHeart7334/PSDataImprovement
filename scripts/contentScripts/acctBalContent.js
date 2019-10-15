/*
Once the page is fully loaded,
run functions based on which page this was injected into.
 */
$(window).on("load", ()=>{
    let loc = window.location;
    if(loc.hostname === "psreports.losrios.edu"){
        if(loc.pathname === "/AccountBalanceSumDescr.asp"){
            processOrder();
        } else if(loc.pathname === "/AccountBalanceSumDescrQ.asp"){
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
        console.log("script is done");
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
        await downloadResult();
        clean();
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
            $('[name="Query"]')[0].click();
        }
    }
}

async function readResult(){
    let prevResult = await get("result");
    
    if(prevResult === null){
        //done with script
        console.log("script is done");
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
        $("a[href='AccountBalanceSumDescr.asp']")[0].click();
    }
}

//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
async function downloadResult(){
    let result = await get("result");
    let file = new Blob([result], {type: "text/csv"});
    let a = $("<a></a>");
    let url = URL.createObjectURL(file);
    a.attr("href", url);
    a.attr("download", "result.csv");
    $("body").append(a);
    console.log(result);
    
    //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
    a[0].click();
    setTimeout(async()=>{
        $("body").remove(a);
        window.URL.revokeObjectURL(url);
        await set("result", "");
    }, 0);
}

async function clean(){
    await del("file");
    await del("result");
    await del("autoclick");
    console.log("All done :)");
}