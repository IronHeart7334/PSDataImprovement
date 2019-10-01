//https://developer.chrome.com/extensions/getstarted
//chrome://extensions/
//https://developer.chrome.com/extensions/overview

// this file should be the event handler
chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.set({name: "name not set"}, ()=>{
        alert("Click the plugin icon to set your name");
    });
    
    //click on plugin icon to show popup
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        hostEquals: 'developer.chrome.com',
                    }
                })
            ],
            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]
        }]);
    });
    
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
        // If the received message has the expected format...
        if (msg.text === "DOM") {
            // Call the specified callback, passing
            // the web-page's DOM content as argument
            sendResponse(document.all[0].outerHTML);
        }   
    });
});