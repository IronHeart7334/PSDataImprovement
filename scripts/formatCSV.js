/*
 * fileText: the original text of the file.
 * reqHeaders: an array of strings: the headers which must exist in the fileText
 *      The result will be formatted to contain only these headers, in the order given by this argument.
 */
function formatFile(fileText, reqHeaders){
    //format the file so that it's easier to parse as a CSV
    let body = fileText.split(NEWLINE).map((row)=>row.split(","));
    let headers = body.shift(); //removes headers from body
    if(headers.length < reqHeaders.length){
        throw new Error("File does not contain enough headers: It only has " + headers.length + ", but requires at least " + reqHeaders.length);
    }
    
    //verify that all the columns exist
    let headerCols = {};
    let idx;
    reqHeaders.forEach((header)=>{
        idx = headers.indexOf(header);
        if(idx === -1){
            throw new Error(`Could not find the header "${header}" in the given file.`);
        }
        headerCols[header] = idx;
    });
    
    //create the new file
    let newFile = "";
    let data;
    body.forEach((row)=>{
        for(let i = 0; i < reqHeaders.length; i++){
            /*
            
            Having an issue where files formatted incorrectly
            will result in a row of cells containing
            "undefined" appended to the end of the result file.
            */
            data = row[headerCols[reqHeaders[i]]];
            if(data === undefined){
                throw new Error();
            }
            data = data.trim();
            
            //remove quote marks
            while(data.indexOf('"') !== -1){
                data = data.replace('"', '');
            }
            newFile += data;
            newFile += (i === reqHeaders.length - 1) ? "\n" : ",";
        }
    });
    return newFile;
}

/*
 * Returns a function which, when invoked,
 * accepts the text of a CSV file,
 * and formats it using formatText.
 * 
 * Currently not used, but I may need it if we 
 * wind up needing different functions for linkButton in popup.js
 */
function formatterFor(reqHeaders){
    return (text)=>formatText(text, reqHeaders);
}