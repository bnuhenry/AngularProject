import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BillService } from '../bill/bill.service'
import { DEAL } from '../statement';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})
export class BillDetailComponent implements OnInit {
  cost:number;
  amount:number;
  dealtype:number;
  username:string;
  usertype:number;
  userimg:string;
  time:number;
  newFormSelectorCostDisable:boolean = false;
  newFormSelectorUserAry:Array<string> = ['曹操','刘备','孙权','诸葛亮','关羽','张飞','赵云','马超','黄忠','张辽','淳于琼','典韦','夏侯惇','周瑜','黄盖','鲁肃'];
  newFormSelectorUserImgAry:Array<string> = ['person'];
  latestTimeStamp:number = new Date().getTime();
  showNewDealConfirm:boolean = false;
  newFormSelectorDealType:number;
  newFormSelectorUserType:number;
  newFormSelectedDate = new Date();
  oldDealDate = new Date();
  newFormSelectedDateStr:string;
  newDealDataCheckingMsg:string;
  newDataIsLegal:boolean = false;
  canUpDateNext:boolean = true;
  newDealDataFormStyle:string = "transform: translateY(-100%);";
  newDealConfirmStyle:string = "transform: translateY(-100%);";
  showNewDealDataForm:boolean = false;
  userTypeAryIndex:number = 0;
  editDisable:boolean = true;
  editCostDisable:boolean = false;
  deleteDealConfirm:boolean = false;
  deleteIsDone:boolean = false;
  editIsDone:boolean = false;
  postDealAry:Array<DEAL> = [];

  //初始化页面加载
  initData():void{
    this.cost = Number(this.atRoute.snapshot.queryParams["cost"]);
    this.amount = Number(this.atRoute.snapshot.queryParams["amount"]);
    this.dealtype = Number(this.atRoute.snapshot.queryParams["dealtype"]);
    this.username = this.atRoute.snapshot.queryParams["username"];
    this.usertype = Number(this.atRoute.snapshot.queryParams["usertype"]);
    this.userimg = this.atRoute.snapshot.queryParams["userimg"];
    this.time = Number(this.atRoute.snapshot.queryParams["time"]);
    this.oldDealDate.setTime(this.time);
    this.getUserName(this.usertype,this.username);
    this.newDeal = {
      cost:this.cost,
      amount:this.amount,
      dealtype:this.dealtype,
      username:this.username,
      usertype:this.usertype,
      userimg:this.userimg,
      time: this.time,
      accountid:'',
      sign:''
    };
    this.oldDeal = {
      cost:this.cost,
      amount:this.amount,
      dealtype:this.dealtype,
      username:this.username,
      usertype:this.usertype,
      userimg:this.userimg,
      time: this.time,
      accountid:'',
      sign:''
    };
    if(this.dealtype==5||this.dealtype==7||this.dealtype==8){
      this.editCostDisable = true;
    }
    if(this.editDisable){
      this.newFormSelectorUserAry = [this.newDeal.username];
      this.newFormSelectorUserType = this.newDeal.usertype; 
      this.newFormSelectorUserImgAry = [this.userimg];
    }
    this.newDealDataInputForm.patchValue({cost:this.cost});
    this.newDealDataInputForm.patchValue({amount:this.amount});
    this.newDealDataInputForm.patchValue({dealtype:this.dealtype});
    this.newDealDataInputForm.patchValue({usertype:this.usertype});
    this.getOldDealDate();
    this.postDealAry.push(this.oldDeal);
    // console.log(this.billService.getSign(this.time));
  }

  //重新加载数据到列表时需要重置的变量
  resetDataAry():void{
    this.postDealAry = [];
    this.postDealAry.push(this.oldDeal);
  }

  constructor(private atRoute:ActivatedRoute,private billService:BillService) { }

  ngOnInit(): void {
    this.initData();
  }

  newDeal:DEAL = {
    cost:0,
    amount:0,
    dealtype:1,
    username:'曹操',
    usertype:2,
    userimg:'person',
    time: this.latestTimeStamp,
    accountid:'',
    sign:''
  };
  oldDeal:DEAL = {
    cost:0,
    amount:0,
    dealtype:1,
    username:'',
    usertype:2,
    userimg:'person',
    time: this.latestTimeStamp,
    accountid:'',
    sign:''
  };
  //创建填写交易记录信息的表单
  newDealDataInputForm = new FormGroup({
    cost: new FormControl({value:this.newDeal.cost, disabled:this.editCostDisable},[
        Validators.required,
    ]),
    amount: new FormControl(this.newDeal.amount, [
        Validators.required,
        Validators.min(1),
        Validators.max(10000)
    ]),
    dealtype: new FormControl({value:this.newDeal.dealtype, disabled:this.editDisable}, [
      Validators.required
    ]),
    username: new FormControl({value:this.userTypeAryIndex, disabled:this.editDisable}, [
      Validators.required,
    ]),
    usertype: new FormControl({value:this.newDeal.usertype, disabled:this.editDisable}, [
      Validators.required
    ])
  });

