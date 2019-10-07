$("#submit").click(()=>{
    let fileChooser = $("#file").get(0);
    
    let reader = new FileReader();
    reader.onload = (e)=>{
        chrome.storage.sync.set({file: e.target.result}, ()=>{
            chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
                let newUrl = "https://psreports.losrios.edu/AccountBalanceSumDescr.asp";
                //newUrl = "https://arc.losrios.edu";
                //newUrl = "http://localhost:8000";
                chrome.tabs.update(tab.id, {url: newUrl});
            });
        });
    };
    reader.readAsText(fileChooser.files[0], "UTF-8");
});

//this file is run whenever the icon is clicked



