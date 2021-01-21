import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css']
})


export class ContentsComponent implements OnInit {
  clientHeight:number;
  startY:number;
  endY:number;
  swipedUp:number;
  swipedDown:number;
  scrollTop:number;
  scrollHeight:number;
  toploadmsg:string = '下拉加载';
  bottomloadmsg:string = '上拉加载';
  viewAtTop:boolean;
  viewAtBottom:boolean;
  date:Date = new Date();
  newsAry:Array<any>;
  newsShowAry:Array<any>=[];
  newsIndex:number;
  newsshowbottombarstyle:string;

  url = 'https://api.apiopen.top/getWangYiNews';
  httpOptions = {headers : new HttpHeaders({
    "content-type": "application/x-www-form-urlencoded"
     })};
  // url = 'https://www.toutiao.com/';
  // httpOptions = {headers : new HttpHeaders({
  //   "cache-control": " max-age=0",
  //   "Cookie": "tt_webid=6908254472054900231; ttcid=1a4a2d606ff345b682a6c0754a54200540; csrftoken=484187db07eef7a35f4549ec6fb9eec2; tt_webid=6908254472054900231; passport_csrf_token=89ac4b3e88301cbff0520cb3bdc29acd; sso_uid_tt=433679fc5d6340842ecb1fd259166680; sso_uid_tt_ss=433679fc5d6340842ecb1fd259166680; toutiao_sso_user=253905291d0615ad22fe6d39c542a6cd; toutiao_sso_user_ss=253905291d0615ad22fe6d39c542a6cd; s_v_web_id=verify_kj3oyjat_0P1rbXEq_rujx_47uX_BG0o_sRvAc0FI2dmb; __ac_signature=_02B4Z6wo00f01efSl.wAAIBB-JeJp1ODwmXn1pNAACYUeJjpU7btE1h8.Xn6KGM40MzYYQAjVSiON4YA0iZbKPUda8wB.pYxSn8KiRB6GJXuFEXFJGWrI10J8GsPqs2JhKEf0n83.HTsfPNtae; MONITOR_WEB_ID=d610cd62-9fda-41dd-806b-c34ed3bbfcde; tt_scid=lhEUamvrbuwS42izcCwbFHzYdFXkXb5jMuNsvOXY10c6zCSxPeIo1o0Zt2NJE8BB7cab; _ga=GA1.2.956211976.1608874660; _gid=GA1.2.1187514673.1608874660",
  //   "Host": "mcs.snssdk.com",
  //   "Origin": "https://www.toutiao.com",
  //   "Referer": "https://m.toutiao.com/",
  //   "Sec-Fetch-Dest": "document",
  //   "Sec-Fetch-Mode": "navigate",
  //   "Sec-Fetch-Site": "same-site",
  //   "sec-fetch-user": "?1",
  //   "upgrade-insecure-requests": "1",
  //   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"
  // })};

  constructor(public http:HttpClient) { }

   async getnewsdata(){
    this.http.post(this.url,this.httpOptions).subscribe((data)=>{
      this.newsAry = data['result'];
      for(this.newsIndex = 0;this.newsIndex<5;this.newsIndex++){
        this.newsShowAry.push(this.newsAry[this.newsIndex]);
      }
    })
  }

  public touchstartevent($event){
    this.startY = $event.changedTouches["0"].clientY;
    console.log('开始触摸');
  }

  touchmoveevent($event){
    this.toploadmsg = '松手后加载';
    this.bottomloadmsg = '松手后加载';
    // this.touchMove = $event.target.touchmove;
    // console.log(this.touchMove);
    console.log('手指移动中...');
  }

  touchendevent($event){
    this.clientHeight = $event.view.innerHeight;
    this.endY = $event.changedTouches["0"].clientY;
    this.swipedUp = this.startY - this.endY;
    this.swipedDown = this.endY - this.startY;
    if(this.swipedUp>20){
      if(this.viewAtBottom){
        this.bottomloadmsg = '加载中...';
        // console.log($event);
        console.log('手指离开');
        this.loadmorenews();  
      }
    }
    if(this.swipedDown>20){
      if(this.viewAtTop){
        this.toploadmsg = '正在刷新时间...';
        console.log('手指离开，正在刷新时间');
        this.date = new Date();
        this.toploadmsg = '刷新时间完成';
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

  loadmorenews():void{
    if(this.newsIndex<this.newsAry.length){
      this.newsShowAry.push(this.newsAry[this.newsIndex]);
      this.newsIndex+=1;
      this.bottomloadmsg = '加载完成，可继续下拉加载';
    }else{
      this.bottomloadmsg = '没有更多内容可加载';
    }
  }

  public scrolling($event){
    this.scrollTop = $event.target.scrollTop;
    this.clientHeight = $event.target.offsetHeight;
    this.scrollHeight = $event.target.scrollHeight;
    this.viewAtTop = this.scrollTop<10?true : false;
    this.viewAtBottom = this.scrollTop+this.clientHeight+10>this.scrollHeight?true : false;
    if(this.scrollTop+this.clientHeight+20>this.scrollHeight){
      this.loadmorenews();
    }
    if(this.scrollTop+this.clientHeight==this.scrollHeight){
      this.newsshowbottombarstyle = "display: flex;"
    }else{
      this.newsshowbottombarstyle = "display: none;"
    }
  }

  ngOnInit(){
    this.getnewsdata();
  }

}
