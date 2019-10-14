/*
 I will want to templatize these files later,
 like I did with the room visualizer.
 */
$(window).on("load", async ()=>{
    let reqFile = await get("reqFile");
    if(reqFile === null){
        console.log("Script is done.");
        return;
    }
    
    console.log("running script");
    
    if(window.location.pathname === "/REQ_History.asp"){
        submitReqQuery();
    } else if(window.location.pathname === "/REQ_HistoryQ.asp"){
        let qrParamPairs = window.location.search.substring(1).split("&");
        console.log(qrParamPairs);
        if(qrParamPairs.some((paramPair)=>paramPair === "REQ_History_PagingMove=ALL")){
            readReqResults();
        } else {
            expandReqResults();
        }
    } else {
        console.log("window.location.pathname is " + window.location.pathname);
    }
});

async function submitReqQuery(){
    let reqFile = await get("reqFile");
    
    let autoclick = await get("autoclick");
    console.log("Autoclick is " + ((autoclick) ? "on" : "off"));
    
    let queries = reqFile.split(NEWLINE);
    let currQ = queries.shift().split(",");
    reqFile = queries.join("\n");
    
    console.log("Querying [" + currQ.join(", ") + "]");
    console.log("Remaining queries are: \n" + reqFile);
    
    if(currQ.length < 2){
        await downloadResult();
        clean();
    } else {
        await set("reqFile", reqFile);
        $('input[name="REQUESTOR_ID"]').val(currQ[0]);
        $('input[name="REQ_NO"]').val(currQ[1]);
        if(autoclick){
            $('[name="Query"]')[0].click();
        }
    }
}

async function expandReqResults(){
    let expandButton = $('a[href="/REQ_HistoryQ.asp?REQ_History_PagingMove=ALL');
    if(expandButton.length > 0){
        expandButton[0].click();
    }
}

async function readReqResults(){
    let prevResult = await get("reqResult");
    
    let autoclick = await get("autoclick");
    console.log("Autoclick is " + ((autoclick) ? "on" : "off"));
    
    let text = $("table[border=1]").table2CSV({
        delivery: "value"
    });
    
    if(prevResult.trim() !== ""){
        //already have a result, so ignore headers of the new text
        text = text.substring(text.search(/\r?\n|\r/) + 1).trim();
    }
    await set("reqResult", prevResult + text + "\n");
    console.log("set result to " + prevResult + text);
    
    if(autoclick){
        $("a[href='REQ_History.asp']")[0].click();
    }
}

async function downloadResult(){
    let result = await get("reqResult");
    let file = new Blob([result], {type: "text/csv"});
    let a = $("<a></a>");
    let url = URL.createObjectURL(file);
    a.attr("href", url);
    a.attr("download", "reqResult.csv");
    $("body").append(a);
    console.log(result);
    
    //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
    a[0].click();
    setTimeout(async()=>{
        $("body").remove(a);
        window.URL.revokeObjectURL(url);
        await set("reqResult", "");
    }, 0);
}

async function clean(){
    await del("reqFile");
    await del("reqResult");
    await del("autoclick");
    console.log("All done :)");
}