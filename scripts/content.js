// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts
console.log($);

console.log("Loaded from content.js");
console.log(document);

chrome.storage.sync.get("orders", (x)=>{
    console.log(x);
});

//start doing DOM manipulation to fill in the fields