const NEWLINE = /\r?\n|\r/;

//https://stackoverflow.com/questions/38261197/how-to-check-if-a-key-is-set-in-chrome-storage
async function get(varName){
    let obj = {};
    obj[varName] = null; //default value
    return new Promise((resolve, reject)=>{
        chrome.storage.local.get(obj, (val)=>{
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

async function del(varName){
    return new Promise((resolve, reject)=>{
        chrome.storage.local.remove(varName, ()=>{
            resolve();
        });
    });
}