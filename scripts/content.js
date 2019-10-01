// do DOM based stuff with this
// https://developer.chrome.com/extensions/content_scripts
/*
let jq1 = document.createElement("script");
jq1.src = "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js";

let jq2 = document.createElement("script");
jq2.src = "";
document.body.appendChild();
*/
console.log("Loaded from content.js");
console.log(document);

