import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthGuard } from '../auth.guard';
import { Account } from '../account';
import { AccountService } from './account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  successLogin:boolean = false;
  showRegForm:boolean = false;
  successInput:boolean = false;
  passTwoIsSame:boolean = false;
  loginUsername:string = '';
  loginMsg:string = '';
  account:Account = {
    username:'',
    password:'',
    time:0,
    sign:''
  };
  loginForm = new FormGroup({
    user: new FormControl(this.account.username, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(14)
    ]),
    pass: new FormControl(this.account.password, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12)
    ]),
});

  constructor(private auth:AuthGuard,private router:Router,private actService:AccountService) { }

  ngOnInit(): void {
    this.checkToken();
  }

  //token检查
  checkToken():void{
    this.actService.requestToken().subscribe(res=>{
      if(res['successlogin']){
        this.auth.successLogin = true;
        this.router.navigate(['equipment']);
      }
    });
  }

  //登录页面点击确认
  loginsubmit():void{
    let date = new Date();
    this.checkInputLegal();
    if(this.successInput){
      this.account.time = date.getTime();
      this.loginMsg = '验证中...';
      this.actService.login(this.account).subscribe(res=>{
        this.loginMsg = res['result'];
        if(res['successlogin']){
          window.localStorage.setItem('accountid',res['accountid']);
          window.localStorage.setItem('logintime',res['time']);
          window.localStorage.setItem('token',res['token']);
          this.auth.login();
          this.router.navigate(['equipment']);
        }
      });
    }
  }

  //点击注册
  goToReg():void{
    this.loginMsg = '';
    this.showRegForm = true;
  }

  //注册页面点击提交
  regSubmit():void{
    this.checkInputLegal();
    if(this.successInput){
      this.loginMsg = '正在注册...';
      this.actService.registration(this.account).subscribe(res=>{
        this.loginMsg = res['result'];
        if(res['successreg']){
          this.showRegForm = false;
          this.loginForm.reset();
        }
      });
    }
  }

  //注册页面取消按钮
  backToLogin():void{
    this.loginMsg = '';
    this.showRegForm = false;
  }

  //登录页面取消按钮
  cancelLogin():void{
    this.loginForm.setValue({user:'',pass:''});
    this.account.username = '';
    this.account.password = '';
    this.successInput = false;
  }

  //检查表单数据是否合法
  checkInputLegal():void{
    if ((this.loginForm.getError('required','user'))||(this.loginForm.getError('required','pass'))){
      this.loginMsg = "请完整填写账号密码信息";
    }else if ((this.loginForm.getError('minlength','user'))||(this.loginForm.getError('maxlength','user'))){
      this.loginMsg = "账号长度太短或者太长";
    }else if ((this.loginForm.getError('minlength','pass'))||(this.loginForm.getError('maxlength','pass'))){
      this.loginMsg = "密码长度太短或者太长";
    }else{
      if(this.passTwoIsSame&&this.showRegForm || !this.showRegForm){
        this.successInput = true;
        this.account.username = this.loginForm.value.user;
        this.account.password = this.loginForm.value.pass;
      }else{
        this.successInput = false;
        this.loginMsg = "两次密码输入不一样";
      }
    }
  }

  //检查确认密码是否一致
  checkPassConfirm(newpass2:string):void{
    this.passTwoIsSame = (newpass2 == this.loginForm.value.pass)?true:false;
    this.loginMsg = (newpass2 == this.loginForm.value.pass)?'输入的两个密码一致':'两个密码不一致'
  }

}
