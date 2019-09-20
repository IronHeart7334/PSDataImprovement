let ip = document.getElementById("name");

chrome.storage.sync.get("name", (data)=> {
    console.log(data);
});

