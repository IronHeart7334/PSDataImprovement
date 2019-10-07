/*
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
*/

$("#submit").click(()=>{
    /*
    chrome.runtime.getPackageDirectoryEntry((root)=>{
        $("#temp").text(root.toString());
    });*/
    /*
    chrome.fileSystem.chooseEntry({type: "openFile"}, (readOnlyEntry)=>{
        readOnlyEntry.file((file)=>{
            let reader = new FileReader();
            reader.onloadend = (e)=>{
                chrome.storage.set({file: e.target.results}, ()=>{
                    chrome.tabs.update(0, {url: "arc.losrios.edu"});
                });
            };
        });
    });*/
    let fileChooser = $("#file").get(0);
    
    let reader = new FileReader();
    reader.onload = (e)=>{
        chrome.storage.sync.set({file: e.target.result}, ()=>{
            chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
                chrome.tabs.update(tab.id, {url: "https://arc.losrios.edu"});
            });
        });
    };
    reader.readAsText(fileChooser.files[0], "UTF-8");
    return;
    
    let orders = [];
    let accts = $("#accts").val().split(",");
    let orgs = $("#orgs").val().split(",");
    let progs = $("#progs").val().split(",");
    
    let len = Math.max(accts.length, orgs.length, progs.length);
    while(accts.length < len){
        accts.push("");
    }
    while(orgs.length < len){
        orgs.push("");
    }
    while(progs.length < len){
        progs.push("");
    }
    for(let i = 0; i < len; i++){
        orders.push([accts[i], orgs[i], progs[i]]);
    }
    
    chrome.storage.sync.set({orders: JSON.stringify(orders)}, ()=>{
        chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
            let myNewUrl = "https://psreports.losrios.edu"; //not working
            myNewUrl = "https://arc.losrios.edu";
            myNewUrl = "http://localhost:8000";
            chrome.tabs.update(tab.id, {url: myNewUrl}, (tab)=>{
                //script is unloaded after updating
            });
        });
    });
});

/*
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
*/
//https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content
//this file is run whenever the icon is clicked



