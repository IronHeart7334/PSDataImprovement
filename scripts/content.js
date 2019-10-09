// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts

console.log("Loaded from content.js");
console.log(document);

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

function processOrder(){
    chrome.storage.sync.get("file", (file)=>{
        /*
        Since the script is reloaded every time the page does, 
        we need to delete entries as we complete them
         */
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
            console.log(order);
        }

        console.log(text);
    });
}

async function readResult(){
    let text = $("body").html();
    //let result = await get("result");
    //await set("result", result + text);
    /*await new Promise((resolve, reject)=>{
        chrome.storage.sync.set({"result": result + text}, ()=>{
            resolve();
        });
    });
    console.log(result);
    let x = await get("result");
    console.log(x);*/
    chrome.storage.sync.get("result", (result)=>{
        chrome.storage.sync.set({"result": result["result"] + text}, ()=>{
            console.log("set result to " + result["result"] + text);
        });
    });
}

//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
function downloadResult(){
    chrome.storage.sync.get("result", (result)=>{
        let data = result["result"];
        console.log(data);
        let file = new Blob([data], {type: "text/html"});
        let a = $("<a></a>");
        let url = URL.createObjectURL(file);
        a.attr("href", url);
        a.attr("download", "result.html");
        $("body").append(a);
        //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
        a[0].click();
        setTimeout(()=>{
            $("body").remove(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    });
}

$("#test").click(()=>{
    downloadResult();
});