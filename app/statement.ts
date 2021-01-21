    export interface DEAL{
        cost:number;
        amount:number;
        dealtype:number;
        username:string;
        usertype:number;
        userimg:string;
        time: number;
        accountid:string;
        sign:string;
    }

    export interface DEALDATA{
        month: number;
        year: number;
        income:number;
        spend:number;
        dealdataary:Array<DEAL>;
    }

    export interface DEALUSER{
        username:string;
        usertype:number;
        userimg:string;
    }

    export interface DEALDATE{
        month: number;
        year: number;
        income:number;
        spend:number;
        isdate:boolean;
    }

    export interface POSTDATA{
        dealtype: number;
        time: number;
        cost: number;
        accountid:string;
        sign:string;
    }

    export interface TOTALPOSTDATA{
        starttime: number;
        endtime: number;
        accountid:string;
        sign:string;
    }

    export interface SELECTDATE{
        year: number;
        monthAry:Array<number>;
    }