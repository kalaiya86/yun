<?php

namespace App\Contracts;


interface  SmsContract
{
    public function sendSms($data);
}