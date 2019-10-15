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
        this.resultFileName = queryFileName + " result";
        this.inputURL = inputURL;
        this.resultURL = resultURL;
        this.autoclick = await get("autoclick");
        await set(this.resultFileName, "");
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
        remainingQueries = qArray.join("\n").trim(); //we just deleted the first row
        console.log(`Inputting query [${currQ.join(", ")}]`);
        console.log("Remaining queries are: \n" + remainingQueries);
        
        await set(this.queryFileName, remainingQueries);
        await processQuery(currQ);
    }
    
    async readResult(){
        let prevResult = await get(this.resultFileName);
        if(prevResult === null){
            throw new Error("Result file for script does not exist, yet the script continues to run: it should be done by now.");
        }
        let newText = await processResult();
        if(prevResult.trim() !== ""){
            //already have a result, so get rid of headers
            newText = "\n" + newText.substring(newText.search(NEWLINE) + 1).trim();
        }
        await set(this.resultFileName, prevResult + newText);
        console.log("Set result to \n" + prevResult + newText);
        
        await checkIfDone();
        await postProcessResult();
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
            await downloadResult();
            await clean();
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
                checkURL();
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