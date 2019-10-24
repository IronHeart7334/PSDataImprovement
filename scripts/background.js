//https://developer.chrome.com/extensions/getstarted
//chrome://extensions/
//https://developer.chrome.com/extensions/overview

// this file should be the event handler
chrome.runtime.onInstalled.addListener(()=>{
    alert("Click the plugin icon to enter your orders");
    
    /*
    I don't think I need any of this stuff
    
    
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
    });*/
});