<?php
header("Access-Control-Allow-Origin:*");
header('Access-Control-Allow-Methods:*');
header('Access-Control-Allow-Headers:content-type,token,id');
header("Access-Control-Request-Headers: Origin, X-Requested-With, content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=utf-8");
//接受前端发来的数据
//$dealtype = file_get_contents('php://input', true);
//$dealtype = json_decode($postData);
$dealtype = 5;



$realmip = "127.0.0.1";
$realmport = "8085";
$ip = "127.0.0.1:3306";
$user = "root";
$pass = "";
$db = "";
$amount = 0;
$res = "";
$result = "";
$dealwithuser = "";
global $con, $pl_array;


$con = @mysqli_connect($ip, $user, $pass,$r_db);
if (!$con) {
                $result = "> 连接数据库失败" . mysqli_error();
}
else
{
	unset($query);
    mysqli_query($con, "set names 'UTF8'");
    $query = @mysqli_query($con, "select * from " . mysqli_real_escape_string($con, $db) . ".payment where dealtype ='" . $dealtype . "'");
    if (!$query) {
        $result = " 查询数据库失败 " . mysqli_error();
    }
    else
    {
        while($res = mysqli_fetch_assoc($query)){
            $dealwithuser = $res['dealwithuser'];
            $amount = $res['amount'];
        }
    }
};

//		直接输出翻译后的职业和种族名称
//		$char_race = $def['character_race'][$char_raceid];
//		$char_class = $def['character_class'][$char_classid];
//echo json_encode($pl_array);
echo ($dealwithuser);
echo ($amount);
echo ($result);

?>