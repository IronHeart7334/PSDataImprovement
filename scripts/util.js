const NEWLINE = /\r?\n|\r/;

function setUrl(newUrl){
    chrome.tabs.query({currentWindow: true, active: true}, (tab)=>{
        chrome.tabs.update(tab.id, {url: newUrl});
    });
}

/*
    Storage related functions.
    It looks like Chrome extensions have no method of
    securely storing data, but so long as we want to 
    use a Chrome extension, this is one of our only
    options.

    Since the data is stored on the user's computer,
    I don't think this is a major problem, as one
    would have to access the user's computer to
    access the data.

    The only way I can think of to securely store the
    data would be to store it on some other server, but
    that just makes the process more convoluted.

    I'll want to bring this up with Randy, see what he
    thinks. If I need something more secure, I may have
    to ask Tak.
 */

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

/*
 * Downloads a file to the user's computer.
 * 
 * Parameters:
 *  fileName: what to call the file the user downloads
 *  fileText: the contents of the file
 *  fileType: the MIME type of the file
 */
async function download(fileName, fileText, fileType){
    //https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
    let file = new Blob([fileText], {type: fileType});
    let a = $("<a></a>");
    let url = URL.createObjectURL(file);
    a.attr("href", url);
    a.attr("download", fileName);
    $("body").append(a);

    //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
    a[0].click();
    setTimeout(async()=>{
        $("body").remove(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

async function reportError(error){
    let text = "Uh oh! Something bad happened!\n";
    text += "Please send an EMail to Matt Crow with this file attached:\n";
    text += "this file will help Matt figure out what went wrong.\n";
    text += "!!!The Error:!!!\n";
    text += "Name: " + error.name + "\n";
    text += "* Description: " + error.message + "\n";
    text += "* Stack trace: " + error.stack + "\n";
    
    await download("error-report.txt", text, "text/plain");
}

window.onerror = (msg, src, line, col, err)=>{
    reportError(err);
};
//window.onerror = function(message, source, lineno, colno, error) 