  //修改数据表单的下拉框触发方法
  editDealDataFormSelect(selectorindex:number,value:string):void{
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

  getUserName(userType:number,userName:string):void{
    this.getDataFormSelectUserName(userType);
    for(let i = 0;i<this.newFormSelectorUserAry.length;i++){
      if(userName == this.newFormSelectorUserAry[i]){
        this.userTypeAryIndex = i;
      }
    }
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
    if(this.editDisable){
      dealType = this.newDeal.dealtype;
      userType = this.newDeal.usertype;
    }else{
      dealType = Number(this.newDealDataInputForm.value.dealtype);
      userType = Number(this.newDealDataInputForm.value.usertype);
    }
    if(this.editCostDisable){
      cost = this.newDeal.cost;
    }else{
      cost = Number(this.newDealDataInputForm.value.cost);
    }
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
      cost = Number(this.newDealDataInputForm.value.cost);
      if((dealType == 1||dealType ==2)&&(!(userType==2||userType==1))){
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
        if(!this.editDisable){
          this.newDeal.dealtype = Number(this.newDealDataInputForm.value.dealtype);
        }
        if(this.newDeal.time==this.time&&this.newDeal.cost==this.cost&&this.newDeal.amount==this.amount){
          this.newDealDataCheckingMsg = "没有修改过任何数据";
          this.newDataIsLegal = false;
        }else{
          this.newDataIsLegal = true;
        }
      }
    }
  }

  //ajax请求上传修改过的交易记录
  editDealData():void{
    if(this.canUpDateNext){
      this.canUpDateNext = false;
      this.newDealDataCheckingMsg = "正在上传";
      this.postDealAry.push(this.newDeal);
      this.billService.updateDealData(this.postDealAry).subscribe(res=>{
        this.newDealDataCheckingMsg = res['result'];
        if(res['success']=='true'){
          this.editIsDone = true;
          console.log(res['sign']);
          this.newDealDataInputForm.reset();
        }
        this.canUpDateNext = true;
      });
    }
    this.getEditConfirm();
    this.newDataIsLegal = false;
  }

  //ajax请求删除选中的交易记录
  deleteDealData():void{
    if(this.deleteDealConfirm&&this.canUpDateNext){
      this.canUpDateNext = false;
      this.newDealDataCheckingMsg = "正在删除";
      this.billService.deleteDealData(this.oldDeal).subscribe(res=>{
        this.newDealDataCheckingMsg = res['result'];
        if(res['success']=='true'){
          this.newDealDataInputForm.reset();
          this.deleteIsDone = true;
          // this.backToLastPage();
        }else{
          this.getEditConfirm();
          this.newDealDataCheckingMsg = "删除失败";
        }
        this.canUpDateNext = true;
      });
    }
  }

  //获取已存在的交易记录的交易时间并显示在日期选择框
  getOldDealDate():void{
    let date = new Date();
    let year:string;
    let month:string;
    let day:string;
    let hour:string;
    let minute:string;
    let seconds:string;
    date.setTime(this.newDeal.time);
    this.newFormSelectedDate = date;
    year = date.getFullYear().toString();
    if(date.getMonth()<9){
      month = '0'+ (date.getMonth()+1).toString();
    }else{
      month = (date.getMonth()+1).toString();
    }
    if(date.getDate()<=9){
      day = '0' + date.getDate().toString();
    }else{
      day = date.getDate().toString();
    }
    if(date.getHours()<=9){
      hour = '0' + date.getHours().toString();
    }else{
      hour = date.getHours().toString();
    }
    if(date.getMinutes()<=9){
      minute = '0' + date.getMinutes().toString();
    }else{
      minute = date.getMinutes().toString();
    }
    if(date.getSeconds()<=9){
      seconds = '0' + date.getSeconds().toString();
    }else{
      seconds = date.getSeconds().toString();
    }
    // this.newDealDataInputForm.setValue({cost:this.cost,amount:this.amount,dealtype:this.dealtype,username:this.userTypeAryIndex,usertype:this.usertype});
    this.newFormSelectedDateStr = year+'-'+month+'-'+day+'T'+hour+':'+minute+':'+seconds;
  }

  //弹出修改交易记录选项
  editDealDataForm():void{
    this.showNewDealDataForm = this.showNewDealDataForm?false:true;
    this.newDealDataFormStyle = this.showNewDealDataForm?"transform: translateY(0);":"transform: translateY(-100%);";
  }

  //弹出上传交易记录确认框
  getEditConfirm():void{
    this.deleteDealConfirm = false;
    if(this.newDataIsLegal){
      this.editDealDataForm();
      this.showNewDealConfirm = this.showNewDealConfirm?false:true;
      this.newDealConfirmStyle = this.showNewDealConfirm?"transform: translateY(0);":"transform: translateY(-100%);";
    }else{
      this.checkNewDataLegal();
    }
  }

  //弹出删除交易记录确认框
  getDeleteConfirm():void{
    this.deleteDealConfirm = true;
    this.editDealDataForm();
    this.showNewDealConfirm = this.showNewDealConfirm?false:true;
    this.newDealConfirmStyle = this.showNewDealConfirm?"transform: translateY(0);":"transform: translateY(-100%);";
  }

  //确认框取消按钮
  confirmFormCancel():void{
    this.editDealDataForm();
    this.showNewDealConfirm = this.showNewDealConfirm?false:true;
    this.newDealConfirmStyle = this.showNewDealConfirm?"transform: translateY(0);":"transform: translateY(-100%);";
  }

  

  backToLastPage():void{
    history.go(-1);
  }

}
