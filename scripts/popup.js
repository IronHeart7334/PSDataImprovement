let orderElements = [];
let orderCount = 0;

$("#add").click(()=>{
    let newOrder = $(`<div id=order${orderCount}></div>`);
    //newOrder.addClass("order");
    let acctIp = $(`<input type="text" id="acct${orderCount}" name="acct${orderCount}"/>`);
    let orgIp = $(`<input type="text" id="org${orderCount}" name="org${orderCount}"/>`);
    let progIp = $(`<input type="text" id="prog${orderCount}" name="prog${orderCount}"/>`);
    
    newOrder.append(acctIp).append(orgIp).append(progIp);
    
    //not working. flashes into existence briefly, then goes away
    newOrder.insertBefore($("#add"));
    orderCount++;
    orderElements.push(newOrder);
});


let button = document.getElementById("submit");

button.addEventListener("click", (e)=>{
    chrome.storage.sync.set({accts: $("#accts").value}, ()=>{
        chrome.tabs.executeScript({
            code: `console.log("hello");`
        });
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
          var tabUrl = encodeURIComponent(tab.url);
          var tabTitle = encodeURIComponent(tab.title);
          var myNewUrl = "https://psreports.losrios.edu"; //not working
          myNewUrl = "https://arc.losrios.edu";
          chrome.tabs.update(tab.id, {url: myNewUrl}, (tab)=>{

          });
        });
    });
});

//https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content
//this file is run whenever the icon is clicked



