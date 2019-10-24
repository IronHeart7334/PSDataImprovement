class ReqContentScript extends ContentScript{
    constructor(){
        super("reqFile", "reqResult", "REQ_History.asp", "REQ_HistoryQ.asp");
    }
    
    checkURL(){
        let qrParamPairs = window.location.search.substring(1).split("&");
        console.log(qrParamPairs);
        if(window.location.pathname === this.resultURL && !qrParamPairs.some((paramPair)=>paramPair === "REQ_History_PagingMove=ALL")){
            this.expandReqResults();
        } else {
            super.checkURL();
        }
    }
    
    async processQuery(query){
        $('input[name="REQUESTOR_ID"]').val(query[0]);
        $('input[name="REQ_NO"]').val(query[1]);
        let autoclick = await get("autoclick");
        if(autoclick){
            $('[name="Query"]')[0].click();
        }
    }
    
    async processResult(){
        return $("table[border=1]").table2CSV({
            delivery: "value"
        });
    }
    
    async expandReqResults(){
        let expandButton = $('a[href="/REQ_HistoryQ.asp?REQ_History_PagingMove=ALL');
        if(expandButton.length > 0){
            expandButton[0].click();
        }
    }
    
    // this part should click the back button
    async postProcessResult(){
        let autoclick = await get("autoclick");
        if(autoclick){
            $("a[href='REQ_History.asp']")[0].click();
        }
    }
}
new ReqContentScript().run();