// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts

console.log("Loaded from content.js");
console.log(document);

$(window).on("load", ()=>{
    if(window.location.href !== "https://psreports.losrios.edu/AccountBalanceSumDescr.asp"){
        console.log("URL is " + window.location.href);
    } else {
        processOrder();
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
                //problem is these aren't loaded yet
                console.log($('[name="Account"]').value);
                $('[name="BusinessUnit"]').value = order[0];
                $('[name="Account"]').value = order[1];
                console.log($('[name="Account"]').value);
                $('[name="Fund"]').value = order[2];
                $('[name="ORG"]').value = order[3];
                $('[name="Program"]').value = order[4];
                $('[name="SubClass"]').value = order[5];
                $('[name="BudgetYear"]').value = order[6];
                $('[name="BudgetGrant"]').value = order[7];
            });
        }

        console.log(lines);
    });
}