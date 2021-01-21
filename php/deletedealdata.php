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
$pass = "tbchenry";
$db = "wechat";
$key = "omgthatsreally@coolyesitis";
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
    if($dealdata->username!=''){
        $resultobj->username = $dealdata->username;
        if ($con->connect_error) {
            die("连接失败: " . $con->connect_error);
            $resultobj->result = "连接数据库失败";
        }else{
            mysqli_query($con, "set names 'UTF8'");
            $query = @mysqli_query($con, "select * from payment where username = '" . $dealdata->username . "' AND cost = " . $dealdata->cost . " AND dealtype = " . $dealdata->dealtype . " AND time = " . $dealdata->time . "");
            if (!$query){
                $resultobj->result = "查询数据库失败" . mysqli_error();
            }else{
                if(mysqli_num_rows($query)<1){
                $resultobj->result = "找不到此交易记录!" ;
                mysqli_close($con);
                }else{
                    unset($query);
                    mysqli_query($con, "set names 'UTF8'");
                    $delete_sql = "delete from payment where username = '" . $dealdata->username . "' AND cost = " . $dealdata->cost . " AND dealtype = " . $dealdata->dealtype . " AND time = " . $dealdata->time . "";
                    mysqli_query($con, $delete_sql);
                    if (mysqli_affected_rows($con)){
                        $resultobj->result = "'" .$resultobj->username. "'的交易信息已经成功删除";
                        $resultobj->success = "true";
                        mysqli_close($con);
                    }else{
                        $resultobj->result = "删除交易记录失败!";
                        mysqli_close($con);
                    }
                }
            }
        }
    }else{
        $resultobj->result = "接收数据为空!删除交易记录失败!";
    };
}

echo json_encode($resultobj);
?>