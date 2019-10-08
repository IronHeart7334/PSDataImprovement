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

function test(){
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

        console.log(text);
    });
}