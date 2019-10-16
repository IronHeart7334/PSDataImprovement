class AcctBalContentScript extends ContentScript{
    constructor(){
        super("acctFile", "acctResult", "AccountBalanceSumDescr.asp", "AccountBalanceSumDescrQ.asp");
    }
    
    async processQuery(query){
        $('[name="BusinessUnit"]').val(query[0]);
        $('[name="Account"]').val(query[1]);
        $('[name="Fund"]').val(query[2]);
        $('[name="ORG"]').val(query[3]);
        $('[name="Program"]').val(query[4]);
        $('[name="SubClass"]').val(query[5]);
        $('[name="BudgetYear"]').val(query[6]);
        $('[name="ProjectGrant"]').val(query[7]);
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
    
    async postProcessResult(){
        let autoclick = await get("autoclick");
        if(autoclick){
            $("a[href='AccountBalanceSumDescr.asp']")[0].click();
        }
    }
}
new AcctBalContentScript().run();