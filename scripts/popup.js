$("#submit").click(()=>{
    let fileChooser = $("#file").get(0);
    let reader = new FileReader();
    reader.onload = (e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        chrome.storage.sync.set({file: newText}, ()=>{
            let newUrl = "https://psreports.losrios.edu/AccountBalanceSumDescr.asp";
            //newUrl = "https://arc.losrios.edu";
            setUrl(newUrl);
        });
    };
    reader.readAsText(fileChooser.files[0], "UTF-8");
});

//this file is run whenever the icon is clicked

$("#test").click(()=>{
    let fileChooser = $("#file").get(0);
    let reader = new FileReader();
    reader.onload = (e)=>{
        let text = e.target.result;
        //remove the header
        let newText = text.substring(text.search(/\r?\n|\r/) + 1).trim();
        chrome.storage.sync.set({file: newText}, ()=>{
            setUrl("localhost:8000");
        });
    };
    reader.readAsText(fileChooser.files[0], "UTF-8");
});

function setUrl(newUrl){
    chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
        chrome.tabs.update(tab.id, {url: newUrl});
    });
}


