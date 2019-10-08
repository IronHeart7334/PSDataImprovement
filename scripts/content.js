// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts

console.log("Loaded from content.js");
console.log(document);

$(window).on("load", ()=>{
    switch(window.location.href){
        case "https://psreports.losrios.edu/AccountBalanceSumDescr.asp":
            processOrder();
            break;
        case "http://localhost:8000/":
            test();
            break;
        case "http://localhost:8000/index.html":
            test();
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
    //make this ignore first row 
    chrome.storage.sync.get("file", (file)=>{
        /*
        Since the script is reloaded every time the page does, 
        we need to delete entries as we complete them
         */
        let text = file["file"];
        let lines = text.split(/\r?\n|\r/);
        if(lines.length !== 0){
            //not out of orders to process
            let order = lines.shift().split(",");
            
            chrome.storage.sync.set({"file": lines.join("\n")}, ()=>{
                $('[name="BusinessUnit"]').val(order[0]);
                $('[name="Account"]').val(order[1]);
                $('[name="Fund"]').val(order[2]);
                $('[name="ORG"]').val(order[3]);
                $('[name="Program"]').val(order[4]);
                $('[name="SubClass"]').val(order[5]);
                $('[name="BudgetYear"]').val(order[6]);
                $('[name="BudgetGrant"]').val(order[7]);
            });
        }

        console.log(lines);
    });
}

function readResult(){
    let text = $("body").html();
    chrome.storage.sync.get("result", (result)=>{
        chrome.storage.sync.set({"result": result["result"] + text}, ()=>{
            
        });
    });
}

function test(){
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
            chrome.storage.sync.get("result", (result)=>{
                download(result["result"], "result", "html");
            });
        } else {
            chrome.storage.sync.set({"file": lines.join("\n")}, ()=>{
                $('[name="BusinessUnit"]').val(order[0]);
                $('[name="Account"]').val(order[1]);
                $('[name="Fund"]').val(order[2]);
                $('[name="ORG"]').val(order[3]);
                $('[name="Program"]').val(order[4]);
                $('[name="SubClass"]').val(order[5]);
                $('[name="BudgetYear"]').val(order[6]);
                $('[name="BudgetGrant"]').val(order[7]);
            });
            console.log(order);
        }

        console.log(text);
    });
}

//https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
function download(data, name, extension){
    console.log(data, name, extension);
    let file = new Blob([data], {type: extension});
    let a = $("<a></a>");
    let url = URL.createObjectURL(file);
    a.attr("href", url);
    a.attr("download", name);
    $("body").append(a);
    a.click();
    setTimeout(()=>{
        $("body").remove(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}