
async function get(varName){
    return new Promise((resolve, reject)=>{
        chrome.storage.sync.get(varName, (val)=>{
            console.log(val, val[varName]);
            resolve(val[varName]);
        });
    });
}

async function set(varName, val){
    return new Promise((resolve, reject)=>{
        chrome.storage.sync.set({varName: val}, ()=>{
            console.log(val);
            resolve();
        });
    });
}