import { Component, OnInit } from '@angular/core';
import { AiService } from './ai.service'
import { WATER,WATERDATE,SELECTDATE } from '../water'

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AIComponent implements OnInit {
  clientHeight:number;
  startY:number;
  endY:number;
  swipedUp:number;
  swipedDown:number;
  scrollTop:number;
  scrollHeight:number;
  toploadmsg:string = '下拉加载';
  bottomloadmsg:string = '上拉加载';
  touchMove:any;
  viewAtTop:boolean;
  viewAtBottom:boolean;
  dataIndex:number;
  waterdate:WATERDATE;
  waterDate = new Date();
  showDataAry:Array<any> = [];
  selectedmonth:Array<SELECTDATE>;
  selectedyear:Array<number>;
  showStartMonth:number = new Date().getMonth()+1;
  showStartYear:number = new Date().getFullYear();
  showMonth:number;
  showYear:number = this.showStartYear;
  monthcheck:boolean = false;
  yearcheck:boolean = false;
  monthselect:boolean = true;
  yearselect:boolean = false;
  purewaterselect:boolean = true;
  tapwaterselect:boolean = false;
  recordIndex:number = 0;
  purewater:number = 0;
  tapwater:number = 0;
  pureAry:Array<number> = [];
  pureDateAry:Array<number> = [];
  hstwidth:number;
  hstheightest:number;
  showAryIndex:number;
  findoutstick:number;
  showhowmanymonth:number = 0;
  showhowmanyyear:number = 0;
  checkingyear:number = 0;
  showtopdate:string;
  totalbartranslate:string;
  totalbarrotatespeed:string;
  datashowbottombarstyle:string;

  //未选择特定时间下刷新列表显示
  showdata(){
    this.recordIndex = 0;
    this.purewater = 0;
    this.tapwater = 0;
    for(this.dataIndex=0;this.dataIndex<=30;this.dataIndex++){
      this.showDataAry.push(this.ai.DataAry[this.dataIndex]);
      if(this.ai.DataAry[this.dataIndex].isdate==false){
        this.recordIndex += 1;
        this.purewater += this.ai.DataAry[this.dataIndex].pure;
        this.tapwater += this.ai.DataAry[this.dataIndex].tap;
        this.purewater = Number(this.purewater.toFixed(2));
        this.tapwater = Number(this.tapwater.toFixed(2));
      }else if(this.ai.DataAry[this.dataIndex].isdate==true){
        this.showhowmanymonth += 1;
      }
      if(!this.showtopdate && this.ai.DataAry[this.dataIndex].isdate==true){
        if(this.showStartYear == this.ai.DataAry[this.dataIndex].year){
          this.showtopdate = this.ai.DataAry[this.dataIndex].month.toString() + "月";
        }else{
          this.showtopdate = this.ai.DataAry[this.dataIndex].month.toString() + "月" + this.ai.DataAry[this.dataIndex].year.toString() + "年";
        }
      }
    }
  }

  //未选择特定时间下加载列表
  loadmore():void{
    this.bottomloadmsg = '加载中...';
    if(this.dataIndex<this.ai.DataAry.length){
      for(let x=0;x<30&&this.dataIndex<this.ai.DataAry.length;x++){
        if(this.ai.DataAry[this.dataIndex].isdate==false){
          this.recordIndex += 1;
          this.purewater += this.ai.DataAry[this.dataIndex].pure;
          this.tapwater += this.ai.DataAry[this.dataIndex].tap;
          this.purewater = Number(this.purewater.toFixed(2));
          this.tapwater = Number(this.tapwater.toFixed(2));
        }else if(this.ai.DataAry[this.dataIndex].isdate==true){
          this.showhowmanymonth += 1;
        }
        this.showDataAry.push(this.ai.DataAry[this.dataIndex]);
        this.dataIndex+=1;
        this.showwaterhistogram();
      }
      this.bottomloadmsg = '加载完成，可继续下拉加载';
      console.log('加载完成');
    }else{
      this.bottomloadmsg = '没有更多内容可加载';
      console.log('没有更多内容可加载');
    }
  }

  //选择特定月份刷新列表
  showmonthdata(index){
    let year = this.selectedmonth[index].year;
    let month = this.selectedmonth[index].month;
    this.showhowmanymonth = 1;
    this.showhowmanyyear = 1;
    this.monthcheck = true;
    this.yearcheck = false;
    let date:Date = new Date();
    let newdate:Date = new Date();
    this.showDataAry = [];
    this.recordIndex = 0;
    this.purewater = 0;
    this.tapwater = 0;
    this.showStartMonth = month;
    this.showtopdate = month.toString() + "月";
    this.waterdate = {
      month : month,
      year : year,
      isdate : true
    };
    this.showDataAry.push(this.waterdate);
    month-=1;
    for(let i=0;i<this.ai.DataAry.length;i++){
      if(this.ai.DataAry[i].isdate==false){
        date.setTime(this.ai.DataAry[i].time);
        if(date.getMonth()==month&&date.getFullYear()==year){
          this.recordIndex += 1;
          this.purewater += this.ai.DataAry[i].pure;
          this.tapwater += this.ai.DataAry[i].tap;
          this.showDataAry.push(this.ai.DataAry[i]);
          this.purewater = Number(this.purewater.toFixed(2));
          this.tapwater = Number(this.tapwater.toFixed(2));
        }else if(date.getMonth()<month&&date.getFullYear()==year||date.getFullYear()<year)break;
      }
    }
    this.showwaterhistogram();
    if(newdate.getFullYear()==year&&this.showDataAry[0].isdate==true){
      this.showtopdate = this.showDataAry[0].month.toString() + "月";
    }else{
      this.showtopdate = this.showDataAry[0].month.toString() + "月 " + this.showDataAry[0].year.toString() + "年";
    }
  }

    //选择特定年份刷新列表
    showyeardata(index){
      this.checkingyear = this.selectedyear[index];
      this.yearcheck = true;
      this.monthcheck = false;
      this.showhowmanymonth = 0;
      this.showhowmanyyear = 1;
      let date:Date = new Date();
      let newdate:Date = new Date();
      this.showDataAry = [];
      this.recordIndex = 0;
      this.purewater = 0;
      this.tapwater = 0;
      for(let i=0;i<this.ai.DataAry.length;i++){
        if(this.ai.DataAry[i].isdate==false){
          date.setTime(this.ai.DataAry[i].time);
          if(date.getFullYear()==this.checkingyear){
            this.recordIndex += 1;
            this.purewater += this.ai.DataAry[i].pure;
            this.tapwater += this.ai.DataAry[i].tap;
            this.showDataAry.push(this.ai.DataAry[i]);
            this.purewater = Number(this.purewater.toFixed(2));
            this.tapwater = Number(this.tapwater.toFixed(2));
          }else if(date.getFullYear()<this.checkingyear)break;
        }else if(this.ai.DataAry[i].isdate==true&&this.ai.DataAry[i].year==this.checkingyear){
            this.showDataAry.push(this.ai.DataAry[i]);
            this.showhowmanymonth += 1;
        }
      }
      this.showwaterhistogram();
      this.showtopdate = this.showDataAry[0].year.toString() + "年";
    }

  //点击月数据按钮
  showmonthselect():void{
    this.monthselect = true;
    this.yearselect = false;
  }

  //点击年数据按钮
  showyearselect():void{
    this.yearselect = true;
    this.monthselect = false;
  }

  //点击纯水产出按钮
  showpurehistogram():void{
    this.purewaterselect = true;
    this.tapwaterselect = false;
    this.showwaterhistogram();
  }

  //点击消耗自来水按钮
  showtaphistogram():void{
    this.tapwaterselect = true;
    this.purewaterselect = false;
    this.showwaterhistogram();
  }

  //点纯水和自来水按钮后统计和生成柱状图数据
  showwaterhistogram():void{
    let maxnumber:number = 0;
    let date:Date = new Date();
    let year:number;
    if(this.yearselect == true&&(this.checkingyear)){
      year = this.checkingyear;
    }else year = date.getFullYear();
    let month:number;
    let monthtotal:number = 0;//月数据总和
    let yeartotal:number = 0;//年数据总和
    this.showhowmanyyear = 1;
    if(this.showhowmanymonth<=1 && this.showhowmanyyear<=1){
      this.pureAry = [];
      this.pureDateAry = [];
      maxnumber = 0;
      for(let i=0;i<this.showDataAry.length;i++){
        if(this.showDataAry[i].isdate==false){
          if(this.purewaterselect == true){
            this.pureAry.push(this.showDataAry[i].pure);
            if(maxnumber<this.showDataAry[i].pure){
              maxnumber = this.showDataAry[i].pure;
            }
          }else{
            this.pureAry.push(this.showDataAry[i].tap);
            if(maxnumber<this.showDataAry[i].tap){
              maxnumber = this.showDataAry[i].tap;
            }
          }
          date.setTime(this.showDataAry[i].time);
          this.pureDateAry.push(date.getDate());
        }
      }
    }
    else{
      this.pureAry = [];
      this.pureDateAry = [];
      maxnumber = 0;
      month = 11;//从12月向前查询
      for(let i=0;i<this.showDataAry.length;i++){
        if(this.showDataAry[i].isdate==false){
          date.setTime(this.showDataAry[i].time);
          if(year == date.getFullYear()){
            if(this.showhowmanyyear<=1){
              if((month == date.getMonth())&&month>=0){
                if(this.purewaterselect == true){
                  monthtotal += this.showDataAry[i].pure;
                }else{
                  monthtotal += this.showDataAry[i].tap;
                }
                if(((this.pureDateAry.length>0)&&(month+1!=this.pureDateAry[this.pureDateAry.length-1]))||this.pureDateAry.length==0){
                  this.pureDateAry.push(month+1);
                }
              }else{
                this.pureAry.push(monthtotal);
                yeartotal += monthtotal;
                if(maxnumber < monthtotal){
                  maxnumber = monthtotal;//找出最大的月份数据
                }
                month -= 1;
                if(((this.pureDateAry.length>0)&&(month+1!=this.pureDateAry[this.pureDateAry.length-1]))||this.pureDateAry.length==0){
                  this.pureDateAry.push(month+1);
                }
                if(this.purewaterselect == true){
                  monthtotal = this.showDataAry[i].pure;//月份总和数据推进数组后清零，开始新的月份统计
                }else{
                  monthtotal = this.showDataAry[i].tap;//月份总和数据推进数组后清零，开始新的月份统计
                }
              }
            }else{
              if(this.purewaterselect == true){
                yeartotal += this.showDataAry[i].pure;
              }else{
                yeartotal += this.showDataAry[i].tap;
              }
            }
          }else{
            if(this.showhowmanyyear == 1){
              this.pureAry = [];
              this.pureDateAry = [];
              maxnumber = 0;
              yeartotal += monthtotal;
            }
            this.pureAry.push(yeartotal);
            this.pureDateAry.push(year);
            year -= 1;
            if(maxnumber < yeartotal){
              maxnumber = yeartotal;//找出最大的年份数据
            }
            if(this.purewaterselect == true){
              yeartotal = this.showDataAry[i].pure;
            }else{
              yeartotal = this.showDataAry[i].tap;
            }
            //年份总和数据推进数组后清零，开始新的年份统计
            this.showhowmanyyear += 1;
          }
        }
      }
      if(monthtotal>0&&this.showhowmanyyear<=1){
        this.pureAry.push(monthtotal);
        if(maxnumber < monthtotal){
          maxnumber = monthtotal;//找出最大的月份数据
        }
      }
      if(this.showhowmanyyear>1){
        this.pureAry.push(yeartotal);
        this.pureDateAry.push(year);
        if(maxnumber < yeartotal){
          maxnumber = yeartotal;//找出最大的年份数据
        }
      }
    }
    this.hstheightest = maxnumber;//找到最长的那一根柱子pure值
    this.hstwidth = 100/(this.pureAry.length*2);
  }

  //计算柱状图长宽
  getwaterhistogramheight(item:number):string{
    this.showwaterhistogram();
    // style="width:{{hstwidth}}%;--hst-height:calc({{(item/hstheightest)*100}}%);height: var(--hst-height);"
    return("width:"+this.hstwidth+"%;--hst-height:calc("+(item/this.hstheightest)*100+"%;height: var(--hst-height);");
  }

  //计算柱状图下面显示日期div的宽度
  gethistogramdatewidth():string{
    this.showwaterhistogram();
    // style="width:{{hstwidth}}%"
    return("width:"+this.hstwidth+"%;");
  }
  
  //点击记录找出柱状位置
  getthatstick(index:number){
    let date:Date = new Date();
    let answer:number;
    this.showAryIndex = index;
    date.setTime(this.showDataAry[index].time);
    if(this.showhowmanymonth <= 1){
      answer = date.getDate();
      for(let i=0;i<this.pureDateAry.length;i++){
        if(answer == this.pureDateAry[i]){
          this.findoutstick = i;
          break;
        }
      }
    }
    if(this.showhowmanymonth > 1 && this.showhowmanyyear <=1){
      answer = date.getMonth()+1;
      for(let i=0;i<this.pureDateAry.length;i++){
        if(answer == this.pureDateAry[i]){
          this.findoutstick = i;
          break;
        }
      }
    }
    if(this.showhowmanyyear >1){
      answer = date.getFullYear();
      for(let i=0;i<this.pureDateAry.length;i++){
        if(answer == this.pureDateAry[i]){
          this.findoutstick = i;
          break;
        }
      }
    }
  }

  //统计栏位移
  // gettotaltranslate(){
  //   if(this.totalbartranslate == "transform:translateX(-66.66%)"){
  //     this.totalbartranslate = "transform:translateX(0)";
  //   }else if(this.totalbartranslate == "transform:translateX(-33.33%)"){
  //     this.totalbartranslate ="transform:translateX(-66.66%)";
  //   }else{
  //     this.totalbartranslate = "transform:translateX(-33.33%)";
  //   }
  // }

  //接受appDateToTop指令传入的参数
  getthatdate(e){
    this.showtopdate = e;
  }

  initdata(){
    this.ai.getdata();
  }

  constructor(public ai:AiService) { }

  ngOnInit(){
    this.initdata();//获取数据
    this.showdata();//显示数据
    this.selectedmonth = this.ai.selectedMonthAry;//获取下拉框月份选择项数组
    this.selectedyear = this.ai.selectedYearAry;//获取下拉框年份选择项数组
    this.showpurehistogram();//显示柱状图
  }

  public touchstartevent($event){
    this.startY = $event.changedTouches["0"].clientY;
    this.totalbarrotatespeed = "animation-duration:5s;animation-timing-function:linear;";
    console.log('开始触摸');
  }

  touchmoveevent($event){
    this.toploadmsg = '松手后加载';
    this.bottomloadmsg = '松手后加载';
    this.totalbarrotatespeed = "animation-duration:1s;animation-timing-function:linear;";
    this.touchMove = $event.target.touchmove;
    // console.log($event);
    console.log('手指移动中...');
  }

  touchendevent($event){
    this.totalbarrotatespeed = "animation-duration:10s;animation-timing-function:ease-out;";
    this.clientHeight = $event.view.innerHeight;
    this.endY = $event.changedTouches["0"].clientY;
    this.swipedUp = this.startY - this.endY;
    this.swipedDown = this.endY - this.startY;
    if(this.swipedUp>20&&this.monthcheck==false&&this.yearcheck==false){
      if(this.viewAtBottom){
        this.loadmore();
      }
    }
    if(this.swipedDown>20){
      if(this.viewAtTop){
        this.toploadmsg = '正在加载数据...';
        console.log('手指离开，正在加载数据');
        this.toploadmsg = '加载数据完成';
      }
    }
    if(this.swipedDown>0){
      console.log('向下滑动距离为'+this.swipedDown);
    }else if(this.swipedUp>0){
      console.log('向上滑动距离为'+this.swipedUp);
    }else{
      console.log('没有滑动');
    }
  }

  public scrolling($event){
    this.scrollTop = $event.target.scrollTop;
    this.clientHeight = $event.target.offsetHeight;
    this.scrollHeight = $event.target.scrollHeight;
    this.viewAtTop = this.scrollTop<10?true : false;
    this.viewAtBottom = this.scrollTop+this.clientHeight+10>this.scrollHeight?true : false;
    if(this.scrollTop+this.clientHeight+50>this.scrollHeight&&!this.monthcheck&&!this.yearcheck){
      this.loadmore();
    }
    if(this.scrollTop+this.clientHeight==this.scrollHeight&&!this.monthcheck&&!this.yearcheck){
      this.datashowbottombarstyle = "display: flex;"
    }else{
      this.datashowbottombarstyle = "display: none;"
    }
  }
}
