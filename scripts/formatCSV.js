class HeaderRequirement{
    /*
     * 
     * @param {string} text what this header should output as in the result file
     * @param {string array} possibleMatches alternate values for headers in a source header which will match to this one
     * @returns {HeaderRequirement}
     */
    constructor(text, possibleMatches){
        this.text = text;
        if(possibleMatches === null || possibleMatches === undefined){
            this.possibleMatches = [text];
        } else if(!Array.isArray(possibleMatches)){
            this.possibleMatches = [possibleMatches];
        } else {
            this.possibleMatches = possibleMatches;
        }
        this.possibleMatches = this.possibleMatches.map((match)=>match.toUpperCase());
    }
    
    /*
     * Searches for any headers in the given string array which match this requirement
     * @param {type} headers
     * @returns {int} the index of this header in the given array of headers
     */
    checkForMatch(headers){
        let ret = -1;
        headers = headers.map((header)=>header.toUpperCase());
        for(let i = 0; i < headers.length && ret === -1; i++){
            if(this.possibleMatches.some((match)=>match === headers[i])){
                ret = i;
            }
        }
        return ret;
    }
}
/*
 * Template - Work in progress
 */
function formatFile(fileText){
    
}

function indexOfIgnoreCase(searchFor, options){
    let ret = -1;
    searchFor = searchFor.toUpperCase();
    for(let i = 0; i < options.length && ret === -1; i++){
        if(options[i].toUpperCase() === searchFor){
            ret = i;
        }
    }
    return ret;
}