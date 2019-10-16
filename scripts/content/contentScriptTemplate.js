/*
 * Content scripts are appended to the end of any page which meets criteria described in maifest.json
 * 
 * See https://developer.chrome.com/extensions/content_scripts
 */

/**
 * ContentScript is an abstract class which serves as the base for content scripts.
 * subclasses should override the following methods:
 *  
 *  (1) processQuery(query); This method is run whenever the script loads into a page with the pathname
 *      matching the ContentScript's inputURL. Query is an array of data which should be put into form elements on the page.
 *      
 *  (2) processResult(); This method is run whenever the script loads into a page 
 *      with the pathname matching the ContentScript's resultURL. This method should
 *      pull data from the result of a query, then return a string containing the result,
 *      formatted as CSV.
 *      
 *  (3) postProcessResult(); This method is run after running processResult 
 *      and storing the data. Generally speaking, this method should click
 *      any "back" or "enter a new query" buttons on the page. 
 *      (only if this.autoclick is true)
 * 
 * At the end of content scripts overriding this,
 * you should have something like this:
 * 
 *  new ContentScriptSubclass().run();
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
    constructor(queryFileName, resultFileName, inputURL, resultURL){
        if(!inputURL.startsWith("/")){
            inputURL = "/" + inputURL;
        }
        if(!resultURL.startsWith("/")){
            resultURL = "/" + resultURL;
        }
        
        this.queryFileName = queryFileName;
        this.resultFileName = resultFileName;
        this.inputURL = inputURL;
        this.resultURL = resultURL;
    }
    
    checkURL(){
        let page = window.location.pathname;
        if(page === this.inputURL){
            this.inputData();
        } else if(page === this.resultURL){
            this.readResult();
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
        remainingQueries = qArray.join("\n").trim(); //we just deleted the first row
        console.log(`Inputting query [${currQ.join(", ")}]`);
        console.log("Remaining queries are: \n" + remainingQueries);
        
        await set(this.queryFileName, remainingQueries);
        await this.processQuery(currQ);
    }
    
    async readResult(){
        let prevResult = await get(this.resultFileName);
        if(prevResult === null){
            throw new Error("Result file for script does not exist, yet the script continues to run: it should be done by now.");
        }
        let newText = await this.processResult();
        if(prevResult.trim() !== ""){
            //already have a result, so get rid of headers
            newText = "\n" + newText.substring(newText.search(NEWLINE) + 1).trim();
        }
        await set(this.resultFileName, prevResult + newText);
        console.log("Set result to \n" + prevResult + newText);
        
        await this.checkIfDone();
        await this.postProcessResult();
    }
    
    async downloadResult(){
        //https://stackoverflow.com/questions/13405129/javascript-create-and-save-file?noredirect=1&lq=1
        let result = await get(this.resultFileName);
        let file = new Blob([result], {type: "text/csv"});
        let a = $("<a></a>");
        let url = URL.createObjectURL(file);
        a.attr("href", url);
        a.attr("download", "result.csv");
        $("body").append(a);
        console.log("downloading \n" + result);

        //JQuery click doesn't trigger hrefs, so I need to use the HTMLElement click method
        a[0].click();
        setTimeout(async()=>{
            $("body").remove(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    
    async clean(){
        await del(this.queryFileName);
        await del(this.resultFileName);
        await del("autoclick");
        console.log("All done :)");
    }
    
    async checkIfDone(){
        let done = false;
        let remainingQ = await get(this.queryFileName);
        if(remainingQ === null){
            //already done, already cleaned, nothing to do
            done = true;
        } else if(remainingQ.trim() === ""){
            //no more queries to process, so clean up and download
            await this.downloadResult();
            await this.clean();
            done = true;
        }
        //else, not done
        
        return done;
    }
    
    run(){
        $(window).on("load", async()=>{
            let order = await get(this.queryFileName);
            if(order === null){
                console.log("Script is done. Do nothing.");
            } else {
                this.checkURL();
            }
        });
    }
    
    async processQuery(query){
        throw new Error("method processQuery(query) is abstract; thus, it must be overridden.");
    }
    
    // this should return a string: the result of reading the result of the query
    async processResult(){
        throw new Error("method processResult() is abstract; thus, it must be overridden.");
    }
    
    // this part should click the back button
    async postProcessResult(){
        throw new Error("method postProcessResult() is abstract; thus, it must be overridden.");
    }
}