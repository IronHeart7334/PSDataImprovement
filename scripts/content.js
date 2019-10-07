// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts
console.log($);

console.log("Loaded from content.js");
console.log(document);

chrome.storage.sync.get("file", (file)=>{
    console.log(file["file"]);
});
/*
chrome.storage.sync.get("orders", (orderString)=>{
    let orders = JSON.parse(orderString["orders"]);
    console.log(orders);
    if(orders.length === 0){
        return;
    }
    
    let currOrder = orders.shift();
    chrome.storage.sync.set({"orders": JSON.stringify(orders)}, ()=>{
        $("accts").val(currOrder[0]);
        $("orgs").val(currOrder[1]);
        $("progs").val(currOrder[2]);
        $("#submit").click();
    });
});
*/
//start doing DOM manipulation to fill in the fields