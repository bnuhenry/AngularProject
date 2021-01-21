import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from "@angular/router";
import { BillService } from '../bill/bill.service'
import { TOTALPOSTDATA,DEAL,SELECTDATE } from '../statement';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css']
})
export class TotalComponent implements OnInit {

  monthSelect:boolean = true;
  yearSelect:boolean = false;
  spendSelect:boolean = true;
  incomeSelect:boolean = false;
  otherSelect:boolean = false;
  totalType:number = 1;
  dataShowStyle:string = "top:35%;height:65%;";
  dataShowTitleStyle:string = "top:20%;";
  dataShowDetailStyle:string = "top:30%;height:70%;";
  getYearFromBill:number;
  getMonthFromBill:number;
  reloadedTimeStamp:boolean = false;
  bottomloadmsg:string = '加载中...';
  noDataShow:boolean = false;
  showTotalAmount:number;
  showTotalRecords:number;
  deal:DEAL;
  totalPostData:TOTALPOSTDATA = {
    starttime:0,
    endtime:0,
    accountid:'',
    sign:''
  };
  downLoadDataAry:Array<DEAL> = [];
  showDataAry:Array<any> = [];
  showTopYear:number;
  showTopMonth:number;
  selectedYear:number;
  yearNotSelectedYet:boolean = true;
  selectDateAry:Array<SELECTDATE> = [];
  selectedMonthAry:Array<number> = [];


  //初始化页面加载
  initdata():void{
    this.showTopYear = Number(this.atRoute.snapshot.queryParams["year"]);
    this.showTopMonth = Number(this.atRoute.snapshot.queryParams["month"]);
    this.buildDateAry();
    this.makeCheckingTimeStamp();
    this.getTotalData();
  }

  //重新加载数据到列表时需要重置的变量
  resetDataAry():void{
    this.downLoadDataAry = [];
    this.showDataAry = [];
    this.noDataShow = false;
  }

  constructor(private atRoute:ActivatedRoute,private billService:BillService,public router:Router) { }

  ngOnInit(): void {
    this.initdata();
  }

  //点击月账单按钮
  showmonthSelect():void{
    if(!this.monthSelect){
      this.monthSelect = true;
      this.yearSelect = false;
      if(this.showTopMonth>=0&&this.showTopYear>0){
        this.selectedMonthCheck((this.showTopMonth+1).toString())
      }
    }
  }

  //点击年账单按钮
  showyearSelect():void{
    if(!this.yearSelect){
      this.yearSelect = true;
      this.monthSelect = false;
      if(this.showTopYear>0){
        this.selectedYearCheck((this.showTopYear).toString())
      }
    }
  }

  //月账单日期栏选择下拉月份后生成筛选条件数据
  selectedMonthCheck(month:string):void{
    this.showTopYear = Number(this.selectedYear);
    this.showTopMonth = Number(month)-1;
    this.resetDataAry();
    //调用生成请求主体所含时间戳的函数
    this.makeCheckingTimeStamp();
    this.getTotalData();
    this.yearNotSelectedYet = true;
  }

  //年账单日期栏选择下拉年份后生成筛选条件数据
  selectedYearCheck(year:string):void{
      this.showTopYear = Number(year);
      this.selectedYear = Number(year);
    this.resetDataAry();
    //调用生成请求主体所含时间戳的函数
    this.makeCheckingTimeStamp();
    this.getTotalData();
    this.yearNotSelectedYet = false;
  }

  //日期下拉选择年份后生成月份选项
  getMonthAry(year:string):void{
    this.yearNotSelectedYet = false;
    this.selectedYear = Number(year);
    for(let i = 0;i<this.selectDateAry.length;i++){
      if(this.selectDateAry[i].year == this.selectedYear){
        this.selectedMonthAry = this.selectDateAry[i].monthAry;
        break;
      }
    }
  }

