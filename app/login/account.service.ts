import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account,Token } from '../account';
import { hex_sha1 } from '../sha1';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  token:Token;

  constructor(private http:HttpClient) { }
  
  private accountLoginUrl = 'http://119.29.170.42/api/login.php';
  private accountRegUrl = 'http://119.29.170.42/api/reg.php';
  private tokenLoginUrl = 'http://119.29.170.42/api/tokenlogin.php';

  private getSign(username:string):string{
    let key:string = "omgthatsreally@coolyesitis";
    let sha1result:string = hex_sha1(key+username);
    return sha1result;
  }

  httpOptions = {
    headers : new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
registration(postData:Account):Observable<any>{
  postData.sign = this.getSign(postData.username);
  return this.http.post(this.accountRegUrl,postData,this.httpOptions);
}

login(postData:Account):Observable<any>{
  postData.sign = this.getSign(postData.username);
  return this.http.post(this.accountLoginUrl,postData,this.httpOptions);
}

requestToken():Observable<any>{
  this.token = {
    accountid: window.localStorage.getItem('accountid'),
    logintime: window.localStorage.getItem('logintime'),
    token: window.localStorage.getItem('token'),
  }
  return this.http.post(this.tokenLoginUrl,this.token,this.httpOptions);
}

}
