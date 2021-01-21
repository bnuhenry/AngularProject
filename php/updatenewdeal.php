<?php
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=utf-8");
//接受前端发来的数据
$postData = file_get_contents('php://input', true);
$dealdata = json_decode($postData);
// $i = json_decode($postData);

$realmip = "127.0.0.1";
$realmport = "8085";
$ip = "127.0.0.1:3306";
$user = "root";
$pass = "";
$db = "";
$key = "";
$time = "";
global $con;

//声明需要输出前端的简单类
class Result{
    var $username = "";
    var $result = "";
    var $success = "";
    var $sign = "";
    }

$resultobj = new Result();
$resultobj->result = "已连接数据库，一切正常";
$resultobj->success = "false";
if($dealdata->time>0){
    $time = strval($dealdata->time);
}else{
    $time = "thereisnodatacomeout";
}
$resultobj->sign = sha1($key."".$time);

if($dealdata->sign!=$resultobj->sign){
    $resultobj->result = "接口已被篡改";
}else{
    $con = new mysqli($ip, $user, $pass,$db);
    if(!empty($dealdata->username)){
        $resultobj->username = $dealdata->username;
        if ($con->connect_error) {
            die("连接失败: " . $con->connect_error);
            $resultobj->result = "连接数据库失败";
        }
        unset($query);
        mysqli_query($con, "set names 'UTF8'");
        $upload_sql = "insert into " . mysqli_real_escape_string($con, $db) . ".payment (username, amount, cost, dealtype, userimg, usertype, time) values ('" . $dealdata->username . "','" . $dealdata->amount . "','" . $dealdata->cost . "','" . $dealdata->dealtype . "','" . $dealdata->userimg . "','" . $dealdata->usertype . "','" . $dealdata->time . "')";
        // echo ($upload_sql);
        if ($con->query($upload_sql)===true) {
            $resultobj->result = "'" .$resultobj->username. "'的交易信息上传成功";
        }
        else
        {
            echo "Error: " . $upload_sql . "<br>" . $con->error;
            $resultobj->result = "上传失败!";
        };
        $con->close();
    }else{
        $resultobj->result = "数据为空!上传失败!";
    };
}

echo json_encode($resultobj);
?>