/*
 * Content scripts are appended to the end of any page which meets criteria described in maifest.json
 * 
 * See https://developer.chrome.com/extensions/content_scripts
 */

class ContentScript{
    /*
     * orderFileName: the key in local storage which links to
     *  the data used by this script
     * inputURL: the pathname of the page where the script
     *  should imitate a user entering input.
     * resultURL: the pathname of the page where the script
     *  should extract data from the result of its query
     */
    async constructor(orderFileName, inputURL, resultURL){
        let data = await get(orderFileName);
        if(data === null){
            throw new Error(`Nothing is set in local storage for key "${orderFileName}"`);
        }
        
        if(!inputURL.startsWith("/")){
            inputURL += "/";
        }
        if(!resultURL.startsWith("/")){
            resultURL += "/";
        }
        
        this.orderFileName = orderFileName;
        this.inputURL = inputURL;
        this.resultURL = resultURL;
    }
    
    checkURL(){
        let page = window.location.pathname;
        if(page === this.inputURL){
            inputData();
        } else if(page === this.resultURL){
            readResult();
        } else {
            throw new Error(
                `This script was inserted into a page with pathname
                ${page}, but has no behaviour associated with it.`);
        }
    }
    
    inputData(){
        
    }
    
    readResult(){
        
    }
    
    run(){
        $(window).on("load", async()=>{
            let order = await get(this.orderFileName);
            if(order === null){
                console.log("Script is done. Do nothing.");
            } else {
                checkURL();
            }
        });
    }
}