<?php
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=utf-8");
//接受前端发来的数据
$postData = file_get_contents('php://input', true);
$dealdataary = json_decode($postData);
// $i = json_decode($postData);

$od = $dealdataary[0];
$nd = $dealdataary[1];

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
if($od->time>0){
    $time = strval($od->time);
}else{
    $time = "thereisnodatacomeout";
}
$resultobj->sign = sha1($key."".$time);


if($od->sign!=$resultobj->sign){
    $resultobj->result = "接口已被篡改";
}else{
    $con = new mysqli($ip, $user, $pass,$db);
    $resultobj->username = $od->username;
    if ($con->connect_error) {
        die("连接失败: " . $con->connect_error);
        $resultobj->result = "连接数据库失败";
    }else{
        mysqli_query($con, "set names 'UTF8'");
        // "select * from " . mysqli_real_escape_string($con, $db) . ".payment where username = '" . $od->username . "' AND amount = " . $od->amount . " AND cost = '" . $od->cost . "' AND dealtype = '" . $od->dealtype . "' AND time = '" . $od->time . "'"
        $query = @mysqli_query($con, "select * from payment where username = '" . $od->username . "' AND cost = " . $od->cost . " AND dealtype = " . $od->dealtype . " AND time = " . $od->time . "");
        if (!$query){
            $resultobj->result = "查询数据库失败" . mysqli_error();
        }else{
            if(mysqli_num_rows($query)<1){
            $resultobj->result = "找不到此交易记录!" ;
            mysqli_close($con);
            }else{
                unset($query);
                mysqli_query($con, "set names 'UTF8'");
                $upload_sql = "update payment set amount = '" . $nd->amount . "' ,cost = '" . $nd->cost . "',time = '" . $nd->time . "' where username = '" . $od->username . "' AND cost = " . $od->cost . " AND dealtype = " . $od->dealtype . " AND time = " . $od->time . "";
                mysqli_query($con, $upload_sql);
                if (mysqli_affected_rows($con)){
                    $resultobj->result = "'" .$resultobj->username. "'的交易信息修改成功";
                    $resultobj->success = "true";
                    mysqli_close($con);
                }else{
                    $resultobj->result = "修改交易记录失败!";
                    mysqli_close($con);
                }
            }
        }
    }
}

echo json_encode($resultobj);
?>