  //创建日期栏下拉框日期选项
  buildDateAry():void{
    let date = new Date();
    let startDate = new Date();
    let selectDate:SELECTDATE = {
      year:0,
      monthAry:[]
    };
    selectDate.monthAry = [];
    while(date.getFullYear()>=2014){
      if(date.getFullYear() == startDate.getFullYear()){
        selectDate.monthAry.push(date.getMonth()+1);
        if(date.getMonth()==0){
          selectDate.year = date.getFullYear();
          date.setFullYear(date.getFullYear()-1);
          this.selectDateAry.push(selectDate);
        }else{
          date.setMonth(date.getMonth()-1);
        }
      }else if(date.getFullYear() < startDate.getFullYear()){
        selectDate = {
          year:date.getFullYear(),
          monthAry:[1,2,3,4,5,6,7,8,9,10,11,12]
        };
        this.selectDateAry.push(selectDate);
        date.setFullYear(selectDate.year-1);
      }
    }
    // console.log(this.selectDateAry);
  }

  //点击支出收入及其他这三个按钮
  showTotalType(index:number):void{
    if(index!=this.totalType){
      if(index==1){
        this.spendSelect= true;
        this.incomeSelect = false;
        this.otherSelect= false;
      }else if(index==2){
        this.spendSelect= false;
        this.incomeSelect = true;
        this.otherSelect= false;
      }else if(index==3){
        this.spendSelect= false;
        this.incomeSelect = false;
        this.otherSelect= true;
      }
      this.changeDataShowStyle();
      this.makeShowDataAry();
      this.totalType = index;
    }
  }

  //点击筛选的支出收入和其他时改变下方数据排行栏的高度
  changeDataShowStyle():void{
    this.dataShowStyle = this.otherSelect?"top:20%;height:80%;":"top:35%;height:65%;";
    this.dataShowTitleStyle = this.otherSelect?"top:0;":"top:20%;";
    this.dataShowDetailStyle = this.otherSelect?"top:10%;height:90%;":"top:30%;height:70%;";
  }

  makeCheckingTimeStamp():void{
    let date = new Date();
    let year:number;
    let month:number;
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    //月账单请求主体
    if(this.monthSelect){
      if(this.selectedYear == null){
        year = Number(this.atRoute.snapshot.queryParams["year"]);
        month = Number(this.atRoute.snapshot.queryParams["month"]);
      }else{
        year = this.showTopYear;
        month = this.showTopMonth;
      }
      date.setFullYear(year);
      date.setMonth(month);
      this.totalPostData.starttime = date.getTime();
      // console.log(date);
      if(month==11){
        date.setFullYear(year+1);
        date.setMonth(0);
      }else{
        date.setMonth(month+1);
      }
      this.totalPostData.endtime = date.getTime();
      // console.log(date);
    }else{
    //年账单请求主体
      date.setMonth(0);
      date.setFullYear(this.selectedYear);
      this.totalPostData.starttime = date.getTime();
      date.setFullYear(this.selectedYear+1);
      this.totalPostData.endtime = date.getTime();
    }
    
  }

  //ajax请求加载数据并统计
  getTotalData():void{
    this.resetDataAry();
    this.reloadedTimeStamp = false;
    this.bottomloadmsg = '加载中...';
    this.billService.getTotalData(this.totalPostData).subscribe(res=>{
      if(res.length>0){
        for(let i=0;i<res.length;i++){
          this.deal = {
            cost:res[i]['cost'],
            amount:res[i]['amount'],
            dealtype:res[i]['dealtype'],
            username:res[i]['username'],
            usertype:res[i]['usertype'],
            userimg:res[i]['userimg'],
            time: res[i]['time'],
            accountid:'',
            sign:''
          }
          this.downLoadDataAry.push(this.deal);
        }
        this.makeShowDataAry();
      }
      this.noDataShow = this.downLoadDataAry.length==0?true:false;
      this.reloadedTimeStamp = true;
    });
  }

