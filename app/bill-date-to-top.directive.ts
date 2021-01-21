import { Directive,HostListener,ElementRef,Output,Input,EventEmitter } from '@angular/core';

@Directive({
  selector: '[appBillDateToTop]'
})
export class BillDateToTopDirective {
  @Input('appBillDateToTop') selector: string = '';

  @Output()
  public showtopdate:EventEmitter<any> = new EventEmitter<any>();

  //日期行吸顶效果，查找各显示日期的位置并计算目前顶部处于哪两个日期之间，最后传递参数
  @HostListener('scroll',['$event'])onScroll($evnet:Event){
    this.scrollTop = this.el.nativeElement.scrollTop;
    this.toTopElement = this.el.nativeElement.querySelectorAll('.' + this.selector);
    for(let i=0;i<=this.toTopElement.length-1;i++){
      if(this.toTopElement[i].offsetParent.offsetTop<this.scrollTop){
        // this.nowshowdate = this.toTopElement[i].innerText;
        this.billdate = this.toTopElement[i].children[0].children[0].children[0].children[0].innerText;
        this.billtotal = this.toTopElement[i].children[0].children[1].innerText;
        this.emitary[0] = this.billdate;
        this.emitary[1] = this.billtotal;
      }
    }
    this.showtopdate.emit(this.emitary);
  }
  scrollTop:number;
  toTopElement: any;
  billdate:string;
  billtotal:string;
  emitary:Array<string> = [];

  constructor(private el:ElementRef) { }

}
