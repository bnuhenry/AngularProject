import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
dataScale:number;
dataScalePercent:number;
scrollTop:number;
stopmove:boolean;
topScaleY:string;
filterScaleX:string;
dataScaleY:string;
noticeFadeAway:string;
toolbarSubname:string = "color:lightblue";
mentionbarShow:string = "color:rgb(0, 255, 0)";
htgary:Array<number> = [6,3,2,16,10,2,17,4,25];


  constructor() { }

  public touchmoveevent($event){
    if(this.scrollTop<0){
      this.stopmove = true;
      $event.preventDefault();
    }
    else{
      this.stopmove = false;
    }
  }

  public scrolling($event){
    this.scrollTop=$event.target.scrollTop
    if(this.stopmove){
      $event.target.scrollTop = 0;
    }
    this.dataScale = 0.2-$event.target.scrollTop/$event.target.offsetHeight;
    this.dataScalePercent = 40 + this.dataScale * 50;
    if(this.dataScale>0){
      if($event.target.scrollTop>0){
        this.toolbarSubname="display:none";
        this.mentionbarShow = "display:none";
        }else{
          this.toolbarSubname = "color:lightblue";
          this.mentionbarShow = "color:rgb(0, 255, 0)";
        }
    this.topScaleY = `transform:scaleY(${(0.8+this.dataScale).toFixed(2)})`;
    this.filterScaleX = `transform:scaleX(${(0.8+this.dataScale).toFixed(2)})`;
    this.dataScaleY = `height:${(50*(1.2-this.dataScale)).toFixed(2)}%;top:${this.dataScalePercent.toFixed(2)}%`;
    }else{
      this.topScaleY = "transform:scaleY(0.8)";
      this.dataScaleY = "height:60%;top:40%";
    }
  }


  ngOnInit() {
  }

  notice_Fade(){
    this.noticeFadeAway = "opacity:0;z-index:-50";
  }

}