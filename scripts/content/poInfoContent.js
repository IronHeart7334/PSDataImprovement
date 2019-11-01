class PoInfoContentScript extends ContentScript{
    constructor(){
        super("poInfoFile", "poInfoResult", "PurchaseOrderInformation.asp", "PurchaseOrderInformationQ.asp");
    }
    
    async processQuery(query){
        $('input[name="PurchaseOrderNumber"]').val(query[1]);
        $('input[name="RequisitionNumber"]').val(query[0]);
        let autoclick = await get("autoclick");
        if(autoclick){
            $('[name="B1"]')[0].click();
        }
    }
    
    async processResult(){
        return $("table[border=1]").table2CSV({
            delivery: "value"
        });
    }
    
    // this part should click the back button
    async postProcessResult(){
        let autoclick = await get("autoclick");
        if(autoclick){
            $("a[href='PurchaseOrderInformation.asp']")[0].click();
        }
    }
    async onDone(){
        if((await get("everything")) !== null){
            await del("everything");
        }
    }
}
new PoInfoContentScript().run();