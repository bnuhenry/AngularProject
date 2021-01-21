import { Injectable } from '@angular/core';
import { WATER,WATERDATE,SELECTDATE } from '../water'

@Injectable({
  providedIn: 'root'
})
export class AiService {
  water:WATER;
  waterdate:WATERDATE;
  DataAry:Array<any> = [];
  showMonth:number;
  showYear:number;
  selectedMonthAry:Array<SELECTDATE> = [];
  selectedYearAry:Array<number> = [];
  selectedDate:SELECTDATE;

  getdata(){
    this.DataAry = [];
    this.selectedMonthAry = [];
    this.selectedYearAry = [];
    let when:Date = new Date();
    this.showMonth = new Date().getMonth()+1;
    this.showYear = new Date().getFullYear();
    let i:number;
    this.getselectary();
    this.getyearary();
    this.waterdate = {
      month : this.showMonth,
      year : this.showYear,
      isdate : true
    };
    this.DataAry.push(this.waterdate);
    for(i=730;i>=0;i--){
      this.water = {
        time : when.getTime(),
        duration : Number((Math.random()*20+1).toFixed(0)),
        pure : Number((Math.random()+0.01).toFixed(2)),
        tap : Number((Math.random()*12+0.1).toFixed(2)),
        isdate : false
      };
      this.DataAry.push(this.water);
      if(when.getDate()==1){
        if(this.showMonth>1){
          this.showMonth-=1;
          this.getselectary();
          }else{
            this.showMonth = 12;
            this.showYear-=1;
            this.getselectary();
            this.getyearary();
          };
      this.waterdate = {
        month : this.showMonth,
        year : this.showYear,
        isdate : true
      };
        this.DataAry.push(this.waterdate);
      }
      when.setTime(when.getTime()-24*60*60*1000);
    }
  }

  getselectary():void{
    this.selectedDate={
      month:this.showMonth,
      year:this.showYear,
      show:`${this.showYear}年${this.showMonth}月`
    };
    this.selectedMonthAry.push(this.selectedDate);
  }

  getyearary():void{
    this.selectedYearAry.push(this.showYear);
  }

  constructor() { }
}