  makeShowDataAry():void{
    let typeTotalAmount:number = 0;
    let totalRecords:number = 0;
    this.showDataAry = [];
    if(this.spendSelect){
        for(let i = 0;i < this.downLoadDataAry.length; i++){
          if(this.downLoadDataAry[i].cost==1 && this.downLoadDataAry[i].dealtype!=6){
            this.handleThisData(this.downLoadDataAry[i]);
            typeTotalAmount += Number(this.downLoadDataAry[i].amount);
            totalRecords++;
          }
        }
    }else if(this.incomeSelect){
      for(let i = 0;i < this.downLoadDataAry.length; i++){
        if(this.downLoadDataAry[i].cost==0 && this.downLoadDataAry[i].dealtype!=6){
          this.handleThisData(this.downLoadDataAry[i]);
          typeTotalAmount += Number(this.downLoadDataAry[i].amount);
          totalRecords++;
        }
      }
    }else if(this.otherSelect){
      for(let i = 0;i < this.downLoadDataAry.length; i++){
        if(this.downLoadDataAry[i].dealtype==6){
          this.handleThisData(this.downLoadDataAry[i]);
        }
      }
    }

    this.showTotalAmount = typeTotalAmount;
    this.showTotalRecords = totalRecords;
    this.showDataAry = this.reorderDataAry(this.showDataAry);
    this.noDataShow = this.showDataAry.length==0?true:false;
  }

  //处理单个数据归类并统计
  handleThisData(dealData:DEAL):void{
    let index:number;
    let dealDataTotal = {
      dealImg:'',
      dealTitle:'',
      dealType:0,
      amount:0,
    };
    //判断是否为商户消费，如果是，且处于月账单选择下将会统计同一商户消费合计
    if(dealData.dealtype == 5 && this.monthSelect){
      for(let i=0;i<this.showDataAry.length;i++){
        if(this.showDataAry[i].dealType == 5 && this.showDataAry[i].dealTitle == dealData.username){
          index = i;
        }
      }
      if(index>=0){
        this.showDataAry[index].amount += Number(dealData.amount);
      }else{
        dealDataTotal = {
          dealImg:dealData.userimg,
          dealTitle:dealData.username,
          dealType:Number(dealData.dealtype),
          amount:Number(dealData.amount),
        };
        this.showDataAry.push(dealDataTotal);
      }
    //判断是否为零钱充值提现，是的话分别统计充值和提现
    }else if(dealData.dealtype == 6){
      for(let i=0;i<this.showDataAry.length;i++){
        if(this.showDataAry[i].dealTitle == '零钱提现' && dealData.cost==1 || this.showDataAry[i].dealTitle == '零钱充值' && dealData.cost==0){
          index = i;
        }
      }
      if(index>=0){
        this.showDataAry[index].amount += Number(dealData.amount);
      }else{
        if(dealData.cost==1){
          dealDataTotal = {
            dealImg:this.getDealImgName(Number(dealData.dealtype)),
            dealTitle:'零钱提现',
            dealType:6,
            amount:Number(dealData.amount),
          };
        }else if(dealData.cost==0){
          dealDataTotal = {
            dealImg:this.getDealImgName(Number(dealData.dealtype)),
            dealTitle:'零钱充值',
            dealType:6,
            amount:Number(dealData.amount),
          };
        }
        this.showDataAry.push(dealDataTotal);
      }
    }else{
      for(let i=0;i<this.showDataAry.length;i++){
        if(this.showDataAry[i].dealType == dealData.dealtype && this.monthSelect){
          index = i;
        }else if(this.yearSelect){
          let totalTitle = '';
          totalTitle = this.getDealTypeName(Number(dealData.dealtype));
          if(totalTitle == this.showDataAry[i].dealTitle){
            index = i;
          }
        }
      }
      if(index>=0){
        this.showDataAry[index].amount += Number(dealData.amount);
      }else{
        dealDataTotal = {
          dealImg:this.getDealImgName(Number(dealData.dealtype)),
          dealTitle:this.getDealTypeName(Number(dealData.dealtype)),
          dealType:Number(dealData.dealtype),
          amount:Number(dealData.amount),
        };
        this.showDataAry.push(dealDataTotal);
      }
    }
  }

