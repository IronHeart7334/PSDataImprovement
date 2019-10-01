let ip = document.getElementById("name");

function log(msg){
    chrome.tabs.executeScript({
        code: `console.log("${msg}");`
    });
}

ip.addEventListener("change", (e)=>{
    chrome.storage.sync.set({name: ip.value}, ()=>{
        chrome.extension.getBackgroundPage().console.log("background");
        
        chrome.tabs.executeScript({
            code: `console.log("hello, ${ip.value}");`
        });
    });
});

//https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content
//this file is run whenever the icon is clicked

chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
  var tabUrl = encodeURIComponent(tab.url);
  var tabTitle = encodeURIComponent(tab.title);
  var myNewUrl = "https://psreports.losrios.edu"; //not working
  myNewUrl = "https://arc.losrios.edu";
  chrome.tabs.update(tab.id, {url: myNewUrl}, (tab)=>{
      log("Window id is " + tab.windowId);
      chrome.tabs.sendMessage(tab.id, {text: "DOM"}, log);
  });
});

