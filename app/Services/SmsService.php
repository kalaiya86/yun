<?php
namespace App\Services;

use App\Contracts\SmsContract;
use Session;
use Log;
use Cache;

class SmsService implements SmsContract
{
    private $sms_ip = '';                      // ip地址
    private $sms_port = '';                     // 端口
    private $sms_mer = '';                      // 机构号
    /**
     * 构造函数
     */
    public function __construct()
    {
        $this->sms_ip   = config('app.sms_ip');
        $this->sms_prot = config('app.sms_port' );
        $this->sms_comment = "验证短信:%s";
        $this->sms_mer = config('app.sms_mer');
    }

    /**
     * @param $phone   string   手机号
     * @param $comment string   发送的内容
     */
    public function sendSms($phone)
    {
        Log::info("sendsms request Responser: " . 'sms_ip:'."$this->sms_ip " .'sms_prot:'.$this->sms_prot);
        $socket=socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        if ($socket<0){
            $create_error = socket_strerror($socket);
            Log::info(__FILE__.": sendsms to create_error" . __LINE__ . $create_error );
            return 0;
        }
        $result = socket_connect($socket, $this->sms_ip, $this->sms_prot);
        if ($result<0){
            $connect_error = socket_strerror( $result );
            Log::info(__FILE__.": sendsms to connect_error:" . __LINE__ . $connect_error );
            return 0;
        }
        $comment = $this->getComment($phone);
        Log::info("sendsms comment Responser: " . __LINE__ .$comment );
        if (!socket_write($socket, $comment, strlen($comment)) ){
            $write_error = socket_strerror($socket);
            Log::info(__FILE__.": sendsms to write_error" .__LINE__ . $write_error);
            return 0;
        }

        $sms_out = '';
        while($out = socket_read($socket, 100) ) {
            $sms_out .= $out;
        }
        Log::info("sendsms Return  Responser:".$sms_out);
        socket_close($socket);
        return 1;
    }

    /**
     * @param $code 输入的验证码;
     * $param $sms_code session中存放的验证码;
     */
    public function checkCode($code)
    {
        $sms_code = Session::get('sms_code');
        if ( $code != $sms_code )
        {
            return false;
        }else{
            return true;
        }
    }
    /**
     * @param $phone  手机号
     * @param $sms_code 验证码
     */
    private function getComment($phone)
    {
        $sms_code = rand(99999, 999999);
        Session::put('sms_code', $sms_code );
        $sms_comment = sprintf($this->sms_comment,$sms_code);
        $comment = $this->sms_mer.'|'.$phone.'|'.$sms_comment.'|private';
        $leng    = strlen($comment);
        $comment = '00'.$leng.$comment;
        return $comment;
    }

}