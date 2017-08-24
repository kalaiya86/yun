<?php

namespace App\Http\Controllers;

use App\Contracts\SmsContract;
use Illuminate\Http\Request;

use App\Http\Requests;

class SocketControllerol extends Controller
{

    public function client(){

        error_reporting(E_ALL);

        set_time_limit(0);

        $socket=socket_create( AF_INET, SOCK_STREAM, SOL_TCP );

        if ( $socket < 0 ){

            echo "socket_create() failed: reason: " . socket_strerror($socket) . "\n";

        }else{

            echo "OK.\n";

        }

        $result = socket_connect( $socket, $ip='192.168.0.47', $port='7210' );

        if ( $result < 0 ){

            echo "socket_connect() failed.\nReason: ($result) " . socket_strerror($result) . "\n";

        }else{

            echo "连接OK\n";
        }

        $content= "0035100001|18321983957|测试短信|private";

        if(!socket_write($socket, $content, strlen( $content ))){

            echo "socket_write() failed: reason: " . socket_strerror($socket) . "\n";

        }else{

            echo "发送到服务器信息成功！\n";
            echo "发送的内容为:<font color='red'>$content</font><br>";
        }

        while( $out  = socket_read( $socket, 100 ) ) {

            echo __LINE__."接收的内容为:". $out ."<br>";

        }
    }

    public function testSendSms(SmsContract $sms){

        $phone ='18321983957';

        $info = $sms->sendSms( $phone );

        printf($info);
    }

}
