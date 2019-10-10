const NEWLINE = /\r?\n|\r/;

async function get(varName){
    return new Promise((resolve, reject)=>{
        chrome.storage.local.get(varName, (val)=>{
            resolve(val[varName]);
        });
    });
}

async function set(varName, val){
    let obj = {};
    obj[varName] = val; //can't do with colon or dot notation
    return new Promise((resolve, reject)=>{
        chrome.storage.local.set(obj, ()=>{
            resolve();
        });
    });
}