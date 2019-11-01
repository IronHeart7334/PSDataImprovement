class PoContentScript extends ContentScript{
    constructor(){
        super("poFile", "poResult", "PO_History.asp", "PO_HistoryQ.asp");
    }
    
    checkURL(){
        let qrParamPairs = window.location.search.substring(1).split("&");
        console.log(qrParamPairs);
        if(window.location.pathname.toUpperCase() === this.resultURL && !qrParamPairs.some((paramPair)=>paramPair === "POID_History_PagingMove=ALL")){
            this.expandReqResults();
        } else {
            super.checkURL();
        }
    }
    
    async processQuery(query){
        $('input[name="PO_ID_Input"]').val(query[1]);
        let autoclick = await get("autoclick");
        if(autoclick){
            $('[name="Query"]')[0].click();
        }
    }
    
    async processResult(){
        //                          do we want both tables? only one? which one?
        return $("table[border=1]").eq(1).table2CSV({
            delivery: "value"
        });
    }
    
    async expandReqResults(){
        let expandButton = $('a[href="/PO_HistoryQ.asp?POID_History_PagingMove=ALL');
        if(expandButton.length > 0){
            expandButton[0].click();
        }
    }
    
    // this part should click the back button
    async postProcessResult(){
        let autoclick = await get("autoclick");
        if(autoclick){
            $("a[href='PO_history.asp']")[0].click();
        }
    }
    
    async onDone(){
        if((await get("everything")) !== null){
            //poInfoFile was already set by reqContent
            await this.clean(); //this won't get run on this page unless we call this now
            setUrl("https://psreports.losrios.edu/PurchaseOrderInformation.asp");
        }
    }
}
new PoContentScript().run();