  //数组按金额大小排序
  reorderDataAry(dataAry:Array<any>):Array<any>{
    dataAry.sort(function(a,b){return b.amount - a.amount});
    return dataAry;
  }

  //返回交易信息类型名称
  getDealTypeName(index:number):any{
    if(index==1){
      if(this.monthSelect){
        return '微信红包';
      }else{
        if(this.spendSelect){
          return '发红包';
        }else{
          return '收红包';
        }
      }
    }else if(index==2){
      if(this.monthSelect||this.yearSelect&&this.spendSelect){
        return '转账';
      }else{
        return '收转账';
      }
    }else if(index==3){
      if(this.monthSelect){
        if(this.spendSelect){
          return '群付款';
        }else if(this.incomeSelect){
          return '群收款';
        }
      }else{
        if(this.spendSelect){
          return '消费支出';
        }else if(this.incomeSelect){
          return '收转账';
        }
      }
    }else if(index==4){
      if(this.spendSelect){
        if(this.monthSelect){
          return '二维码付款';
        }else{
          return '消费支出';
        }
      }else if(this.incomeSelect){
        return '二维码收款';
      }
    }else if(index==5){
    //筛选已过滤月账单统计，到这里肯定是年账单统计，并入消费支出
        return '消费支出';
    }else if(index==7){
      if(this.monthSelect){
        return '信用卡还款';
      }else{
        return '消费支出';
      }
    }else if(index==8){
      return '退款';
    }else{
      return '未知交易类别';
    }
  }

  getDealImgName(index:number):string{
    if(index==1){
      if(this.monthSelect){
        return 'hongbao';
      }else{
        return 'hongbaototal';
      }
    }else if(index==2){
      if(this.monthSelect){
        return 'wechatpay';
      }else{
        return 'transfer';
      }
    }else if(index==3){
      if(this.yearSelect){
        if(this.spendSelect){
          return 'wallet';
        }else{
          return 'transfer';
        }
      }
    }else if(index==4){
      if(this.monthSelect || this.incomeSelect){
        return 'qrcode';
      }else{
        return 'wallet';
      }
    }else if(index==5){
      if(this.yearSelect){
        return 'wallet';
      }
    }else if(index==6){
      return 'money';
    }else if(index==7){
      if(this.monthSelect){
        return 'money';
      }else{
        return 'wallet';
      }
    }else if(index==8){
      return 'refund';
    }

    return 'wechatpay';
  }

  getDetailHstStyle(index:number):string{
    let color:string;
    let width:number;

    width = this.showDataAry[index].amount*100/this.showTotalAmount;
    if(width<1){
      width = 1;
    }

    if(this.showDataAry[index].dealTitle=='消费支出'){
      color = '#69A2F8';
    }else if(this.showDataAry[index].dealTitle=='转账' || this.showDataAry[index].dealTitle=='收转账'){
      color = '#F6C668' ;
    }else if(this.showDataAry[index].dealTitle=='发红包' || this.showDataAry[index].dealTitle=='收红包'){
      color = '#EE7E5F' ;
    }else if(this.showDataAry[index].dealTitle=='退款'){
      color = '#F6C543' ;
    }else if(this.showDataAry[index].dealTitle=='二维码收款'){
      color = '#D8B857' ;
    }else{
      color = '#60B077' ;
    }

    return 'width: '+ width +'%;background-color: '+ color +';';
  }

  //路由跳转到账单页面传入参数item.dealType
  // [routerLink] = "['/bill']" [queryParams]="{year:showTopYear,month:showTopMonth,yearSelect:yearSelect,dealType:item.dealType,dealTitle:item.dealTitle,spendSelect:spendSelect}"
  goToBillPage(dealType:number,dealTitle:string):void{
    this.router.navigate(['/bill'],{queryParams:{year:this.showTopYear,month:this.showTopMonth,yearSelect:this.yearSelect,dealType:dealType,dealTitle:dealTitle,spendSelect:this.spendSelect}});
  }

}
