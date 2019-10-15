/*
 * Content scripts are appended to the end of any page which meets criteria described in maifest.json
 * 
 * See https://developer.chrome.com/extensions/content_scripts
 */

class ContentScript{
    /*
     * queryFileName: the key in local storage which links to
     *  the data used by this script
     * inputURL: the pathname of the page where the script
     *  should imitate a user entering input.
     * resultURL: the pathname of the page where the script
     *  should extract data from the result of its query
     */
    async constructor(queryFileName, inputURL, resultURL){
        let data = await get(queryFileName);
        if(data === null){
            throw new Error(`Nothing is set in local storage for key "${queryFileName}"`);
        }
        
        if(!inputURL.startsWith("/")){
            inputURL += "/";
        }
        if(!resultURL.startsWith("/")){
            resultURL += "/";
        }
        
        this.queryFileName = queryFileName;
        this.inputURL = inputURL;
        this.resultURL = resultURL;
        this.autoclick = await get("autoclick");
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
    
    async inputData(){
        let remainingQueries = await get(this.queryFileName);
        if(remainingQueries === null || remainingQueries.trim() === ""){
            throw new Error("No queries remain, yet the script continues to run: it should be done by now.");
        }
        let qArray = remainingQueries.split(NEWLINE);
        /*
        Since this script is reloaded every time it changes pages,
        we cannot simply iterate over each query to plug them in one at a time,
        instead, we must delete queries from the query list whenever we input them.
         */
        let currQ = qArray.shift().split(",");
        remainingQueries = qArray.join("\n"); //we just deleted the first row
        console.log(`Inputting query [${currQ.join(", ")}]`);
        console.log("Remaining queries are: \n" + remainingQueries);
        
        await set(this.queryFileName, remainingQueries);
        await processQuery(currQ);
    }
    
    readResult(){
        
    }
    
    run(){
        $(window).on("load", async()=>{
            let order = await get(this.queryFileName);
            if(order === null){
                console.log("Script is done. Do nothing.");
            } else {
                checkURL();
            }
        });
    }
    
    processQuery(query){
        throw new Error("method processQuery(query) is abstract; thus, it must be overridden.");
    }
}