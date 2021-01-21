import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POSTDATA,TOTALPOSTDATA,DEAL } from '../statement';
import { hex_sha1 } from '../sha1';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private paymentDBDownUrl = 'http://119.29.170.42/api/getmoredatadown.php';
  private paymentDBUpUrl = 'http://119.29.170.42/api/getmoredataUp.php';
  private totalDBUrl = 'http://119.29.170.42/api/totaldata.php';
  private UpLoadNewDBUrl = 'http://119.29.170.42/api/updatenewdeal.php';
  private UpDateNewDBUrl = 'http://119.29.170.42/api/updateolddeal.php';
  private deleteDataDBUrl = 'http://119.29.170.42/api/deletedealdata.php';

  private getSign(time:number):string{
    let key:string = "omgthatsreally@coolyesitis";
    let timestr:string;
    timestr = time.toString();
    let sha1result:string = hex_sha1(key+timestr);
    return sha1result;
  }

  httpOptions = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
getDataAryDown(postData:POSTDATA):Observable<any>{
  postData.sign = this.getSign(postData.time);
  return this.http.post(this.paymentDBDownUrl,postData,this.httpOptions);
}

getDataAryUp(postData:POSTDATA):Observable<any>{
  postData.sign = this.getSign(postData.time);
  return this.http.post(this.paymentDBUpUrl,postData,this.httpOptions);
}

getTotalData(totalPostData:TOTALPOSTDATA):Observable<any>{
  totalPostData.sign = this.getSign(totalPostData.starttime);
  return this.http.post(this.totalDBUrl,totalPostData,this.httpOptions);
}

upLoadDealData(upDateDeal:DEAL):Observable<any>{
  upDateDeal.sign = this.getSign(upDateDeal.time);
  return this.http.post(this.UpLoadNewDBUrl,upDateDeal,this.httpOptions);
}

updateDealData(postDealAry:Array<DEAL>):Observable<any>{
  postDealAry[0].sign = this.getSign(postDealAry[0].time);
  return this.http.post(this.UpDateNewDBUrl,postDealAry,this.httpOptions);
}

deleteDealData(deleteDeal:DEAL):Observable<any>{
  deleteDeal.sign = this.getSign(deleteDeal.time);
  return this.http.post(this.deleteDataDBUrl,deleteDeal,this.httpOptions);
}

  constructor(private http:HttpClient) { }
}
