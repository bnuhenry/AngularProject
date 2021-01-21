<?php
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=UTF-8");
//接受前端发来的数据
$postData = file_get_contents('php://input', true);
$obj=json_decode($postData);

$db = "wechat";
$ip = "127.0.0.1:3306";
$user = "root";
$pass = "tbchenry";
$shakey = "omgthatsreally@coolyesitis";
$tokenkey = "nomoreverifyplease";
$username = "";
$password = "";

//声明需要输出前端的简单类
class Result{
    var $username = "";
    var $result = "";
    var $successlogin = false;
    var $sign = "";
    var $accountid = 0;
    var $token = "";
    var $time = 0;
}

$resultobj = new Result();
$resultobj->result = "已连接数据库，一切正常";
$resultobj->time = $obj->time;

if(empty($obj->username)){
    $username = "thereisnodatacomeout";
}else{
    $username = $obj->username;
    $password = $obj->password;
    $resultobj->username = $obj->username;
}

$resultobj->sign = sha1($shakey."".$username);

global $con;
if($obj->sign!=$resultobj->sign){
    $resultobj->result = "接口已被篡改";
}else{$con = @mysqli_connect($ip, $user, $pass,$db);
    if (!$con){
        $resultobj->result = "连接数据库失败";
            mysqli_close($con);
        }else{
        $username = strtoupper($username);
        $password = strtoupper($password);
        $username = mysqli_real_escape_string($con, $username);
        $password = mysqli_real_escape_string($con, $password);
        $qry = @mysqli_query($con, "select * from wechat.account where username = '" . $username . "'");
        if (!$qry) 
        {
            $resultobj->result = "查询数据库失败";
        }
        else
        {
            if(mysqli_num_rows($qry)<1)
            {
            $resultobj->result = "账号不存在" ;
            mysqli_close($con);
            }
            else
            { 
                $row=mysqli_fetch_assoc($qry);
                if($username == $row['username']) 
                {
                    if(sha1($username . ":" . $password) == $row['sha_pass_hash'])
                    {
                        $resultobj->accountid = $row['id'];
                        $resultobj->result = "登录成功！" ;
                        $resultobj->successlogin = true;
                        mysqli_close($con);
                        $resultobj->token = sha1($tokenkey."".strval($resultobj->accountid)."".strval($resultobj->time));
                    }
                    else
                    {
                    $resultobj->result = "密码错误，请重新输入" ;
                    mysqli_close($con);
                    }
                }
            }
        }
    }
}

echo json_encode($resultobj);
?>