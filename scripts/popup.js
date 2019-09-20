let ip = document.getElementById("name");

ip.addEventListener("change", (e)=>{
    chrome.storage.sync.set({name: ip.value}, ()=>{
        chrome.extension.getBackgroundPage().console.log("hello, " + ip.value);
        
        //not working
        chrome.tabs.query(
            {
                active: true, 
                currentWindow: true
            }, 
            function(tabs) {
                chrome.tabs.executeScript(
                    tabs[0].id,
                    {
                        code: "console.log('hello, ' + ip.value);"
                    }
                );
            }
        );
    });
});

