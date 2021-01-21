import { Directive,HostListener,ElementRef,Output,Input,EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDateToTop]'
})
export class DateToTopDirective {
  @Input('appDateToTop') selector: string = '';

  @Output()
  public showtopdate:EventEmitter<any> = new EventEmitter<any>();

  //日期行吸顶效果，查找各显示日期的位置并计算目前顶部处于哪两个日期之间，最后传递参数
  @HostListener('scroll',['$event'])onScroll($evnet:Event){
    this.scrollTop = this.el.nativeElement.scrollTop;
    this.toTopElement = this.el.nativeElement.querySelectorAll('.' + this.selector);
    for(let i=0;i<=this.toTopElement.length-1;i++){
      if(this.toTopElement[i].offsetParent.offsetTop<this.scrollTop){
        this.nowshowdate = this.toTopElement[i].innerText;
      }
    }
    this.showtopdate.emit(this.nowshowdate);
  }
  scrollTop:number;
  toTopElement: any;
  nowshowdate:string;

  constructor(private el:ElementRef) { }

}
