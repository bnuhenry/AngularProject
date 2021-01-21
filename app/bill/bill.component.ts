import { Component, OnInit } from '@angular/core';
import { BillService } from './bill.service'
import { ActivatedRoute,Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DEAL,POSTDATA,SELECTDATE,DEALDATA } from '../statement';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  startY:number;
  scrollTop:number;
  clientHeight:number;
  scrollHeight:number;
  viewAtTop:boolean;
  viewAtBottom:boolean;
  bottomloadmsg:string;
  showDate = new Date();
  deal:DEAL;
  dealtypeshow:boolean = false;
  styletop:string = "top:5%";
  orginscrollTop:number = 0;
  showNewDealConfirm:boolean = false;
  showNewDealDataForm:boolean = false;
  showscreenbar:boolean = false;
  dealTypeIndex:number = 0;
  dealTypeSelectStr:string = '全部交易类型';
  latestTimeStamp:number = new Date().getTime();
  reloadedTimeStamp:boolean;
  canloadMoreDown:boolean = true;
  canloadMoreUp:boolean = true;
  showDataAry:Array<DEALDATA> = [];
  showBottomBar:boolean;
  showTopYear:number;
  showTopMonth:number;
  showtoptotal:string = '';
  loadingMsg:string = '加载中...';
  loadingMsgShow:boolean = false;
  postDataDown : POSTDATA = {
    dealtype:0,
    time:this.latestTimeStamp,
    cost:2,
    accountid:'',
    sign:''
  };
  postDataUp : POSTDATA = {
    dealtype:0,
    time:this.latestTimeStamp,
    cost:2,
    accountid:'',
    sign:''
  };
  dealData:DEALDATA = {
    month: 0,
    year: 0,
    income:0,
    spend:0,
    dealdataary:[]
  }
  screenStyle:string = "transform: translateY(100%);";
  newDealDataFormStyle:string = "transform: translateY(-100%);";
  newDealConfirmStyle:string = "transform: translateY(-100%);";
  selectDateAry:Array<SELECTDATE> = [];
  selectedYear:number;
  selectedMonthAry:Array<number> = [];
  noDataShow:boolean = false;
  yearNotSelectedYet:boolean = true;
  selectedPostDate:boolean = false;
  getYearFromTotal:number;
  getMonthFromTotal:number;
  totalYearSelect:boolean;
  totalDealTitle:string;
  totalDealType:number; //total页传参交易类别
  totalSpendSelect:boolean; //total页传参交易方向
  getDataWithTotalPost:boolean = false; //是否使用total页传参生成的筛选条件
  newFormSelectorCostDisable:boolean = false;
  newFormSelectedDate = new Date();
  newFormSelectorDealType:number;
  newFormSelectorUserAry:Array<string> = ['曹操','刘备','孙权','诸葛亮','关羽','张飞','赵云','马超','黄忠','张辽','淳于琼','典韦','夏侯惇','周瑜','黄盖','鲁肃'];
  newFormSelectorUserImgAry:Array<string> = ['person'];
  newFormSelectorUserType:number;
  newDataIsLegal:boolean = false;
  newDealDataCheckingMsg:string;
  newFormSelectorUserAryIndex:number = 0;
  canUpDateNext:boolean = true;
  
  //初始化页面加载
  initData():void{
    let yearSelect:string;
    let spentSelect:string;
    this.getYearFromTotal = Number(this.atRoute.snapshot.queryParams["year"]);
    this.getMonthFromTotal = Number(this.atRoute.snapshot.queryParams["month"]);
    yearSelect = this.atRoute.snapshot.queryParams["yearSelect"];
    if(yearSelect=="true")this.totalYearSelect = true;
    if(yearSelect=="false")this.totalYearSelect = false;
    this.totalDealTitle = this.atRoute.snapshot.queryParams["dealTitle"];
    this.totalDealType = Number(this.atRoute.snapshot.queryParams["dealType"]);
    spentSelect = this.atRoute.snapshot.queryParams["spendSelect"];
    if(spentSelect=="true")this.totalSpendSelect = true;
    if(spentSelect=="false")this.totalSpendSelect = false;
    this.resetDataAry();
    this.buildDateAry();
    if(this.getYearFromTotal>0){
      this.getRequestFromTotal();
    }else{
      this.getMoreDataDown();
    }
  }

  //重新加载数据到列表时需要重置的变量
  resetDataAry():void{
    let date = new Date();
    this.showDataAry = [];
    this.postDataDown.cost = 2;
    this.postDataUp.cost = 2;
    this.canloadMoreDown = true;
    this.canloadMoreUp = true;
    this.latestTimeStamp = date.getTime();
    if(this.showTopYear==null){
      this.showTopYear = date.getFullYear();
      this.showTopMonth = date.getMonth();
    }
    this.noDataShow = false;
    this.getDataWithTotalPost = false;
  }

  constructor(private billService:BillService,private atRoute:ActivatedRoute,public router:Router) { }

  ngOnInit(): void {
    this.initData();
  }

  newDeal:DEAL = {
    cost:1,
    amount:100,
    dealtype:2,
    username:'曹操',
    usertype:2,
    userimg:this.newFormSelectorUserImgAry[0],
    time: this.latestTimeStamp,
    accountid:'',
    sign:''
  }

  //创建填写交易记录信息的表单
  newDealDataInputForm = new FormGroup({
    cost: new FormControl(this.newDeal.cost, [
        Validators.required,
    ]),
    amount: new FormControl(this.newDeal.amount, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000)
    ]),
    dealtype: new FormControl(this.newDeal.dealtype, [
      Validators.required
    ]),
    username: new FormControl(this.newFormSelectorUserAryIndex, [
      Validators.required,
    ]),
    usertype: new FormControl(this.newDeal.usertype, [
      Validators.required
    ])
    // time: new FormControl(this.newFormSelectorDate, [
    //   Validators.required
    // ])
  });

  //新建数据表单的下拉框触发方法
  getNewDealDataFormSelect(selectorindex:number,value:string):void{
    let i:number = Number(value);
    if(selectorindex==1){
      if(i==5||i==7||i==8){
        this.newFormSelectorCostDisable = true;
        if(i==5||i==7){
          this.newDeal.cost = 1;
          if(i==5){
            this.newDealDataInputForm.patchValue({usertype:3});
            this.getDataFormSelectUserName(3);
          }else{
            this.newDealDataInputForm.patchValue({usertype:5});
            this.getDataFormSelectUserName(5);
          }
        }else{
          this.newDeal.cost = 0;
        }
      }else{
        this.newFormSelectorCostDisable = false;
        if(i==1||i==2){
          this.newDealDataInputForm.patchValue({usertype:2});
          this.getDataFormSelectUserName(2);
        }else if(i==3){
          this.newDealDataInputForm.patchValue({usertype:4});
          this.getDataFormSelectUserName(4);
        }
      }
      this.newFormSelectorDealType = i;
    }
    if(selectorindex==2){
      this.getDataFormSelectUserName(i);
    }
    if(selectorindex==3){
      this.getDataFormSelectUserName(this.newDeal.usertype);
      if(this.newFormSelectorUserType == 2||this.newFormSelectorUserType == 4){
        this.newDeal.userimg = this.newFormSelectorUserImgAry[0];
      }else{
        this.newDeal.userimg = this.newFormSelectorUserImgAry[i];
      }
      this.newDeal.username = this.newFormSelectorUserAry[i];
      // this.newDealDataInputForm.patchValue({username:this.newFormSelectorUserAry[i]});
    }
    if(selectorindex==4){
      this.newDeal.cost = i;
    }
    this.checkNewDataLegal();
  }

  //新建数据表单的下拉框触发方法
  getDataFormSelectUserName(index:number):void{
    if(index==2){
      this.newFormSelectorUserAry = ['曹操','刘备','孙权','诸葛亮','关羽','张飞','赵云','马超','黄忠','张辽','淳于琼','典韦','夏侯惇','周瑜','黄盖','鲁肃'];
      this.newFormSelectorUserType = 2;
      this.newFormSelectorUserImgAry = ['person'];
    }else if(index==3){
      this.newFormSelectorUserAry = ['美宜佳','麦当劳','肯德基','京东','顺丰','中国石化','滴滴出行','美团外卖'];
      this.newFormSelectorUserType = 3;
      this.newFormSelectorUserImgAry = ['meiyijia','maidanglao','kendeji','jingdong','sf','zhongguoshihua','didichuxing','meituan'];
    }else if(index==4){
      this.newFormSelectorUserAry = ['凯迪拉克车友会VIP群','艾泽拉斯飙车俱乐部','二B应援会','汽车维修服务群'];
      this.newFormSelectorUserType = 4;
      this.newFormSelectorUserImgAry = ['group'];
    }else if(index==5){
      this.newFormSelectorUserAry = ['工商银行','农业银行','中国银行','建设银行'];
      this.newFormSelectorUserType = 5;
      this.newFormSelectorUserImgAry = ['icbc','ABC','BOC','ccb'];
    }
    this.newDeal.usertype = this.newFormSelectorUserType;
    this.newDeal.username = this.newFormSelectorUserAry[0];
    this.newDeal.userimg = this.newFormSelectorUserImgAry[0];
    // this.newDealDataInputForm.patchValue({usertype:this.newFormSelectorUserType});
  }


  //获取交易金额输入
  newDataFormAmountInput(amount:string):void{
    this.newDeal.amount = Number(Number(amount).toFixed(2));
    this.checkNewDataLegal();
  }

  //获取时间输入
  newDataFormDateSelect(datestr:string):void{
    let date = new Date();
    date.setFullYear(Number(datestr.substr(0,4)));
    date.setMonth(Number(datestr.substr(5,2))-1);
    date.setDate(Number(datestr.substr(8,2)));
    date.setHours(Number(datestr.substr(11,2)));
    date.setMinutes(Number(datestr.substr(14,2)));
    this.newDeal.time = date.getTime();
    this.newFormSelectedDate = date;
    this.checkNewDataLegal();
  }

  //检查创建的交易信息是否合法
  checkNewDataLegal():void{
    let date = new Date();
    let dealType:number;
    let userType:number;
    let cost:number;
    this.newDealDataCheckingMsg = "";
    if(this.newDealDataInputForm.getError('required','cost')||this.newDealDataInputForm.getError('required','amount')||this.newDealDataInputForm.getError('required','dealtype')||this.newDealDataInputForm.getError('required','usertype')||this.newDealDataInputForm.getError('required','username')||this.newDealDataInputForm.getError('required','time')){
      this.newDealDataCheckingMsg = "请完整填写信息";
      this.newDataIsLegal = false;
    }else if(this.newDealDataInputForm.getError('min','amount')||this.newDealDataInputForm.getError('max','amount')){
      this.newDealDataCheckingMsg = "交易金额太少或者太多，应介于1到10000";
      this.newDataIsLegal = false;
    }
    else if(this.newDeal.time>this.latestTimeStamp){
      this.newDealDataCheckingMsg = "交易时间太超前，已经处于未来的时间";
      this.newDataIsLegal = false;
    }
    else{
      dealType = Number(this.newDealDataInputForm.value.dealtype);
      userType = Number(this.newDealDataInputForm.value.usertype);
      cost = Number(this.newDealDataInputForm.value.cost);
      if((dealType == 1||dealType ==2)&&(userType!=2)){
        this.newDealDataCheckingMsg = "发红包或者转账用户类型应该为个人";
        this.newDataIsLegal = false;
      }else if(dealType == 3&&userType!=4){
        this.newDealDataCheckingMsg = "群收款应该对应群";
        this.newDataIsLegal = false;
      }else if(dealType == 4&&(userType==4||userType==5)){
        this.newDealDataCheckingMsg = "二维码收付款只应对个人或者商户";
        this.newDataIsLegal = false;
      }else if(dealType==5&&userType!=3||dealType==5&&cost==0){
        this.newDealDataCheckingMsg = "商户消费只能是在商户那里选支出";
        this.newDataIsLegal = false;
      }else if(dealType==6&&userType!=5){
        this.newDealDataCheckingMsg = "零钱充值提现只能对应银行";
        this.newDataIsLegal = false;
      }else if(dealType==7&&userType!=5||dealType==7&&cost==0){
        this.newDealDataCheckingMsg = "信用卡还款只能还给银行并选择支出";
        this.newDataIsLegal = false;
      }else if(dealType==8&&userType!=3||dealType==8&&cost==1){
        this.newDealDataCheckingMsg = "退款一般来自商户并选择收入";
        this.newDataIsLegal = false;
      }else{
        this.newDeal.dealtype = Number(this.newDealDataInputForm.value.dealtype);
        this.newDataIsLegal = true;
      }
    }
  }

  //上传创建的新交易记录
  upDateNewDealData():void{
    if(this.canUpDateNext){
      this.canUpDateNext = false;
      this.newDealDataCheckingMsg = "正在上传";
      this.billService.upLoadDealData(this.newDeal).subscribe(res=>{
        this.newDealDataCheckingMsg = res['result'];
        this.canUpDateNext = true;
      });
    }
    this.getNewDealUpDateConfirm();
    this.newDealDataInputForm.reset();
    this.newDeal = {
      cost:1,
      amount:100,
      dealtype:2,
      username:'曹操',
      usertype:2,
      userimg:this.newFormSelectorUserImgAry[0],
      time: this.latestTimeStamp,
      accountid:'',
      sign:''
    }
    this.newDataIsLegal = false;
  }

  //通过日期找到大数组所在索引
  getDataAryIndex(month:number,year:number):any{
    let i:number;
    let result:any = null;
    for(i = 0 ; i < this.showDataAry.length; i++){
      if(month == this.showDataAry[i].month && year == this.showDataAry[i].year){
        result = i;
      }
    }
    return result;
  }
    
  //如果日期所在月份对象还未建立则马上创建
  creatNewDealData(month:number,year:number):number{
    let i : number;
    let length : number;
    let minIndex:number;
    this.dealData = {
      month: month,
      year: year,
      income:0,
      spend:0,
      dealdataary:[]
    }
    this.dealData.dealdataary = [];
    if(this.showDataAry.length==0){
      this.showDataAry.push(this.dealData);
      if(this.selectedPostDate){
        this.showTopYear = year;
        this.showTopMonth = month;
        this.selectedPostDate = false;
      }
      return 0;
    }else{
      this.showDataAry.sort(function(a,b){
        if(b.year == a.year){
          return b.month - a.month
        }else{
          return b.year - a.year
      }});
      if(month<this.showDataAry[this.showDataAry.length-1].month&&year==this.showDataAry[this.showDataAry.length-1].year || year < this.showDataAry[this.showDataAry.length-1].year){
        this.showDataAry.push(this.dealData);
        return this.showDataAry.length - 1;
      }else if(month>this.showDataAry[0].month&&year==this.showDataAry[0].year || year > this.showDataAry[0].year){
        this.showDataAry.unshift(this.dealData);
        return 0;
      }else{
        for(i=0;i<length-1;i++){
          if(year == this.showDataAry[i].year&&month<this.showDataAry[i].month || year<this.showDataAry[i].year){
            minIndex = i;
          }
        }
        this.showDataAry.splice(minIndex,0,this.dealData);
        return minIndex;
      }
    }
  }
  
  //数据大数组及每个元素对象的数组排序
  reorderShowDataAry():void{
    this.showDataAry.sort(function(a,b){
      if(b.year == a.year){
        return b.month - a.month
      }else{
        return b.year - a.year
    }});
    for(let i = 0;i<this.showDataAry.length;i++){
      this.showDataAry[i].dealdataary.sort(function(a,b){return b.time - a.time});
    }
  }

  //弹出新增交易记录选项
  getNewDealDataForm():void{
    if(this.showscreenbar){
      this.showscreen();
    }
    this.showNewDealDataForm = this.showNewDealDataForm?false:true;
    this.newDealDataFormStyle = this.showNewDealDataForm?"transform: translateY(0);":"transform: translateY(-100%);";
  }

  //弹出上传交易记录确认框
  getNewDealUpDateConfirm():void{
    this.getNewDealDataForm();
    this.showNewDealConfirm = this.showNewDealConfirm?false:true;
    this.newDealConfirmStyle = this.showNewDealConfirm?"transform: translateY(0);":"transform: translateY(-100%);";
  }
  
  //弹出交易类型筛选器
  showscreen():void{
    if(this.showNewDealDataForm){
      this.getNewDealDataForm();
    }
    this.showscreenbar = this.showscreenbar?false:true;
    this.screenStyle = this.showscreenbar?"transform: translateY(0);":"transform: translateY(100%);";
  }

  //选择交易类型接受传参
  dealTypeSelect(index:number):void{
    if(this.dealTypeIndex!=index){
      this.resetDataAry();
      this.postDataDown.dealtype = index;
      this.postDataDown.time = this.latestTimeStamp;
      this.postDataUp.dealtype = index;
      this.postDataUp.time = this.latestTimeStamp;
      this.getMoreDataDown();
      this.dealTypeIndex = index;
      this.getDataWithTotalPost = false;
      this.getDealTypeSelectName();
    }
    this.showscreen();
  }

  getDealTypeSelectName():void{
    if(this.dealTypeIndex==0){
      this.dealTypeSelectStr = '全部交易类型';
    }else if(this.dealTypeIndex==1){
      this.dealTypeSelectStr = '红包';
    }else if(this.dealTypeIndex==2){
      this.dealTypeSelectStr = '转账';
    }else if(this.dealTypeIndex==3){
      this.dealTypeSelectStr = '群收款';
    }else if(this.dealTypeIndex==4){
      this.dealTypeSelectStr = '二维码收付款';
    }else if(this.dealTypeIndex==5){
      this.dealTypeSelectStr = '商户消费';
    }else if(this.dealTypeIndex==6){
      this.dealTypeSelectStr = '充值提现';
    }else if(this.dealTypeIndex==7){
      this.dealTypeSelectStr = '信用卡还款';
    }else if(this.dealTypeIndex==8){
      this.dealTypeSelectStr = '有退款';
    }else if(this.dealTypeIndex==9){
      this.dealTypeSelectStr = '消费支出';
    }
  }

  //利用统计页面传递参数生成筛选条件
  makeScreenCondition():void{
    // <————————————————————————逻辑层————————————————————————>
    // 统计页面发送查询请求
    // 月账单请求
    // 交易方向? 通过spendSelect传入
    // 其余传入type就够
    
    // 年账单请求
    // 交易方向?
    // 支出方面 通过spendSelect=true传入
    // 消费支出 dealtype包括  3,4,5,7
    // 转账 dealtype包括 2
    // 发红包 dealtype包括 1
  
    // 收入方面 通过spendSelect=false传入
    // 收转账 dealtype包括 2
    // 收红包 dealtype包括 1
    // 退款 dealtype包括 8
    // 二维码收款 dealtype包括 4
    // 最特殊的情况是dealtype 6 零钱充值，配合文字叙述生成筛查条件
    // <————————————————————————数据层————————————————————————>
    // this.getYearFromTotal total页年
    // this.getMonthFromTotal total页月
    // this.totalYearSelect total页是否年账单 年=true 月=false
    // this.totalDealType total页交易类型1红包，2转账，3群收款，4二维码收付款，5商户消费，6充值提现，7信用卡还款，8有退款，9消费支出包括前面3457
    // this.totalSpendSelect total页交易方向 支出=true 收入=false
    // this.totalDealTitle total页交易文字抬头
    // 传入ajax请求主体包括this.postDataDown.dealtype this.postDataDown.cost
    // 先判断是不是零钱请求
    let postType:number;
    let postCost:number;
    if(this.totalDealType == 6){
      postType = 6;
      if(this.totalDealTitle=="零钱提现"){
        postCost = 1;
      }else if(this.totalDealTitle=="零钱充值"){
        postCost = 0;
      }
    }else{
      if(!this.totalYearSelect){
        postType = this.totalDealType;
        if(this.totalSpendSelect){
          postCost = 1;
        }else if(!this.totalSpendSelect){
          postCost = 0;
        }else{
          postCost = 2; //查不到参数就收入支出全查
        }
      }else{
      //年账单筛选条件
        if(this.totalSpendSelect){
          postCost = 1;
          if(this.totalDealTitle == "消费支出"){
            postType = 9;
          }else{
            postType = this.totalDealType;
          }
        }else{
          postCost = 0;
          postType = this.totalDealType;
        }
      }
    }
    this.postDataDown.dealtype = postType;
    this.dealTypeIndex = postType;
    this.postDataDown.cost = postCost;
    this.postDataUp.dealtype = postType;
    this.postDataUp.cost = postCost;
    this.getDealTypeSelectName();
    // console.log("交易类型为："+ this.postDataDown.dealtype + "交易方向为：" + this.postDataDown.cost);
  }

  //日期栏选择下拉日期后生成筛选条件数据
  selectedDate(month:string):void{
    let date = new Date();
    let thismonth:number = Number(month);
    this.showTopYear = Number(this.selectedYear);
    this.showTopMonth = thismonth-1;
    this.resetDataAry();
    //设置选择到的时间节点为下个月月初一号零时零分零秒
    if(month == "12"){
      date.setFullYear(this.selectedYear+1);
      date.setMonth(0);
    }else{
      date.setFullYear(this.selectedYear);
      date.setMonth(thismonth);
    }
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    this.postDataDown.time = date.getTime();
    this.postDataUp.time = date.getTime();
    this.selectedPostDate = true;
    this.getMoreDataDown();
    this.yearNotSelectedYet = true;
    // this.getDataWithTotalPost = false;
  }

  //日期下拉选择年份后生成月份选项
  getMonthAry(year:string):void{
    this.selectedYear = Number(year);
    for(let i = 0;i<this.selectDateAry.length;i++){
      if(this.selectDateAry[i].year == this.selectedYear){
        this.selectedMonthAry = this.selectDateAry[i].monthAry;
        break;
      }
    }
    this.yearNotSelectedYet = false;
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
  }

  //ajax请求向下加载数据
  getMoreDataDown():void{
    let date = new Date();
    let time:number = date.getTime();
    let month : number;
    let year : number;
    let dealDataIndex : any;
    if(this.getDataWithTotalPost){
      this.makeScreenCondition();
    }
    this.reloadedTimeStamp = false;
    this.bottomloadmsg = '加载中...';
    if(this.canloadMoreDown){
      this.loadingMsgShow = true;
      this.billService.getDataAryDown(this.postDataDown).subscribe(res=>{
        if(res.length>0){
          for(let i=0;i<res.length;i++){
            date.setTime(res[i].time);
            month = date.getMonth();
            year = date.getFullYear();
            dealDataIndex = this.getDataAryIndex(month,year);
            if(dealDataIndex==null){
              dealDataIndex=this.creatNewDealData(month,year);
            }
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
            this.showDataAry[dealDataIndex].dealdataary.push(this.deal);
            if(this.deal.cost==1){
              this.showDataAry[dealDataIndex].spend += Number(this.deal.amount);
            }else{
              this.showDataAry[dealDataIndex].income += Number(this.deal.amount);
            }
            time = res[i].time < time?res[i].time:time;
          }
          this.postDataDown.time = time;
        }else{
          this.canloadMoreDown = false;
        }
        this.loadingMsgShow = false;
        this.noDataShow = this.showDataAry.length==0?true:false;
        this.reloadedTimeStamp = true;
      });
    }
    this.reorderShowDataAry();
  }

  //ajax请求向上加载数据
  getMoreDataUp():void{
    let time:number = 0;
    let date = new Date();
    let month : number;
    let year : number;
    let dealDataIndex : any;
    if(this.getDataWithTotalPost){
      this.makeScreenCondition();
    }
    this.reloadedTimeStamp = false;
    this.bottomloadmsg = '加载中...';
    if(this.canloadMoreUp){
      this.loadingMsgShow = true;
      this.billService.getDataAryUp(this.postDataUp).subscribe(res=>{
        if(res.length>0){
          for(let i=0;i<res.length;i++){
            date.setTime(res[i].time);
            month = date.getMonth();
            year = date.getFullYear();
            dealDataIndex = this.getDataAryIndex(month,year);
            if(dealDataIndex==null){
              dealDataIndex=this.creatNewDealData(month,year);
            }
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
            this.showDataAry[dealDataIndex].dealdataary.unshift(this.deal);
            if(this.deal.cost==1){
              this.showDataAry[dealDataIndex].spend += Number(this.deal.amount);
            }else{
              this.showDataAry[dealDataIndex].income += Number(this.deal.amount);
            }
            time = res[i].time>time?res[i].time:time;
          }
          this.postDataUp.time = time;
        }else{
          this.canloadMoreUp = false;
        }
        this.loadingMsgShow = false;
        this.noDataShow = this.showDataAry.length==0?true:false;
        this.reloadedTimeStamp = true;
      });
    }
    this.reorderShowDataAry();
  }

  //检测到有其他组件传参则调用该函数
  getRequestFromTotal():void{
    let date = new Date();
    let year:number;
    let month:number;
    year = this.getYearFromTotal;
    month = this.getMonthFromTotal;
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    if(month==11 || this.totalYearSelect){
      date.setFullYear(year+1);
      date.setMonth(0);
      this.showTopMonth = 11;
    }else{
      date.setFullYear(year);
      date.setMonth(month+1);
      this.showTopMonth = month;
    }
    this.showTopYear = year;
    this.postDataDown.time = date.getTime();
    this.postDataUp.time = date.getTime();
    this.getDataWithTotalPost = true;
    this.getMoreDataDown();
  }

  //接受appDateToTop指令传入的参数
  getthatdate(e){
    this.showtoptotal = e[1];
    if(e[0].search('月')==6){
      this.showTopMonth = Number(e[0].substr(5,1))-1;
    }else if(e[0].search('月')==7){
      this.showTopMonth = Number(e[0].substr(5,2))-1;
    }
    this.showTopYear = Number(e[0].substr(0,4));
  }

  public touchstartevent($event){
    this.startY = $event.changedTouches["0"].clientY;
  }

  touchmoveevent($event){
    this.bottomloadmsg = '松手后加载';
  }

  touchendevent($event){
    let endY:number;
    let swipedUp:number;
    let swipedDown:number;
    this.clientHeight = $event.view.innerHeight;
    endY = $event.changedTouches["0"].clientY;
    swipedUp = this.startY - endY;
    swipedDown = endY - this.startY;
    if(!this.canloadMoreDown){
      this.bottomloadmsg = '没有更多交易记录可加载';
    }
    if(swipedUp>20&&this.canloadMoreDown){
      if(this.viewAtBottom){
        this.bottomloadmsg = '加载中...';
        if(this.reloadedTimeStamp){
          // this.getMoreDataDown();
        }
      }
    }
    if(swipedDown>20){
      if(this.viewAtTop){
        if(!this.canloadMoreUp){
          this.bottomloadmsg = '没有更多交易记录可加载';
        }else{
          if(this.reloadedTimeStamp){
            this.bottomloadmsg = '加载中...';
            this.getMoreDataUp();
          }
        }
      }
    }
    // if(swipedDown>0){
    //   console.log('向下滑动距离为'+swipedDown);
    // }else if(swipedUp>0){
    //   console.log('向上滑动距离为'+swipedUp);
    // }else{
    //   console.log('没有滑动');
    // }
  }

  public scrolling($event){
    this.scrollTop = $event.target.scrollTop;
    this.clientHeight = $event.target.offsetHeight;
    this.scrollHeight = $event.target.scrollHeight;
    this.viewAtTop = this.scrollTop<10?true : false;
    this.viewAtBottom = this.scrollTop+this.clientHeight+10>this.scrollHeight?true : false;
    if(!this.canloadMoreDown){
      this.bottomloadmsg = '没有更多交易记录可加载';
    }
    if(this.scrollTop+this.clientHeight+1000>this.scrollHeight){
      if(this.reloadedTimeStamp&&this.canloadMoreDown){
        this.getMoreDataDown();
      }
    }
    // 判断上划还是下划
    if(this.scrollTop>this.orginscrollTop){
      this.dealtypeshow = false;
      this.styletop = "top:5%";
      this.orginscrollTop = this.scrollTop-10;
    }else if(this.scrollTop<this.orginscrollTop){
      this.dealtypeshow = true;
      this.styletop = "top:15%";
      this.orginscrollTop = this.scrollTop+10;
    }
    this.showBottomBar = (this.scrollTop+this.clientHeight==this.scrollHeight&&!this.canloadMoreDown)?true:false;
  }

  //路由跳转方法
  // [routerLink] = "['/total']" [queryParams]="{year:showTopYear,month:showTopMonth}"
  goToTotalPage(year:number,month:number):void{
    this.router.navigate(['/total'],{queryParams:{year:year,month:month}});
  }

  goToBillDetail(index:number,index2:number){
    this.router.navigate(['/billdetail'],{queryParams:{
      cost:this.showDataAry[index].dealdataary[index2].cost,
      amount:this.showDataAry[index].dealdataary[index2].amount,
      dealtype:this.showDataAry[index].dealdataary[index2].dealtype,
      username:this.showDataAry[index].dealdataary[index2].username,
      usertype:this.showDataAry[index].dealdataary[index2].usertype,
      userimg:this.showDataAry[index].dealdataary[index2].userimg,
      time:this.showDataAry[index].dealdataary[index2].time,
    }});
  }

  backToLastPage():void{
    history.go(-1);
  }

}
