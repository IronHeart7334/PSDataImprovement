https://developer.chrome.com/extensions/getstarted

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
});