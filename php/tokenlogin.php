<?php
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=UTF-8");
//接受前端发来的数据
$postData = file_get_contents('php://input', true);
$obj=json_decode($postData);

$tokenkey = "nomoreverifyplease";
$now = time();
$token = "";

//声明需要输出前端的简单类
class Result{
    var $result = "";
    var $successlogin = false;
}

$resultobj = new Result();
$resultobj->result = "已连接验证页面";
$logintime = intval(substr($obj->logintime,0,10));

if($now > $logintime + 1*24*60*3600){
    $resultobj->successlogin = false;
    $resultobj->result = "令牌已过期，请重新登录";
}else{
    $token = sha1($tokenkey."".$obj->accountid."".$obj->logintime);
    if($obj->token == $token){
        $resultobj->successlogin = true;
        $resultobj->result = "令牌验证通过";
    }else{
        $resultobj->successlogin = false;
        $resultobj->result = "令牌验证失败";
    }
}

echo json_encode($resultobj);
?>