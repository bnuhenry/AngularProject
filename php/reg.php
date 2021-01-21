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
$username = "";
$password = "";
$date = new DateTime();

//声明需要输出前端的简单类
class Result{
var $username = "";
var $result = "";
var $successreg = false;
var $sign = "";
}

$resultobj = new Result();
$resultobj->result = "已连接数据库，一切正常";

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
}else{
    $con = @mysqli_connect($ip, $user, $pass,$db);
    if (!$con) {
        $resultobj->result = "连接数据库失败" . mysqli_error();
    }
    else
    {
        $username = mysqli_real_escape_string($con, $username);
        $password = mysqli_real_escape_string($con, $password);
        unset($qry);
        $qry = @mysqli_query($con, "select username from wechat.account where username = '" . $username . "'");
        if (!$qry) {
            $resultobj->result = "查询数据库失败 " . mysqli_error();
        }
        else
        {
            if ($existing_username = mysqli_fetch_assoc($qry)) {
                foreach ($existing_username as $key => $value) {
                    $existing_username = $value;
                };
            };
            $existing_username = strtoupper($existing_username);
            if ($existing_username == strtoupper($username)) {
                $resultobj->result = "用户名已被占用";
                mysqli_close($con);
            }
            else
            {
                unset($qry);
                $sha_pass_hash = sha1(strtoupper($username) . ":" . strtoupper($password));
                $register_sql = "insert into wechat.account (username, sha_pass_hash, joindate) values (upper('" . $username . "'),'" . $sha_pass_hash . "','".$date->format('Y-m-d H:i:s')."')";
                $qry = @mysqli_query($con, $register_sql);
                if(!$qry){
                    $resultobj->result = "创建账号失败" . mysqli_error();
                }else{
                    $resultobj->result = "账号注册成功!";
                    $resultobj->successreg = true;
                    mysqli_close($con);
                };
            };
        };
    
    };
}
echo json_encode($resultobj);

?>