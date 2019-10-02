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



