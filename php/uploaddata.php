<?php
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=utf-8");
//接受前端发来的数据
$postData = file_get_contents('php://input', true);
$dataary = json_decode($postData);
// $i = json_decode($postData);

$realmip = "127.0.0.1";
$realmport = "8085";
$ip = "127.0.0.1:3306";
$user = "root";
$pass = "";
$db = "";
$amount = 0;
$cost;
$result = "";
$username = "";
global $con;


$con = new mysqli($ip, $user, $pass,$db);
if ($con->connect_error) {
    die("连接失败: " . $con->connect_error);
    $result = "连接数据库失败";
}
	unset($query);
    mysqli_query($con, "set names 'UTF8'");
    foreach($dataary as $i){
        // $upload_sql = "insert into payment (username, amount, cost, dealtype, userimg, usertype, time) values ('"&$i->username&"','"&$i->amount&"','"&$i->cost&"','"&$i->dealtype&"','"&$i->userimg&"','"&$i->usertype&"','"&$i->time&"')";
        $upload_sql = "insert into " . mysqli_real_escape_string($con, $db) . ".payment (username, amount, cost, dealtype, userimg, usertype, time) values ('" . $i->username . "','" . $i->amount . "','" . $i->cost . "','" . $i->dealtype . "','" . $i->userimg . "','" . $i->usertype . "','" . $i->time . "')";
        // '" . $dataary[$i]->username . "','" . $dataary[$i]->amount . "','" . $dataary[$i]->cost . "','" . $dataary[$i]->dealtype . "','" . $dataary[$i]->userimg . "','" . $dataary[$i]->usertype . "','" . $dataary[$i]->time . "'
        // $qry = @mysqli_query($con, $upload_sql);
        echo ($upload_sql);
        if ($con->query($upload_sql)===true) {
            $result = "插入成功";
            echo ($result);
        }
        else
        {
            echo "Error: " . $upload_sql . "<br>" . $con->error;
            $result = "插入失败!";
            echo ($result);
        };
    }
    $con->close();

// echo (count($dataary));
echo ($result);
?>