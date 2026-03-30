<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends BaseResetPassword
{
    public function toMail($notifiable): MailMessage
    {
        $resetUrl = $this->resetUrl($notifiable);

        return (new MailMessage)
            ->subject('Reset your password - Aurum Node')
            ->view('emails.password-reset', [
                'user' => $notifiable,
                'resetUrl' => $resetUrl,
            ]);
    }
}

