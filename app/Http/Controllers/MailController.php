<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Mail;

class MailController extends Controller
{
    /**
     * 邮件验证
     */
    public function send()
    {
        $name = '测试';
        $flag = Mail::send('emails.test',['name'=>$name],function($message){

            $to = 'rui.chen_c@chinapnr.com';

            $message ->to($to)->subject('测试邮件');
        });

        if( $flag ){

            echo '发送邮件成功，请查收！';

        }else{

            echo '发送邮件失败，请重试！';

        }
    }

}
